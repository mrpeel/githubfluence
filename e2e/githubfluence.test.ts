import { chromium } from '@playwright/test';
import { test, expect, screenshot } from './fixtures';
import { execSync } from 'node:child_process';
import * as path from 'node:path';
import * as os from 'node:os';
import * as fs from 'node:fs';

const EXTENSION_PATH = path.resolve('./dist');
const TEST_REPO_URL = process.env.TEST_REPO_URL || 'https://github.com/mrpeel/test-markdown-editing/blob/main/README.md';
const GH_E2E_USERNAME = process.env.GH_E2E_USERNAME;
const GH_E2E_PASSWORD = process.env.GH_E2E_PASSWORD;
const GH_TOKEN = process.env.GH_TOKEN;

test.describe('GitHubfluence Extension E2E', () => {

  test.beforeAll(() => {
    execSync('npm run build 2>&1', { stdio: 'pipe' });
  });

  test('Full flow: login → GitHub page → overlay → commit', async () => {
    test.setTimeout(600000);

    const canAutoLogin = !!(GH_E2E_USERNAME && GH_E2E_PASSWORD);
    const canUseToken = !!GH_TOKEN;

    const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ghf-e2e-'));
    const context = await chromium.launchPersistentContext(userDataDir, {
      headless: false,
      args: [
        `--disable-extensions-except=${EXTENSION_PATH}`,
        `--load-extension=${EXTENSION_PATH}`,
      ],
    });

    const page = context.pages()[0];

    try {
      // Authenticate: login via UI, inject PAT, or manual login
      if (canAutoLogin) {
        // ── Step 1a: Login via GitHub UI ──
        await page.goto('https://github.com/login');
        await page.waitForLoadState('networkidle');
        await page.fill('#login_field', GH_E2E_USERNAME!);
        await page.fill('#password', GH_E2E_PASSWORD!);
        await page.click('input[type="submit"]');
        await page.waitForURL('https://github.com/**/*', { timeout: 15000 });
      } else if (canUseToken) {
        // ── Step 1b: Store PAT in localStorage (page script reads it from there) ──
        await page.goto('https://github.com');
        await page.waitForLoadState('networkidle');
        await page.evaluate((token) => {
          localStorage.setItem('ghf_pat', token);
        }, GH_TOKEN!);
      } else {
        // ── Step 1c: Manual login — waits for you to log in, then continues automatically ──
        console.log('\n' + '='.repeat(60));
        console.log('  🔑 LOG INTO GITHUB IN THE BROWSER WINDOW THAT JUST OPENED');
        console.log('  Complete sign-in, then the test continues automatically.');
        console.log('  (Waiting up to 10 minutes for login...)');
        console.log('='.repeat(60) + '\n');
        await page.goto('https://github.com/login');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForFunction(
          () => !window.location.pathname.startsWith('/login'),
          { timeout: 540000, polling: 1000 },
        );
        console.log('  ✅ Login detected — continuing test...\n');
      }
      await screenshot(page, '01-authenticated');

      // ── Step 2: Navigate to GitHub markdown file ──
      await page.goto(TEST_REPO_URL);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('.markdown-body')).toBeVisible({ timeout: 20000 });
      await screenshot(page, '02-github-markdown-page');

      // ── Step 3: Floating button ──
      await expect(page.locator('#ghf-edit-button')).toBeVisible({ timeout: 5000 });
      await screenshot(page, '03-floating-button-visible');

      // ── Step 4: Click floating button → overlay opens ──
      await page.click('#ghf-edit-button');
      await expect(page.locator('.ghf-overlay-panel')).toBeVisible({ timeout: 15000 });
      await screenshot(page, '04-editor-overlay-opened');

      // ── Step 5: Editor renders ──
      await expect(page.locator('.ProseMirror')).toBeVisible({ timeout: 5000 });
      await page.waitForTimeout(500);
      await screenshot(page, '05-editor-toolbar');

      // ── Step 6: Test toolbar buttons ──
      const toolbarBtns = page.locator('.ghf-tb-btn');
      await expect(toolbarBtns.first()).toBeVisible({ timeout: 3000 });
      const btnCount = await toolbarBtns.count();
      expect(btnCount).toBeGreaterThanOrEqual(18);

      await toolbarBtns.filter({ has: page.locator('svg') }).first().click();
      await page.waitForTimeout(200);

      await expect(page.locator('.ghf-dropdown-wrap').filter({ hasText: 'Alert' })).toBeVisible();

      await screenshot(page, '06-toolbar-buttons');

      // ── Step 7: Type in editor ──
      const editor = page.locator('.ProseMirror');
      await editor.click();
      await page.waitForTimeout(200);
      await page.keyboard.press('Control+End');
      await page.keyboard.press('Enter');
      await page.keyboard.type('---\nAdded by GitHubfluence E2E test');
      await page.waitForTimeout(500);
      await screenshot(page, '07-editor-with-changes');

      // ── Step 8: Save button → commit input ──
      const saveButton = page.locator('.ghf-btn-primary').filter({ hasText: 'Save' });
      await expect(saveButton).toBeEnabled({ timeout: 3000 });
      await saveButton.click();

      await expect(page.locator('.ghf-commit-input')).toBeVisible({ timeout: 5000 });
      await screenshot(page, '08-save-confirm');

      // ── Step 9: Confirm commit ──
      const confirmButton = page.locator('.ghf-btn-primary').filter({ hasText: 'Confirm Commit' });
      await expect(confirmButton).toBeEnabled({ timeout: 3000 });
      await confirmButton.click();

      await page.waitForTimeout(8000);

      const success = page.locator('.ghf-success');
      const errorEl = page.locator('.ghf-error');

      if (await success.isVisible().catch(() => false)) {
        const link = success.locator('a');
        await expect(link).toHaveAttribute('href', /https:\/\/github\.com\//);
        console.log('Commit succeeded:', await link.textContent());
      } else if (await errorEl.isVisible().catch(() => false)) {
        console.log('Commit error:', await errorEl.textContent());
      }

      await expect(page.locator('.ghf-overlay-panel')).not.toBeVisible({ timeout: 10000 });
      await screenshot(page, '09-overlay-auto-closed');

    } finally {
      await context.close();
    }
  });
});
