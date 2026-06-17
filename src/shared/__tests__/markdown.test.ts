import { describe, it, expect, beforeEach } from 'vitest';
import { getCommitMessage, extractPageInfo, generateDiffSummary, scrapeMarkdownFromDom } from '../markdown';

describe('getCommitMessage', () => {
  it('generates message with first heading', () => {
    const msg = getCommitMessage('README.md', '', '# Hello World\n\nSome content');
    expect(msg).toContain('Hello World');
    expect(msg).toContain('README.md');
  });

  it('generates message for added lines', () => {
    const msg = getCommitMessage('doc.md', 'line1', '\n\nline2');
    expect(msg).toContain('2 lines added');
  });

  it('generates message for removed lines', () => {
    const msg = getCommitMessage('doc.md', '\nline1\nline2\nline3', '\nline1');
    expect(msg).toContain('2 lines removed');
  });

  it('returns no-changes message when content is identical', () => {
    const msg = getCommitMessage('doc.md', 'same', 'same');
    expect(msg).toContain('no changes');
  });

  it('handles empty content', () => {
    const msg = getCommitMessage('empty.md', '', '');
    expect(msg).toContain('no changes');
  });

  it('falls back to filename when no heading', () => {
    const msg = getCommitMessage('notes.md', '', 'plain text without hash');
    expect(msg).toContain('notes.md');
  });
});

describe('extractPageInfo', () => {
  it('parses blob URL', () => {
    const info = extractPageInfo('https://github.com/owner/repo/blob/main/README.md');
    expect(info).toEqual({
      owner: 'owner',
      repo: 'repo',
      branch: 'main',
      path: 'README.md',
      isMarkdown: true,
    });
  });

  it('parses edit URL', () => {
    const info = extractPageInfo('https://github.com/owner/repo/edit/main/src/doc.md');
    expect(info).toEqual({
      owner: 'owner',
      repo: 'repo',
      branch: 'main',
      path: 'src/doc.md',
      isMarkdown: true,
    });
  });

  it('parses tree URL', () => {
    const info = extractPageInfo('https://github.com/owner/repo/tree/main/src/');
    expect(info).not.toBeNull();
    expect(info!.owner).toBe('owner');
  });

  it('detects non-markdown files', () => {
    const info = extractPageInfo('https://github.com/owner/repo/blob/main/main.ts');
    expect(info).not.toBeNull();
    expect(info!.isMarkdown).toBe(false);
  });

  it('returns null for non-github URLs', () => {
    expect(extractPageInfo('https://example.com')).toBeNull();
  });

  it('returns null for non-matching github URLs', () => {
    expect(extractPageInfo('https://github.com/owner/repo/pulls')).toBeNull();
  });
});

describe('generateDiffSummary', () => {
  it('reports additions and deletions', () => {
    const summary = generateDiffSummary('line1\nline2', 'line1\nmodified\nline3');
    expect(summary).toContain('addition');
    expect(summary).toContain('deletion');
  });

  it('reports no changes for identical content', () => {
    expect(generateDiffSummary('hello', 'hello')).toBe('no changes');
  });

  it('handles empty strings', () => {
    const summary = generateDiffSummary('', 'hello');
    expect(summary).toContain('addition');
  });
});

describe('scrapeMarkdownFromDom', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('scrapes blob code cells', () => {
    document.body.innerHTML = `
      <table class="blob-wrapper">
        <tr>
          <td class="blob-code-inner"># Title</td>
        </tr>
        <tr>
          <td class="blob-code-inner">Some content</td>
        </tr>
      </table>
    `;
    const result = scrapeMarkdownFromDom();
    expect(result).toBe('# Title\nSome content');
  });

  it('returns null when no content found', () => {
    expect(scrapeMarkdownFromDom()).toBeNull();
  });
});
