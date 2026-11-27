"""Prepare the 27 November inline-learning update on top of the live site."""
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys

BASE = 'cfdb332744b620cfff74f6573af41b7dcb64427a'
UPDATE = '191c65be30aae6eb1860c9e1a30a3843b1eddcfe'
COMMON = 'lib/upravlenie3d-common.js'
ASSETS = ('media/study/inline-learning.css', 'media/study/inline-learning.js')
COMPETITION = 'content/ekonomika-konkurenciya.md'
CONSUMER = 'content/ekonomika-potrebitel.md'
NOVEMBER = 'content/ekonomika-lekciya-16-11.md'

BLOCK = re.compile(
    r'^\*\*\[ДОБАВЛЕНО\] Проще говоря\.\*\* [^\n]+\n\n'
    r'<details class="inline-learning u2-keep" data-study-id="([^"]+)"[^\n]*\n'
    r'[\s\S]*?^</details>(?=\n|$)', re.MULTILINE,
)
HEAD = re.compile(r'^(#{2,5})[ \t]+(.+)$', re.MULTILINE)
OVERRIDES = {
    'ekonomika-konkurenciya-fcc8c14999': ('Три классификации конкуренции',),
    'ekonomika-konkurenciya-9c5ccbae63': ('Ценовая дискриминация', 'Ценовая конкуренция и ценовая дискриминация'),
    'ekonomika-konkurenciya-8300f36f0d': ('Монопсония',),
    'ekonomika-konkurenciya-fc18fcce41': ('Олигополия',),
    'ekonomika-konkurenciya-00b639c2d9': ('Антитрестовское законодательство', 'Антитрестовские законы'),
    'ekonomika-potrebitel-693d79fd36': ('Четыре характеристики потребительского поведения', 'Потребительское поведение'),
    'ekonomika-potrebitel-36862286b6': ('Второй закон Госсена', 'Кардиналистский подход'),
    'ekonomika-potrebitel-35bf464721': ('Бюджетная линия и равновесие потребителя', 'Бюджетная линия', 'Кривые безразличия', 'Ординалистский подход'),
    'ekonomika-potrebitel-77e6454cfd': ('Потребительский спрос и его классификация', 'Потребительский спрос'),
    'ekonomika-potrebitel-7c2bdb0adf': ('Как государство влияет на спрос', 'Государство и спрос'),
}


def git(*args):
    return subprocess.check_output(['git', *args])


def paths_to_read():
    changed = git('diff', '--name-only', BASE, UPDATE, '--', 'content').decode().splitlines()
    if len(changed) != 42 or any(not re.fullmatch(r'content/[a-z0-9-]+\.md', p) for p in changed):
        raise SystemExit('Unexpected list of source lectures')
    return sorted(changed), sorted({*changed, COMMON, *ASSETS, NOVEMBER, 'data/sections.json', 'index.html'})


def normalized(heading):
    without_number = re.sub(r'^(?:\W*\d+[\d.]*[а-я]?\.?\s+)+', '', heading.lower())
    return ' '.join(re.findall(r'[а-яa-z0-9]+', without_number.replace('ё', 'е')))


def locate(headings, names, limit):
    for name in names:
        title = normalized(name)
        same = [h for h in headings if normalized(h[2]) == title and h.start() >= limit]
        if len(same) == 1:
            return same[0]
        starting = [h for h in headings if normalized(h[2]).startswith(title + ' ') and h.start() >= limit]
        if len(starting) == 1:
            return starting[0]
    return None


def merge_lecture(current, blocks, path):
    headings = list(HEAD.finditer(current))
    pending = {}
    unmatched = []
    for key, snippet, names, section_names in blocks:
        if key in current:
            if snippet not in current:
                raise SystemExit('Different installed exercise: ' + key)
            continue
        context = locate(headings, section_names, 0) if section_names else None
        floor = context.start() if context else 0
        heading = locate(headings, names, floor)
        if heading is None:
            unmatched.append((key, names[:3], section_names))
            continue
        end = next((h.start() for h in headings if h.start() > heading.start() and len(h[1]) <= len(heading[1])), len(current))
        end = len(current[:end].rstrip())
        divider = re.search(r'\n\n---$', current[heading.end():end])
        if divider:
            end = heading.end() + divider.start()
        pending.setdefault(end, []).append(snippet)
    if unmatched:
        return None, [f'{path}: {key} {names} {context}' for key, names, context in unmatched]
    result = current
    for end, snippets in sorted(pending.items(), reverse=True):
        result = result[:end] + '\n\n' + '\n\n'.join(snippets) + result[end:]
    if any(result.count(key) != 1 for key, *_ in blocks):
        raise SystemExit('Exercise is missing or duplicated: ' + path)
    return result, []


def prepare(snapshot, staged, baseline):
    sources, _ = paths_to_read()
    inputs = json.loads((snapshot / 'data/sections.json').read_text())
    live_lectures = {item.get('src') for section in inputs['sections'] for item in section['items'] if item['type'] == 'markdown'}
    if COMMON.rsplit('/', 1)[1] not in (snapshot / 'index.html').read_text():
        raise SystemExit('The live index needs to load the approved lecture module')
    split = NOVEMBER in live_lectures and CONSUMER not in live_lectures
    mapped = {}
    existing_ids = set()
    for source in sources:
        published = git('show', UPDATE + ':' + source).decode()
        headings = list(HEAD.finditer(published))
        for item in BLOCK.finditer(published):
            key = item[1]
            if key in existing_ids:
                raise SystemExit('Duplicate source exercise: ' + key)
            existing_ids.add(key)
            near = [h[2] for h in headings if h.end() < item.start()]
            names = (*OVERRIDES.get(key, ()), *reversed(near[-4:]))
            destination = source
            section_names = ()
            if split and (source == CONSUMER or key == 'ekonomika-konkurenciya-00b639c2d9'):
                destination = NOVEMBER
                if source == CONSUMER:
                    section_names = ('Теория поведения потребителя', 'Потребительское поведение')
            mapped.setdefault(destination, []).append((key, item[0], names, section_names))
    if len(existing_ids) != 157:
        raise SystemExit('Unexpected number of inline blocks')
    if len(mapped) != 42 or not mapped.keys() <= live_lectures:
        raise SystemExit(f'Unexpected live lecture mapping: {sorted(mapped.keys() - live_lectures)}')

    errors = []
    output = {}
    for path, blocks in mapped.items():
        live = (snapshot / path).read_bytes().decode()
        updated = git('show', UPDATE + ':' + path).decode() if path in sources else ''
        original = git('show', BASE + ':' + path).decode() if path in sources else ''
        if live == original and BLOCK.findall(updated) == [x[0] for x in blocks]:
            result = updated
        else:
            result, errors_here = merge_lecture(live, blocks, path)
            errors.extend(errors_here)
        if result is not None:
            output[path] = result.encode()
    if errors:
        raise SystemExit('Unmatched lecture sections:\n' + '\n'.join(errors))

    live_common = (snapshot / COMMON).read_bytes()
    old_common = git('show', BASE + ':' + COMMON)
    new_common = git('show', UPDATE + ':' + COMMON)
    if not new_common.startswith(old_common):
        raise SystemExit('Shared module changes are not append-only')
    extension = new_common[len(old_common):]
    if b'inline-learning.js' in live_common and extension not in live_common:
        raise SystemExit('A different inline-learning module is already installed')
    output[COMMON] = live_common if extension in live_common else live_common.rstrip() + extension
    for path in ASSETS:
        source = git('show', UPDATE + ':' + path)
        target = snapshot / path
        if target.exists() and target.read_bytes() != source:
            raise SystemExit('Different live asset: ' + path)
        output[path] = source

    live_hashes = []
    changed_paths = []
    absent = []
    for path, data in sorted(output.items()):
        current = snapshot / path
        if current.exists():
            previous = current.read_bytes()
            if previous == data:
                continue
            live_hashes.append(f'{hashlib.sha256(previous).hexdigest()}  {path}')
            base_path = baseline / path
            base_path.parent.mkdir(parents=True, exist_ok=True)
            base_path.write_bytes(previous)
        else:
            absent.append(path)
        target = staged / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        changed_paths.append(path)
    baseline.mkdir(parents=True, exist_ok=True)
    staged.mkdir(parents=True, exist_ok=True)
    (baseline / 'files.json').write_text(json.dumps([line.split('  ', 1)[1] for line in live_hashes]))
    (staged / 'files.json').write_text(json.dumps(changed_paths))
    (staged / 'expected.sha256').write_text(''.join(line + '\n' for line in live_hashes))
    (staged / 'absent.list').write_text(''.join(path + '\n' for path in absent))
    (staged / 'published.sha256').write_text(
        ''.join(f'{hashlib.sha256(data).hexdigest()}  {path}\n' for path, data in sorted(output.items()))
    )
    print(f'Verified {len(mapped)} live lectures, {len(existing_ids)} embedded blocks, {len(changed_paths)} file updates.')


if __name__ == '__main__':
    if sys.argv[1:] == ['paths']:
        print('\n'.join(paths_to_read()[1]))
    else:
        prepare(*map(Path, sys.argv[1:]))
