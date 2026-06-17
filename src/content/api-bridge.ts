let scriptLoadPromise: Promise<void> | null = null;
let reqId = 0;
const pending = new Map<string, { resolve: (v: any) => void; reject: (e: any) => void }>();

function injectPageScript(): Promise<void> {
  if (scriptLoadPromise) return scriptLoadPromise;
  scriptLoadPromise = new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.src = chrome.runtime.getURL('page-script.js');
    el.onload = () => { el.remove(); resolve(); };
    el.onerror = () => reject(new Error('Failed to load page-script.js'));
    document.documentElement.appendChild(el);
  });
  window.addEventListener('message', (event) => {
    if (event.source !== window || event.data?.type !== 'GHF_API_RESPONSE') return;
    const { id, data, error, status } = event.data;
    const p = pending.get(id);
    if (!p) return;
    pending.delete(id);
    if (error) {
      p.reject(new Error(error));
    } else {
      p.resolve({ status, data });
    }
  });
  return scriptLoadPromise;
}

async function apiRequest(method: string, url: string, body?: unknown): Promise<{ status: number; data: any }> {
  await injectPageScript();
  return new Promise((resolve, reject) => {
    const id = `ghf_${++reqId}`;
    pending.set(id, { resolve, reject });
    window.postMessage({ type: 'GHF_API_REQUEST', id, method, url, body }, '*');
    setTimeout(() => {
      if (pending.has(id)) {
        pending.delete(id);
        reject(new Error('Request timed out'));
      }
    }, 30000);
  });
}

export interface WriteAccessResult {
  hasWrite: boolean;
  error?: string;
}

export async function checkWriteAccess(): Promise<WriteAccessResult> {
  const loggedIn = document.querySelector('.avatar-small')
    || document.querySelector('[data-user]')
    || document.querySelector('[data-view-component="true"].avatar')
    || document.querySelector('meta[name="user-login"]');
  if (!loggedIn) {
    return { hasWrite: false, error: 'You are not signed in to GitHub. Please log in to edit files.' };
  }
  return { hasWrite: true };
}

export async function fetchGithubFile(owner: string, repo: string, path: string, branch: string) {
  const url = `https://github.com/${owner}/${repo}/raw/${encodeURIComponent(branch)}/${encodeURIComponent(path)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch file (HTTP ${res.status})`);
  const text = await res.text();
  return { content: btoa(unescape(encodeURIComponent(text))), sha: '', encoding: 'base64' as const };
}


