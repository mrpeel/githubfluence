# LEARNINGS

## Technical Decisions
- **Decision**: Using TipTap for the rich text editor because of its clean abstraction over Markdown and extensive plugin support.
- **Decision**: Implementation via Content Scripts on `github.com` URLs to provide a native feel for documentation browsing.
- **Decision**: No API calls for commits. All API-based approaches failed (see Resolved Bugs). Instead, inject a "Live" tab on GitHub's edit page and write back to GitHub's textarea. GitHub handles the commit natively.
- **Decision**: Using CRXJS + Vite for build tooling because it provides native HMR for Chrome Extensions v3 with minimal configuration.
- **Decision**: React 18 with `react-jsx` transform for the injected editor UI.
- **Decision**: Using `@tiptap/markdown` with GFM for bidirectional markdown<->rich text conversion.
- **Decision**: Content script renders React overlay into a dedicated `#ghf-root` div appended to body, with CSS isolation via unique class prefixes.
- **Decision**: Auto-generated commit messages use first heading of the file when available, falling back to line diff stats.
- **Decision**: `checkWriteAccess()` uses DOM selectors (avatar, data-user, user-login meta) instead of API calls.

## Resolved Bugs/Issues
- [x] `auth-worker.ts` had double `chrome.storage.sync.get` call — second call returned unresolved Promise instead of data.
- [x] `auth-worker.ts` used `chrome.runtime.sendAsync` — non-existent API, replaced with `chrome.runtime.sendMessage`.
- [x] `auth-worker.ts` had extra `>` in generic type `GithubResponse<T>>`.
- [x] `auth-worker.ts` used `onMessageExternal` — changed to `onMessage` for same-extension communication.
- [x] `auth-worker.ts`: `new Promise` without type argument caused TS2794. Fixed by adding explicit `Promise<void>` and `Promise<Credentials>` type params.
- [x] **All API-based commit approaches failed**:
  - `api.github.com/graphql` — CORS blocks it (`Access-Control-Allow-Origin: *` conflicts with `credentials: 'include'`)
  - Same-origin `github.com/graphql` — Returns 422 HTML error page (even with nonce + CSRF headers)
  - CSRF form POST to `/_edit/` — Stale CSRF tokens from blob pages are not valid for the edit endpoint
  - Fetching edit page HTML for fresh CSRF — GitHub's edit page is a React SPA; form is rendered client-side, not in initial HTML
  - **Fix**: Abandoned all API-based commit approaches. Now writes content back to GitHub's textarea on the edit page. User commits via GitHub's native UI.
- [x] `addLiveTab()` used wrong selectors (`.UnderlineNav, .file-navigation, [role="tablist"]`). GitHub's edit page uses `ul[aria-label="Edit mode"]` with `prc-SegmentedControl` classes. Fix: updated selectors and button classes to match GitHub's segmented control pattern.
- [x] **Markdown content not rendering in TipTap editor**: `contentType: 'markdown'` option in `useEditor` was unreliable with `@tiptap/markdown` v3.23.6. **Fix**: Initialize editor with empty content string, then use `useEffect` to call `editor.commands.setContent(initialContent)` after mount. The Markdown extension's `setContent` properly detects and parses markdown.
- [x] **CM6 `.cm-content` textContent loses newlines**: CodeMirror 6 renders each line as a `.cm-line` div. `textContent` on `.cm-content` concatenates all lines without newlines (`Line1Line2` instead of `Line1\nLine2`). **Fix**: Query `.cm-line` elements and join with `\n`.
- [x] **`document.execCommand('insertText')` fails with CM6**: CM6 does not handle programmatic `execCommand` calls for setting editor content. **Fix**: Try to access CM6 view via `.cm-editor` element's `cmView`/`view` properties and use `view.dispatch({ changes })`. Fall back to selection-based `execCommand` approach.

## Package Discoveries
- TipTap's Markdown extension is `@tiptap/markdown` (not `@tiptap/extension-markdown`) as of Tiptap 3.x.
- TipTap is now on v3.x (latest 3.23.x as of June 2026). Key API: `editor.getMarkdown()` to serialize content to Markdown string.
- CRXJS v2.4.0 is stable and requires Vite 3–7. Uses `import manifest from './manifest.json' with { type: 'json' }` (the `with` keyword, not `assert`).
- CRXJS automatically copies icons referenced in `manifest.json` into the output `dist/` and generates `web_accessible_resources` entries for content scripts.
- The `@tiptap/markdown` v3 extension includes `Markdown` extension that works with `StarterKit` and provides GFM support via `markedOptions: { gfm: true }`.
- `chrome.storage.session` is not available in content scripts without proper permissions. Use `chrome.storage.local` or alternative approaches.

## Build Infrastructure
- Vite 6 with CRXJS produces: compiled background worker (`assets/auth-worker.ts-*.js`), content script (`assets/index.ts-*.js`), and a `service-worker-loader.js` entry point.
- CRXJS rewrites the output `manifest.json` to reference compiled asset paths.
- Content scripts that import React components are bundled with their CSS separately. The loader script handles chunk loading.
- Test setup with Vitest + jsdom requires proper Chrome API mocking. `chrome.runtime.sendMessage` has dual callback/Promise API — mock must handle both patterns.

## Testing Patterns
- Mock `chrome.runtime.sendMessage` with a map of message type → response for predictable test behavior.
- Use `waitFor` + `act` pattern for async React re-renders triggered by Chrome API callbacks.
- Vitest `globals: true` must be paired with `"types": ["vitest/globals"]` in tsconfig for proper TypeScript support.
- `@types/chrome` must be included in tsconfig `types` array for global `chrome` namespace.

## GitHub DOM Patterns
- Blob page (`/blob/`): Edit/Preview tabs use `UnderlineNav` or `SegmentedControl` classes. CodeMirror editor. `textarea.js-code-textarea` or similar for the file content.
- Edit page (`/edit/`): Edit/Preview tabs use `ul[aria-label="Edit mode"]` with `prc-SegmentedControl-SegmentedControl-lqIXp` class. Individual tabs are `<li class="prc-SegmentedControl-Item-tSCQh">` with `<button class="prc-SegmentedControl-Button-E48xz">`. Selected tab has `data-selected` attribute.
- `html-safe-nonce` meta tag exists on pages but is not sufficient for GraphQL API authentication from extensions.
- `data-csrf="true"` attributes on hidden inputs contain boolean markers, not token values. Actual CSRF tokens are in `input[name="authenticity_token"]` value attributes.
