# ACTIVE_CONTEXT

## System Objectives
Create a Chrome Extension (GitHubfluence) for Confluence-like rich editing of GitHub markdown files, using the user's existing GitHub session for auth instead of a PAT.

## Technical Approach
- **UI**: React + pure CSS overlay interface (no Tailwind).
- **Editor**: TipTap with StarterKit + Markdown GFM + 8 extensions.
- **Auth**: Session-based — no API calls needed. On edit pages, TipTap edits are written back to GitHub's textarea; GitHub's native "Commit changes" button handles the commit.
- **Integration**: Content script injection on `github.com` markdown preview pages and edit pages.
- **Build**: CRXJS + Vite for Chrome Extension v3 development.

## Active Phase
LIVE_TAB — Implementing the "Live" tab on GitHub's edit page.

## Feature Backlog
### Completed
- [x] Project scaffold — package.json, tsconfig, vite.config, manifest.json, vitest.config.ts
- [x] Build tooling — CRXJS + Vite 6 + TypeScript strict mode
- [x] Session-based auth — page script injected into main world via web-accessible resource
- [x] Content script — page detection, floating edit button, editor overlay, no-access overlay
- [x] API bridge — `apiRequest()`, `checkWriteAccess()`, `fetchGithubFile()`
- [x] TipTap editor — StarterKit, Markdown (GFM), toolbar (bold/italic/heading/lists/code/undo/redo/task-list/table/link/image/emoji/alert)
- [x] Toolbar — 21 SVG icon components (Atlassian Design System), heading dropdown (H1–H6 + Normal), alert dropdown (Note/Tip/Important/Warning/Caution), link/image popups, table grid picker (8×8), emoji picker (36 emoji)
- [x] Save flow — commit message input, confirm step, auto-close 1.5s after success
- [x] Background worker — stripped to minimal `chrome.runtime.onInstalled` only
- [x] Unit tests — 25 passing tests
- [x] E2E test — Full flow with web-accessible resource page script
- [x] Production build — valid dist/ with all compiled assets, typecheck passes
- [x] Edit page integration — "Live" tab injected into GitHub's segmented control on `/edit/` pages
- [x] Live tab markdown rendering — fixed TipTap editor to properly parse initial markdown content via `useEffect` + `setContent()`
- [x] Live tab write-back — fixed `writeToTextarea()` to handle CodeMirror 6 via view dispatch and selection-based fallback, improved `readFromTextarea()` to join `.cm-line` elements with newlines

### Pending
- [ ] Manual E2E test — verify Live tab appears and TipTap editor works on edit page
- [ ] Verify write-back: TipTap content → textarea → GitHub commit
- [ ] Content script DOM scraping — verify scraped markdown matches TipTap output
- [ ] Collision detection — handle concurrent edits (stale SHA)
- [ ] Error boundaries — better error UI
- [ ] Toolbar: code block language selector, file attachment, mention
- [ ] Settings page (options page) for default commit message style
- [ ] Keyboard shortcuts help modal

## Key Decisions
- Page script injected via `<script src="chrome-extension://.../page-script.js">` (web-accessible resource) to bypass GitHub's CSP that blocks inline scripts.
- **No API calls for commits**: All API-based approaches (GraphQL, REST, CSRF form POST) failed due to CORS (`api.github.com` returns `Access-Control-Allow-Origin: *`), stale CSRF tokens, and GitHub's React SPA rendering. Instead, the extension injects a "Live" tab on GitHub's edit page. TipTap edits are written back to GitHub's textarea, and the user commits via GitHub's native UI.
- No popup — `default_popup` removed from manifest, `src/popup/` directory deleted.
- `checkWriteAccess()` checks for logged-in user via DOM selectors (`avatar-small`, `data-user`, `user-login` meta).

## Verification Criteria
- [x] `npm install` completes without errors.
- [x] `npm run typecheck` passes with zero errors.
- [x] `npm run build` produces a valid `dist/` with all compiled assets.
- [x] `npx vitest run` — all unit tests pass.
- [x] `npx playwright test` — E2E test passes.
