#!/usr/bin/env sh
set -eu

repo="ethan-huo/ctx"
version="${CTX_VERSION:-latest}"
install_dir="${CTX_INSTALL_DIR:-$HOME/.local/bin}"

usage() {
  cat <<'EOF'
Usage: install.sh [--version <tag>] [--dir <path>]

Installs or upgrades ctx by overwriting the target binary.

Environment:
  CTX_VERSION       Release tag to install, for example v0.1.0. Defaults to latest.
  CTX_INSTALL_DIR   Install directory. Defaults to ~/.local/bin.
EOF
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --version)
      [ "$#" -ge 2 ] || {
        echo "install.sh: --version requires a value" >&2
        exit 2
      }
      version="$2"
      shift 2
      ;;
    --dir)
      [ "$#" -ge 2 ] || {
        echo "install.sh: --dir requires a value" >&2
        exit 2
      }
      install_dir="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "install.sh: unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

need() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "install.sh: missing required command: $1" >&2
    exit 1
  }
}

need curl
need tar
need uname
need mktemp

os="$(uname -s)"
arch="$(uname -m)"

case "$os" in
  Darwin) platform_os="macos" ;;
  Linux) platform_os="linux" ;;
  *)
    echo "install.sh: unsupported OS: $os" >&2
    exit 1
    ;;
esac

case "$arch" in
  arm64|aarch64) platform_arch="arm64" ;;
  x86_64|amd64) platform_arch="amd64" ;;
  *)
    echo "install.sh: unsupported architecture: $arch" >&2
    exit 1
    ;;
esac

if [ "$platform_os" = "macos" ] && [ "$platform_arch" != "arm64" ]; then
  echo "install.sh: macOS releases are only published for ARM64" >&2
  exit 1
fi

base_url="https://github.com/${repo}/releases"

# Release assets are version-named (ctx_<ver>_<os>-<arch>.tar.gz), so resolve a
# concrete tag even for "latest" before building the download URLs. The
# /releases/latest URL redirects to /releases/tag/<tag>.
if [ "$version" = "latest" ]; then
  version="$(curl -fsSLI -o /dev/null -w '%{url_effective}' "${base_url}/latest" | sed 's#.*/tag/##')"
  if [ -z "$version" ]; then
    echo "install.sh: could not resolve the latest release tag" >&2
    exit 1
  fi
else
  case "$version" in
    v*) ;;
    *) version="v${version}" ;;
  esac
fi

asset="ctx_${version}_${platform_os}-${platform_arch}.tar.gz"
checksums="ctx_${version}_checksums.txt"
release_url="${base_url}/download/${version}"

tmp_dir="$(mktemp -d)"
cleanup() {
  rm -rf "$tmp_dir"
}
trap cleanup EXIT INT TERM

archive_path="${tmp_dir}/${asset}"
checksums_path="${tmp_dir}/${checksums}"

curl_flags="-fL --retry 3 --retry-delay 1"

echo "Downloading ${asset} from ${release_url}" >&2
curl $curl_flags -o "$archive_path" "${release_url}/${asset}"
curl $curl_flags -o "$checksums_path" "${release_url}/${checksums}"

# Checksum lines look like "<sha256>  dist/ctx_<ver>_<os>-<arch>.tar.gz". Match by
# asset basename and compare hashes directly — the recorded path prefix differs
# from where we downloaded to, so `sha256sum -c` on the raw line wouldn't work.
expected="$(awk -v a="$asset" 'index($2, a) { print $1; exit }' "$checksums_path")"
if [ -z "$expected" ]; then
  echo "install.sh: checksum for ${asset} not found" >&2
  exit 1
fi

if command -v sha256sum >/dev/null 2>&1; then
  actual="$(sha256sum "$archive_path" | awk '{print $1}')"
elif command -v shasum >/dev/null 2>&1; then
  actual="$(shasum -a 256 "$archive_path" | awk '{print $1}')"
else
  echo "install.sh: sha256sum or shasum is required for checksum verification" >&2
  exit 1
fi

if [ "$actual" != "$expected" ]; then
  echo "install.sh: checksum mismatch for ${asset}" >&2
  echo "  expected ${expected}" >&2
  echo "  actual   ${actual}" >&2
  exit 1
fi

tar -xzf "$archive_path" -C "$tmp_dir"

mkdir -p "$install_dir"
cp "${tmp_dir}/ctx_${platform_os}-${platform_arch}/ctx" "${install_dir}/ctx"
chmod 755 "${install_dir}/ctx"

echo "ctx ${version} installed to ${install_dir}/ctx"
case ":$PATH:" in
  *":$install_dir:"*) ;;
  *) echo "Add ${install_dir} to PATH if ctx is not found." >&2 ;;
esac
