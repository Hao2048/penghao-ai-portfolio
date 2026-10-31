#!/usr/bin/env python3
"""Check the self-contained static portfolio before publishing."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import unquote, urlsplit
import hashlib, json, re, sys
ROOT = Path(__file__).resolve().parents[1]
errors = []
checked = set()
def check(value, parent):
    value = value.strip()
    if not value or value.startswith(('#', 'data:', 'blob:', 'mailto:', 'tel:', 'http:', 'https:')) or '${' in value:
        return
    path = unquote(urlsplit(value).path)
    if not path: return
    dest = (parent.parent / path).resolve()
    if dest.is_dir(): dest = dest / 'index.html'
    if not dest.is_file(): errors.append(f'Missing reference: {parent.relative_to(ROOT)} -> {value}')
    checked.add(str(dest))
class References(HTMLParser):
    def __init__(self, path): super().__init__(); self.path = path
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if value and key in ('src', 'href', 'poster', 'data-image'): check(value, self.path)
files = [p for p in ROOT.rglob('*') if p.is_file() and '.git' not in p.parts and '__pycache__' not in p.parts]
for p in files:
    if p.is_symlink(): errors.append(f'Symlink: {p.relative_to(ROOT)}')
    if p.stat().st_size >= 100 * 1024 * 1024: errors.append(f'Oversized: {p.relative_to(ROOT)}')
    if p.suffix not in ('.html', '.css', '.js', '.json'): continue
    text = p.read_text()
    if '/Users/' in text or 'file://' in text: errors.append(f'Local computer path: {p.relative_to(ROOT)}')
    if re.search(r'gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|AIza[A-Za-z0-9_-]{30,}', text): errors.append(f'Possible credential: {p.relative_to(ROOT)}')
    if p.suffix == '.html': References(p).feed(text)
    if p.suffix == '.css':
        for ref in re.findall(r'url\([\s\'\"]*([^\)\'\"]+)', text): check(ref.strip(), p)
    if p.suffix == '.js':
        for ref in re.findall(r'[\'\"](assets/[^\'\"]+|resume-data\.json|project-introductions\.json)[\'\"]', text): check(ref, p)
manifest = ROOT / 'docs/asset-manifest.json'
if manifest.exists():
    for item in json.loads(manifest.read_text()):
        p = ROOT / item['path']
        if not p.is_file() or hashlib.sha256(p.read_bytes()).hexdigest() != item['sha256']: errors.append(f'Manifest mismatch: {item["path"]}')
if errors:
    print('\n'.join(errors)); sys.exit(1)
print(f'PASS: {len(files)} files; {len(checked)} local reference targets; resource hashes verified.')
