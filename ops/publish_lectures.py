#!/usr/bin/env python3
"""Publish only staged lecture assets into the existing mitii.ru Docker site.

Install as root-owned /usr/local/sbin/mitii-publish-lectures.
The SSH deploy account must be able to write ONLY to the staging inbox and
invoke this executable via one narrowly scoped sudoers entry.
"""
from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime, timezone

SITE = Path("/srv/mitii")
STAGING = Path("/srv/mitii-deploy/lecture-inbox")
BACKUPS = Path("/srv/mitii-deploy/backups")
STATE = Path("/var/lib/mitii-lecture-publish/state.json")
COMPOSE = Path("/srv/mitii-deploy/compose.yaml")
REGISTRY = SITE / "data/sections.json"
REGISTRATION_FILE = "data/lecture-registrations.json"


def die(message: str) -> None:
    raise SystemExit("Refusing publication: " + message)


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def permitted(rel: str) -> bool:
    p = Path(rel)
    if not rel or p.is_absolute() or ".." in p.parts or "." in p.parts:
        return False
    if "\\" in rel or "//" in rel or str(p) != rel:
        return False
    if rel == REGISTRATION_FILE:
        return True
    if len(p.parts) < 2:
        return False
    top = p.parts[0]
    if top == "content":
        return p.suffix == ".md"
    if top == "data":
        return len(p.parts) >= 3 and p.parts[1] == "tests" and p.suffix == ".json"
    if top == "lib":
        return len(p.parts) == 2 and bool(re.fullmatch(r"[a-zA-Z0-9_-]*3d[a-zA-Z0-9_-]*\.js", p.name)) and p.name not in ("scene3d.js", "widgets3d.js")
    if top in ("media", "presentations"):
        return p.suffix.lower() in (".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".mp4", ".webm", ".glb", ".gltf", ".css", ".js", ".json", ".html")
    return False


def atomic_bytes(destination: Path, data: bytes) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    temp = None
    try:
        with tempfile.NamedTemporaryFile(prefix=".mitii-lecture-", dir=destination.parent, delete=False) as stream:
            temp = Path(stream.name)
            stream.write(data)
            stream.flush()
            os.fsync(stream.fileno())
        temp.chmod(0o644)
        os.replace(temp, destination)
    finally:
        if temp is not None and temp.exists():
            temp.unlink()


def ensure_normal_path(target: Path) -> None:
    if target.is_symlink() or any(p.is_symlink() for p in target.parents if str(p).startswith(str(SITE))):
        die("symlink in destination path: " + str(target))
    if not target.parent.resolve().is_relative_to(SITE.resolve()):
        die("path escapes site root: " + str(target))


def parse_registration(data: bytes, staged: dict[str, bytes]) -> bytes | None:
    try:
        entries = json.loads(data.decode("utf-8"))["entries"]
        if not isinstance(entries, list):
            die("lecture-registrations.json entries must be an array")
        doc = json.loads(REGISTRY.read_text(encoding="utf-8"))
    except (ValueError, KeyError, OSError) as exc:
        die("invalid registration or live sections.json: " + str(exc))

    changed = False
    for entry in entries:
        if not isinstance(entry, dict) or set(entry) != {"section", "item"}:
            die("registration entries require only section and item")
        sid, item = entry["section"], entry["item"]
        if not isinstance(sid, str) or not isinstance(item, dict):
            die("invalid section or item")
        matching = [s for s in doc.get("sections", []) if s.get("id") == sid]
        if len(matching) != 1:
            die("missing or ambiguous subject: " + sid)
        section = matching[0]
        item_id = item.get("id")
        if not isinstance(item_id, str) or not re.fullmatch("[a-zA-Z0-9_-]{1,80}", item_id):
            die("invalid lecture item id")
        if item.get("type") not in ("markdown", "cards", "test"):
            die("unsupported lecture item type")
        if not isinstance(item.get("title"), str) or not item["title"].strip():
            die("lecture title is missing")
        if item.get("date") is not None and not re.fullmatch(r"\d{4}-\d{2}-\d{2}", str(item["date"])):
            die("invalid lecture date")
        src = item.get("src")
        if item["type"] in ("markdown", "test"):
            if not isinstance(src, str) or not permitted(src):
                die("invalid lecture src")
            if src not in staged and not (SITE / src).is_file():
                die("missing content file for registration: " + src)
        for existing in section.get("items", []):
            if existing.get("id") == item_id:
                if existing != item:
                    die("Codex already has a different entry for " + sid + "/" + item_id)
                break
        else:
            section["items"].append(item)
            changed = True

    if not changed:
        return None
    return (json.dumps(doc, ensure_ascii=False, indent=2) + "\n").encode("utf-8")


def main() -> None:
    if len(sys.argv) != 2 or not re.fullmatch(r"[0-9a-f]{40}", sys.argv[1]):
        die("expected exactly one 40-character commit SHA")
    sha = sys.argv[1]
    base = STAGING / sha
    if not base.is_dir() or base.is_symlink() or not base.resolve().is_relative_to(STAGING.resolve()):
        die("invalid staging directory")
    listing = base / "files.json"
    if not listing.is_file() or listing.is_symlink():
        die("staged files.json is missing")
    try:
        files = json.loads(listing.read_text(encoding="utf-8"))
    except ValueError:
        die("invalid staged file list")
    if not isinstance(files, list) or len(files) != len(set(files)) or not files:
        die("file list must be a nonempty unique array")

    incoming: dict[str, bytes] = {}
    for rel in files:
        if not isinstance(rel, str) or not permitted(rel):
            die("unapproved file path: " + str(rel))
        path = base / rel
        if not path.is_file() or path.is_symlink() or not path.resolve().is_relative_to(base.resolve()):
            die("missing or unsafe staged file: " + rel)
        data = path.read_bytes()
        if rel.endswith(".json"):
            try:
                json.loads(data.decode("utf-8"))
            except ValueError:
                die("invalid JSON: " + rel)
        incoming[rel] = data

    if not COMPOSE.is_file() or not REGISTRY.is_file():
        die("existing web site or Docker config is missing")
    if REGISTRATION_FILE in incoming:
        registration = parse_registration(incoming[REGISTRATION_FILE], incoming)
        del incoming[REGISTRATION_FILE]
    else:
        registration = None

    try:
        state = json.loads(STATE.read_text(encoding="utf-8")) if STATE.exists() else {}
        if not isinstance(state, dict):
            die("invalid prior deployment state")
    except ValueError:
        die("invalid prior deployment state")

    updates: dict[str, bytes] = {}
    for rel, data in incoming.items():
        target = SITE / rel
        ensure_normal_path(target)
        old_hash = digest(target.read_bytes()) if target.is_file() else None
        next_hash = digest(data)
        expected = state.get(rel)
        if old_hash not in (None, next_hash) and old_hash != expected:
            die("locally modified file must be reconciled before update: " + rel)
        if old_hash != next_hash:
            updates[rel] = data
        state[rel] = next_hash

    if registration is not None:
        ensure_normal_path(REGISTRY)
        updates["data/sections.json"] = registration

    backup_root = BACKUPS / ("lectures-" + sha)
    retry = backup_root.exists()
    if retry and updates:
        die("commit was already published; changed local files require manual review")
    if not retry:
        backup_root.mkdir(parents=True, exist_ok=False)
        created = []
        for rel in updates:
            target = SITE / rel
            if target.exists():
                backup = backup_root / rel
                backup.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(target, backup)
            else:
                created.append(rel)
        (backup_root / "new-files.json").write_text(json.dumps(created, ensure_ascii=False), encoding="utf-8")
        if STATE.exists():
            shutil.copy2(STATE, backup_root / "previous-state.json")

    for rel, data in updates.items():
        atomic_bytes(SITE / rel, data)
    atomic_bytes(STATE, (json.dumps(state, indent=2, ensure_ascii=False) + "\n").encode("utf-8"))
    print("Applied", len(updates), "lecture files; backup:", backup_root, flush=True)
    if not updates and not retry:
        print("No changes to apply; no container rebuild required.")
        return

    # Only the mitii web service; no pruning, data wipes, volume changes, or other services.
    subprocess.run(["docker", "compose", "-f", str(COMPOSE), "build", "web"], check=True)
    subprocess.run(["docker", "compose", "-f", str(COMPOSE), "up", "-d", "--no-deps", "web"], check=True)
    print("Web service rebuilt. Check mitii.ru and logs for full verification.", flush=True)


if __name__ == "__main__":
    main()
