import { test as setup } from '@playwright/test';
import { PageObjectManager } from '../pages/PageObjectManager';
    
const authFile = 'utils/storageState.json';

setup('authenticate', async ({ page }) => {
    const pageObjectManager = new PageObjectManager(page);
    const loginPage = pageObjectManager.getLoginPage();

    await loginPage.goto('/');
    await loginPage.login(process.env.STANDARD_USER!,  
        process.env.STANDARD_PASS!);
    await loginPage.validateSuccessfulLogin();

    await page.waitForURL('**/inventory.html');
    // Save the authentication state to the filesystem
    await page.context().storageState({ path: authFile });
});