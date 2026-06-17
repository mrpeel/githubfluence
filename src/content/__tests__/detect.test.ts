import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isMarkdownPreviewPage, getPageInfo, watchUrlChanges } from '../detect';

describe('isMarkdownPreviewPage', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: new URL('https://github.com/owner/repo/blob/main/README.md'),
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', { value: originalLocation, writable: true });
  });

  it('returns true for blob page with markdown', () => {
    document.body.innerHTML = '<table class="blob-wrapper"></table>';
    expect(isMarkdownPreviewPage()).toBe(true);
  });

  it('returns true for preview page with markdown-body', () => {
    document.body.innerHTML = '<div class="markdown-body"></div>';
    expect(isMarkdownPreviewPage()).toBe(true);
  });

  it('returns false for non-markdown URLs', () => {
    Object.defineProperty(window, 'location', {
      value: new URL('https://github.com/owner/repo/blob/main/index.ts'),
      writable: true,
    });
    expect(isMarkdownPreviewPage()).toBe(false);
  });

  it('returns false when no markdown elements exist', () => {
    document.body.innerHTML = '<div>regular page</div>';
    expect(isMarkdownPreviewPage()).toBe(false);
  });
});

describe('getPageInfo', () => {
  const originalLocation = window.location;

  afterEach(() => {
    Object.defineProperty(window, 'location', { value: originalLocation, writable: true });
  });

  it('returns page info for blob URL', () => {
    Object.defineProperty(window, 'location', {
      value: new URL('https://github.com/owner/repo/blob/main/src/doc.md'),
      writable: true,
    });
    const info = getPageInfo();
    expect(info).toEqual({
      owner: 'owner',
      repo: 'repo',
      branch: 'main',
      path: 'src/doc.md',
      isMarkdown: true,
    });
  });

  it('returns null for non-matching URL', () => {
    Object.defineProperty(window, 'location', {
      value: new URL('https://github.com/owner/repo/pulls'),
      writable: true,
    });
    expect(getPageInfo()).toBeNull();
  });
});

describe('watchUrlChanges', () => {
  it('calls callback on URL change', () => {
    const callback = vi.fn();
    const cleanup = watchUrlChanges(callback);

    Object.defineProperty(window, 'location', {
      value: new URL('https://github.com/other/repo'),
      writable: true,
    });
    window.dispatchEvent(new PopStateEvent('popstate'));

    cleanup();
  });
});
