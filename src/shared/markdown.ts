export function getCommitMessage(filename: string, originalContent: string, newContent: string): string {
  if (originalContent.trim() === newContent.trim()) {
    return `docs: no changes to ${filename}`;
  }

  const originalLines = originalContent.split('\n');
  const newLines = newContent.split('\n');
  const added = newLines.length - originalLines.length;

  const firstLine = newContent.split('\n')[0].replace(/^#+\s*/, '').trim();
  if (firstLine) {
    return `docs: update ${filename} — ${firstLine.slice(0, 60)}`;
  }

  if (added > 0) {
    return `docs: expand ${filename} (${added} line${added === 1 ? '' : 's'} added)`;
  }
  if (added < 0) {
    return `docs: trim ${filename} (${Math.abs(added)} line${Math.abs(added) === 1 ? '' : 's'} removed)`;
  }
  return `docs: update ${filename}`;
}

export function extractPageInfo(url: string): { owner: string; repo: string; branch: string; path: string; isMarkdown: boolean } | null {
  const patterns = [
    /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)/,
    /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/edit\/([^/]+)\/(.+)/,
    /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/tree\/([^/]+)\/(.+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const [, owner, repo, branch, path] = match;
      const isMarkdown = /\.(md|markdown)$/i.test(path);
      return { owner, repo, branch, path, isMarkdown };
    }
  }
  return null;
}

export function scrapeMarkdownFromDom(): string | null {
  const lines: string[] = [];
  const cells = document.querySelectorAll<HTMLElement>('td.blob-code-inner');
  if (cells.length > 0) {
    cells.forEach((cell) => {
      lines.push(cell.textContent ?? '');
    });
    return lines.join('\n');
  }

  const rawLink = document.querySelector<HTMLAnchorElement>('a[href*="?raw=true"]');
  if (rawLink) {
    return rawLink.getAttribute('href');
  }
  return null;
}

export function generateDiffSummary(original: string, modified: string): string {
  const orig = original.split('\n');
  const mod = modified.split('\n');

  const added = mod.filter((l, i) => orig[i] !== l || i >= orig.length).length;
  const removed = orig.filter((l, i) => mod[i] !== l || i >= mod.length).length;

  const parts: string[] = [];
  if (added > 0) parts.push(`${added} addition${added !== 1 ? 's' : ''}`);
  if (removed > 0) parts.push(`${removed} deletion${removed !== 1 ? 's' : ''}`);
  return parts.length > 0 ? parts.join(', ') : 'no changes';
}
