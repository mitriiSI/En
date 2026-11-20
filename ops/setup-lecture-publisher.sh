#!/usr/bin/env bash
# Run once as root on VPS 193.227.240.200.
# Only prepares restricted lecture publication; it does NOT enable GitHub Actions.
set -euo pipefail

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run this installer as root." >&2
  exit 1
fi

for cmd in python3 rsync sudo curl ssh-keygen docker visudo; do
  command -v "$cmd" >/dev/null || { echo "Missing command: $cmd" >&2; exit 1; }
done
test -d /srv/mitii && test -f /srv/mitii/data/sections.json
test -f /srv/mitii-deploy/compose.yaml
docker compose -f /srv/mitii-deploy/compose.yaml config --services | grep -qx 'web' || {
  echo "Expected Docker Compose service 'web' not found." >&2
  exit 1
}
test -f /etc/ssh/ssh_host_ed25519_key.pub || {
  echo "SSH Ed25519 host key not found; inspect SSH config before continuing." >&2
  exit 1
}

# Install a pinned, reviewed publisher revision. The installer does not run
# content from a mutable branch and does not publish any site files.
publisher_url="https://raw.githubusercontent.com/mitriiSI/En/91d7e3edd1660a7a7cc157e806e1e301d5c67fb5/ops/publish_lectures.py"
tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT
curl --fail --silent --show-error --location --proto '=https' --tlsv1.2 \
  "$publisher_url" --output "$tmp"
python3 -m py_compile "$tmp"
install -o root -g root -m 0755 "$tmp" /usr/local/sbin/mitii-publish-lectures

# A standalone account for staging only. No membership in docker/root groups.
if ! id -u mitii-publisher >/dev/null 2>&1; then
  useradd --create-home --shell /bin/bash mitii-publisher
fi
install -d -o mitii-publisher -g mitii-publisher -m 0700 \
  /home/mitii-publisher/.ssh /srv/mitii-deploy/lecture-inbox
touch /home/mitii-publisher/.ssh/authorized_keys
chown mitii-publisher:mitii-publisher /home/mitii-publisher/.ssh/authorized_keys
chmod 0600 /home/mitii-publisher/.ssh/authorized_keys

# Only allow the publishing script through passwordless sudo.
printf '%s\n' 'mitii-publisher ALL=(root) NOPASSWD: /usr/local/sbin/mitii-publish-lectures *' \
  > /etc/sudoers.d/mitii-publisher
chmod 0440 /etc/sudoers.d/mitii-publisher
visudo -cf /etc/sudoers.d/mitii-publisher

# Generate a dedicated key. The private key is never printed by this installer.
install -d -m 0700 /root/.ssh
key=/root/.ssh/mitii_lecture_actions
if [[ ! -f "$key" ]]; then
  ssh-keygen -t ed25519 -N '' -f "$key" -C "github-actions-mitii-lectures" >/dev/null
fi
pubkey="$(cat "$key.pub")"
grep -Fxq "$pubkey" /home/mitii-publisher/.ssh/authorized_keys ||
  printf '%s\n' "$pubkey" >> /home/mitii-publisher/.ssh/authorized_keys

echo
echo "Publisher account is ready. GitHub Actions is still disabled."
echo "In GitHub > Settings > Secrets and variables > Actions, add:"
echo "  Secret MITII_SSH_USER = mitii-publisher"
echo "  Secret MITII_SSH_PORT = 22"
echo "  Secret MITII_SSH_KEY = contents of $key (copy locally, do NOT send in chat)"
echo "  Secret MITII_SSH_KNOWN_HOSTS = output of the following command:"
echo "    awk -v host=193.227.240.200 '{print host\" \"\$1\" \"\$2}' /etc/ssh/ssh_host_ed25519_key.pub"
echo
echo "To view the private key ONLY on your own terminal:"
echo "  cat $key"
echo "Do NOT enable MITII_DEPLOY_ENABLED until a controlled test publication."
