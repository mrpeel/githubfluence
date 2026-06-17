export function scrapeMarkdownFromPage(): string | null {
  const cells = document.querySelectorAll<HTMLElement>('td.blob-code-inner');
  if (cells.length > 0) {
    const lines: string[] = [];
    cells.forEach((cell) => lines.push(cell.textContent ?? ''));
    return lines.join('\n');
  }

  const rawData = document.querySelector<HTMLElement>('[data-file-content]');
  if (rawData) {
    return rawData.getAttribute('data-file-content');
  }

  return null;
}

export async function fetchRawFromPage(): Promise<string | null> {
  const rawLink = document.querySelector<HTMLAnchorElement>('a[href*="/raw/"]');
  if (!rawLink) return null;

  try {
    const res = await fetch(rawLink.href);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

export async function scrapeOrFetchMarkdown(): Promise<string | null> {
  const fromDOM = scrapeMarkdownFromPage();
  if (fromDOM) return fromDOM;
  return fetchRawFromPage();
}

export function addFloatingButton(onClick: () => void): HTMLElement {
  const existing = document.getElementById('ghf-edit-button');
  if (existing) return existing;

  const btn = document.createElement('button');
  btn.id = 'ghf-edit-button';
  btn.textContent = 'Edit with GitHubfluence';
  btn.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;
    padding: 10px 18px;
    background: #2d7ff9;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    transition: background 0.15s, transform 0.1s;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  btn.addEventListener('mouseenter', () => { btn.style.background = '#1a6ff0'; });
  btn.addEventListener('mouseleave', () => { btn.style.background = '#2d7ff9'; });
  btn.addEventListener('mousedown', () => { btn.style.transform = 'scale(0.96)'; });
  btn.addEventListener('mouseup', () => { btn.style.transform = 'scale(1)'; });
  btn.addEventListener('click', onClick);
  document.body.appendChild(btn);
  return btn;
}

export function removeFloatingButton(): void {
  const btn = document.getElementById('ghf-edit-button');
  if (btn) btn.remove();
}

export function ensureContainer(): HTMLElement {
  const existing = document.getElementById('ghf-root');
  if (existing) return existing;

  const container = document.createElement('div');
  container.id = 'ghf-root';
  container.style.cssText = 'all: initial; position: fixed; inset: 0; z-index: 10000;';
  document.body.appendChild(container);
  return container;
}

export function removeContainer(): void {
  const el = document.getElementById('ghf-root');
  if (el) el.remove();
}

const TEXTAREA_SELECTORS = [
  'textarea#file_contents',
  'textarea[name="file_contents[value]"]',
  'textarea.js-file-filecontents-editable',
  '.file-editor textarea',
  'textarea#repo-file-contents',
  'textarea[name="file-contents"]',
  'textarea.js-file-content',
  '#new_review textarea',
].join(', ');

const CM_EDITOR_SELECTOR = '.cm-editor';
const CM_CONTENT_SELECTOR = '.cm-content';

function findTextarea(): HTMLTextAreaElement | null {
  return document.querySelector<HTMLTextAreaElement>(TEXTAREA_SELECTORS);
}

function findCMEditor(): HTMLElement | null {
  return document.querySelector<HTMLElement>(CM_EDITOR_SELECTOR);
}

function readFromCMContent(): string | null {
  const cm = document.querySelector<HTMLElement>(CM_CONTENT_SELECTOR);
  if (!cm) return null;

  const lines = cm.querySelectorAll<HTMLElement>('.cm-line');
  if (lines.length > 0) {
    return Array.from(lines).map(line => line.textContent ?? '').join('\n');
  }
  return cm.textContent ?? null;
}

function getCMView(editor: HTMLElement): any | null {
  return (editor as any).cmView ?? (editor as any).view ?? null;
}

export function readFromTextarea(): string | null {
  const ta = findTextarea();
  if (ta) {
    console.log('[GHF] readFromTextarea found textarea, value length:', ta.value.length);
    return ta.value ?? null;
  }

  const cmContent = readFromCMContent();
  if (cmContent !== null) {
    console.log('[GHF] readFromTextarea read from CM content, length:', cmContent.length);
    return cmContent;
  }

  console.log('[GHF] readFromTextarea found nothing');
  return null;
}

function writeToCMViaSelection(content: string): boolean {
  const cmContent = document.querySelector<HTMLElement>(CM_CONTENT_SELECTOR);
  if (!cmContent) return false;

  cmContent.focus();
  const sel = window.getSelection();
  if (!sel) return false;

  const range = document.createRange();
  range.selectNodeContents(cmContent);
  sel.removeAllRanges();
  sel.addRange(range);

  document.execCommand('delete');
  document.execCommand('insertText', false, content);
  return true;
}

function writeToCMViaView(content: string): boolean {
  const editor = findCMEditor();
  if (!editor) return false;

  const view = getCMView(editor);
  if (!view || typeof view.dispatch !== 'function') return false;

  const { state } = view;
  view.dispatch({
    changes: { from: 0, to: state.doc.length, insert: content },
  });
  return true;
}

export function writeToTextarea(content: string): boolean {
  const ta = findTextarea();
  if (ta) {
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype, 'value',
    )?.set;
    if (setter) setter.call(ta, content);
    else ta.value = content;
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    ta.dispatchEvent(new Event('change', { bubbles: true }));

    const cmEditor = findCMEditor();
    if (cmEditor) {
      const view = getCMView(cmEditor);
      if (view && typeof view.dispatch === 'function') {
        const { state } = view;
        view.dispatch({
          changes: { from: 0, to: state.doc.length, insert: content },
        });
        return true;
      }
    }
    return true;
  }

  if (writeToCMViaView(content)) return true;
  if (writeToCMViaSelection(content)) return true;

  return false;
}

export function findEditorContainer(): HTMLElement | null {
  return document.querySelector('.file-editor')
    ?? document.querySelector('.file-editor-upload')
    ?? document.querySelector('.js-file-filecontents')
    ?? document.querySelector('[data-testid="editor"]')
    ?? null;
}

export function waitForElement(selector: string, timeout = 5000): Promise<Element | null> {
  const existing = document.querySelector(selector);
  if (existing) return Promise.resolve(existing);

  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) { observer.disconnect(); resolve(el); }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => { observer.disconnect(); resolve(null); }, timeout);
  });
}

export function addLiveTab(onClick: () => void): HTMLElement | null {
  const existing = document.getElementById('ghf-live-tab');
  if (existing) return existing;

  const nav = document.querySelector('ul[aria-label="Edit mode"]');
  if (!nav) return null;

  const li = document.createElement('li');
  li.className = 'prc-SegmentedControl-Item-tSCQh';

  const btn = document.createElement('button');
  btn.id = 'ghf-live-tab';
  btn.type = 'button';
  btn.className = 'prc-SegmentedControl-Button-E48xz';
  btn.textContent = 'Live';
  btn.style.cssText = `
    cursor: pointer;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  btn.addEventListener('click', onClick);

  li.appendChild(btn);
  nav.appendChild(li);
  return btn;
}

export function removeLiveTab(): void {
  const tab = document.getElementById('ghf-live-tab');
  if (tab) tab.parentElement?.remove();
}

export function highlightLiveTab(active: boolean): void {
  const btn = document.getElementById('ghf-live-tab');
  if (!btn) return;
  const li = btn.closest('li');
  if (!li) return;
  if (active) {
    li.setAttribute('data-selected', '');
    btn.setAttribute('aria-current', 'true');
    btn.style.fontWeight = '600';
  } else {
    li.removeAttribute('data-selected');
    btn.setAttribute('aria-current', 'false');
    btn.style.fontWeight = '500';
  }
}
