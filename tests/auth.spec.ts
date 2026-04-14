import { test as setup } from '@playwright/test';
import { PageObjectManager } from '../pages/PageObjectManager';
import data from '../fixtures/users.json'
const { users } = data;
    
const authFile = 'utils/storageState.json';

setup('authenticate', async ({ page }) => {
    const pageObjectManager = new PageObjectManager(page);
    const loginPage = pageObjectManager.getLoginPage();

    await loginPage.goto('/');
    await loginPage.login(users.standard.username, users.standard.password);
    await loginPage.validateSuccessfulLogin();

    // Save the authentication state to the filesystem
    await page.context().storageState({ path: authFile });
});