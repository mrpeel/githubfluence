# ARCHITECTURE

## Overview
- **Role**: Chrome Extension for editing GitHub content without Markdown knowledge.
- **Workflow**: Browse GitHub `.md` file → Click pencil icon to edit → Click "Live" tab → Edit in TipTap rich text editor → Click "Done" → Content writes back to textarea → Commit via GitHub's native "Commit changes" button.

## Technical Stack
- **Language**: TypeScript strict mode
- **Frontend**: React 18, TipTap 3.23 (`StarterKit` + `Markdown` GFM)
- **Build**: CRXJS 2.4 + Vite 6 + PostCSS
- **Integration**: `manifest.json` v3 — content script, background service worker
- **Auth**: Session-based — no API calls. Writes back to GitHub's textarea; GitHub handles the commit.

## Directory Layout
```
src/
├── shared/
│   ├── types.ts           — PageInfo, GithubFile, CommitResult, GithubResponse
│   ├── messages.ts        — Typed ExtensionMessage / ExtensionResponse discriminated unions
│   ├── markdown.ts        — getCommitMessage(), extractPageInfo(), scrapeMarkdownFromDom(), generateDiffSummary()
│   └── __tests__/
├── background/
│   └── auth-worker.ts     — Minimal background worker (chrome.runtime.onInstalled only)
├── content/
│   ├── index.ts           — Entry: detect page, mount/unmount React overlay, edit page integration
│   ├── detect.ts          — isMarkdownPreviewPage(), isMarkdownEditPage(), getPageInfo(), watchUrlChanges()
│   ├── github-page.ts     — DOM scraping, floating button, container, textarea read/write, Live tab
│   ├── overlay.tsx        — EditorOverlay: header, body (editor), footer (save/apply/done)
│   ├── editor.tsx         — RichEditor: TipTap useEditor + EditorContent
│   ├── toolbar.tsx        — Bold, Italic, Strike, H1-H3, UL, OL, Blockquote, Code, Undo, Redo
│   ├── api-bridge.ts      — injectPageScript(), apiRequest(), checkWriteAccess(), fetchGithubFile()
│   ├── style.css          — Confluence-like styling (dark header, toolbar, ProseMirror content)
│   └── __tests__/
public/
└── page-script.js         — Injected into GitHub's main world: generic API request handler only
```

## Message Flow

```
Blob Page                 Content Script              Overlay
  │                         │                          │
  ├─ Click floating btn ────►├─ mountEditor() ─────────►│
  │                         │  (originalMarkdown)      │
  │◄──── TipTap overlay ────┤                          │
  │                         │                          │
  │                         │                          │

Edit Page                 Content Script              Overlay
  │                         │                          │
  ├─ Click "Live" tab ──────►├─ mountEditor(onApply) ──►│
  │                         │  (readFromTextarea())    │
  │◄──── TipTap overlay ────┤                          │
  │                         │                          │
  ├─ Click "Done" ──────────►├─ onApply(content) ──────►│
  │                         │  writeToTextarea()       │
  │                         │  unmountEditor()         │
  │◄──── textarea updated ──┤                          │
  │                         │                          │
  ├─ Click "Commit changes" ►│                          │
  │  (GitHub native)        │                          │
```

## Auth Flow
Session-based: no API calls needed. On edit pages, the extension reads from and writes back to GitHub's textarea. GitHub's native "Commit changes" button handles authentication and the actual commit via their internal APIs.

## Save Flow (Edit Page)
1. User navigates to GitHub's edit page (`/edit/{branch}/{path}`)
2. Content script detects edit page + markdown file → adds "Live" tab to segmented control
3. User clicks "Live" tab → TipTap editor opens with textarea content
4. User edits in rich text editor
5. User clicks "Done" or switches to Edit/Preview tab → content auto-syncs back to textarea
6. User clicks GitHub's native "Commit changes" button

## Save Flow (Blob Page)
1. User clicks "Edit with GitHubfluence" floating button
2. Content script scrapes raw markdown from GitHub DOM
3. React overlay mounts with TipTap editor pre-populated with markdown content
4. User edits in rich text editor
5. User clicks "Save" → opens GitHub's edit page in new tab (or applies directly)

## Data Flow Diagram
```
[GitHub edit page] ──────► [Content Script] ──detects──> [Live tab in segmented control]
                                    │
                                    │ Click "Live"
                                    ▼
[TipTap Editor] ←─readFromTextarea── [Content Script]
      │
      │ User edits
      │ Click "Done"
      ▼
[Content Script] ──writeToTextarea──> [GitHub textarea]
      │
      │ Click "Commit changes"
      ▼
[GitHub native commit flow]
```
