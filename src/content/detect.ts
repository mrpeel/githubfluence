import type { PageInfo } from '../shared/types';
import { extractPageInfo } from '../shared/markdown';

export function isMarkdownPreviewPage(): boolean {
  const info = extractPageInfo(window.location.href);
  if (!info || !info.isMarkdown) return false;

  const hasBlobTable = document.querySelector('table.blob-wrapper') !== null;
  const hasPreview = document.querySelector('.markdown-body') !== null;

  return hasBlobTable || hasPreview;
}

export function isMarkdownEditPage(): boolean {
  return window.location.pathname.includes('/edit/') &&
    /\.(md|markdown)$/i.test(window.location.pathname);
}

export function getPageInfo(): PageInfo | null {
  return extractPageInfo(window.location.href);
}

export function watchUrlChanges(onChange: () => void): () => void {
  let lastUrl = window.location.href;
  const observer = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      onChange();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
  return () => observer.disconnect();
}
