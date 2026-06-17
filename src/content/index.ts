import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { isMarkdownPreviewPage, isMarkdownEditPage, getPageInfo, watchUrlChanges } from './detect';
import {
  addFloatingButton, removeFloatingButton,
  ensureContainer, removeContainer,
  scrapeOrFetchMarkdown,
  readFromTextarea, writeToTextarea,
  findEditorContainer, addLiveTab, removeLiveTab, highlightLiveTab,
  waitForElement,
} from './github-page';
import { checkWriteAccess } from './api-bridge';
import { EditorOverlay } from './overlay';
import { NoAccessOverlay } from './no-access';
import './style.css';

let rootInstance: Root | null = null;
let urlCleanup: (() => void) | null = null;

function mountEditor(opts: { onClose: () => void; onApply?: (content: string) => void; initialContent?: string }) {
  const pageInfo = getPageInfo();
  console.log('[GHF] mountEditor pageInfo:', pageInfo);
  if (!pageInfo) return;

  const container = ensureContainer();
  console.log('[GHF] mountEditor container:', container);
  rootInstance = createRoot(container);
  rootInstance.render(
    React.createElement(EditorOverlay, {
      pageInfo,
      originalMarkdown: opts.initialContent ?? readFromTextarea() ?? '',
      onClose: opts.onClose,
      onApply: opts.onApply,
    }),
  );
}

function mountNoAccess(owner: string, repo: string, errorMsg?: string) {
  const container = ensureContainer();
  rootInstance = createRoot(container);
  rootInstance.render(
    React.createElement(NoAccessOverlay, {
      owner,
      repo,
      errorMsg,
      onClose: unmountEditor,
    }),
  );
}

function unmountEditor() {
  if (rootInstance) {
    rootInstance.unmount();
    rootInstance = null;
  }
  removeContainer();
}

async function handleBlobEditClick() {
  const pageInfo = getPageInfo();
  if (!pageInfo) return;

  const btn = document.getElementById('ghf-edit-button');
  if (btn) btn.style.display = 'none';

  const result = await checkWriteAccess();
  if (result.hasWrite) {
    mountEditor({ onClose: () => {
      unmountEditor();
      const b = document.getElementById('ghf-edit-button');
      if (b) b.style.display = 'block';
    }});
  } else {
    mountNoAccess(pageInfo.owner, pageInfo.repo, result.error);
  }
}

async function setupEditPage() {
  await waitForElement('ul[aria-label="Edit mode"]');
  const tab = addLiveTab(() => {
    console.log('[GHF] Live tab clicked');
    const editorContainer = findEditorContainer();
    console.log('[GHF] editorContainer:', editorContainer);
    if (!editorContainer) return;

    highlightLiveTab(true);

    const initialMd = readFromTextarea();
    console.log('[GHF] initial markdown from textarea:', initialMd?.slice(0, 100));

    editorContainer.style.display = 'none';

    mountEditor({
      initialContent: initialMd ?? undefined,
      onClose: () => {
        unmountEditor();
        highlightLiveTab(false);
        editorContainer.style.display = '';
      },
      onApply: (content: string) => {
        const ok = writeToTextarea(content);
        console.log('[GHF] writeToTextarea result:', ok);
        unmountEditor();
        highlightLiveTab(false);
        editorContainer.style.display = '';
      },
    });
  });

  if (tab) {
    const editTabClickHandler = () => {
      console.log('[GHF] Edit/Preview tab clicked');
      const editorContainer = findEditorContainer();
      if (editorContainer) {
        unmountEditor();
        highlightLiveTab(false);
        editorContainer.style.display = '';
      }
    };

    const nav = document.querySelector('ul[aria-label="Edit mode"]');
    if (nav) {
      const editTabs = nav.querySelectorAll('button');
      editTabs.forEach((t) => {
        if (t !== tab) {
          t.addEventListener('click', editTabClickHandler);
        }
      });
    }
  }
}

function initialize() {
  if (isMarkdownEditPage()) {
    setupEditPage();
    return;
  }

  if (isMarkdownPreviewPage()) {
    addFloatingButton(() => {
      handleBlobEditClick().catch((err) => { console.error('GHF handleBlobEditClick error', err); });
    });
  } else {
    removeFloatingButton();
  }
}

function handleUrlChange() {
  unmountEditor();
  removeLiveTab();
  initialize();
}

urlCleanup = watchUrlChanges(handleUrlChange);
initialize();

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (urlCleanup) urlCleanup();
    unmountEditor();
    removeFloatingButton();
    removeLiveTab();
  });
}
