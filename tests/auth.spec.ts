import { test as setup } from '@playwright/test';
import { PageObjectManager } from '../pages/PageObjectManager';
import fs from 'fs';

const authFile = 'playwright/.auth/storageState.json';

setup('authenticate', async ({ page }) => {
    fs.mkdirSync('playwright/.auth', { recursive: true }); // ← creates dir on CI

    const pageObjectManager = new PageObjectManager(page);
    const loginPage = pageObjectManager.getLoginPage();

    await loginPage.goto('/');
    await loginPage.login(
        process.env.STANDARD_USER!,  // ← from .env
        process.env.STANDARD_PASS!   // ← from .env
    );
    await loginPage.validateSuccessfulLogin();
    await page.waitForURL('**/inventory.html');

    await page.context().storageState({ path: authFile });
});