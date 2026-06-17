import 'dotenv/config';
import type { BrowserContext, Page } from '@playwright/test';
import { test as base } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

const SCREENSHOT_DIR = path.resolve('e2e/screenshots');

export function ensureScreenshotDir() {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

export async function screenshot(page: Page, name: string) {
  ensureScreenshotDir();
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${name}.png`), fullPage: false });
}

export async function getExtensionId(context: BrowserContext): Promise<string> {
  for (let i = 0; i < 30; i++) {
    const workers = context.serviceWorkers();
    if (workers.length > 0) {
      const url = new URL(workers[0].url());
      return url.hostname;
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('No service worker found after 6s. Ensure extension is loaded.');
}

export const test = base;
export { expect } from '@playwright/test';
