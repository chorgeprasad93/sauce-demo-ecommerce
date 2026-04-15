import { expect, test } from '@playwright/test';
import { PageObjectManager } from '../pages/PageObjectManager';

// Depend on the authentication state produced by `tests/auth.spec.ts`
// test.use({ storageState: 'utils/storageState.json' });
import data from '../fixtures/users.json'
import InventoryPage from '../pages/InventoryPage';
const { users } = data;


test.describe('Login Tests', () => {

    test('Empty username and password, check error message', async ({ page }) => {
        const pageObjectManager = new PageObjectManager(page);
        const loginPage = pageObjectManager.getLoginPage();
        await loginPage.goto('/');
        await loginPage.login(users.empty.username, users.empty.password)
        await loginPage.validateUsernameError()
    })

    test('valid username and empty password, check error message', async ({ page }) => {
        const pageObjectManager = new PageObjectManager(page);
        const loginPage = pageObjectManager.getLoginPage();
        await loginPage.goto('/');
        await loginPage.login(users.standard.username, users.empty.password)
        await loginPage.validatePasswordError()
    })

    test('locked-out username and valid password, check error message', async ({ page }) => {
        const pageObjectManager = new PageObjectManager(page);
        const loginPage = pageObjectManager.getLoginPage();
        await loginPage.goto('/');
        await loginPage.login(users.locked.username, users.locked.password)
        await loginPage.validateLockedUserError()
    })

    test('valid username and invalid password, check error message', async ({ page }) => {
        const pageObjectManager = new PageObjectManager(page);
        const loginPage = pageObjectManager.getLoginPage();
        await loginPage.goto('/');
        await loginPage.login(users.invalidPassword.username, users.invalidPassword.password)
        await loginPage.validateInvalidPasswordError()
    })

    test('Successfull login and Successfull logout', async ({ page }) => {
        const pageObjectManager = new PageObjectManager(page);
        const loginPage = pageObjectManager.getLoginPage();
        const inventoryPage = pageObjectManager.getInventoryPage();
        // Ensure we're authenticated for this flow — perform login if storageState wasn't applied
        await loginPage.goto('/');
        await loginPage.login(users.standard.username, users.standard.password);
        await loginPage.validateSuccessfulLogin();
        await inventoryPage.validateLogout();
    })

    // unauthenticated access check — moved to separate describe below

    test('Login as performance_glitch_user Measure time to load inventory', async ({ page }) => {
        const pageObjectManager = new PageObjectManager(page);
        const loginPage = pageObjectManager.getLoginPage();
        await loginPage.goto('/');
        const start_time = Date.now()
        await loginPage.login(users.performance.username, users.performance.password);
        const end_time = Date.now()
        const durationInSeconds = (end_time - start_time) / 1000;
        console.log(`Login took ${durationInSeconds} seconds`);
        expect(durationInSeconds).toBeLessThan(6)
    })

    test('Enter SQL injection in username', async ({ page }) => {
        const pageObjectManager = new PageObjectManager(page);
        const loginPage = pageObjectManager.getLoginPage();
        await loginPage.goto('/');
        await loginPage.login(users.sqlPayload.username, users.performance.password);
        await loginPage.validateErrorMsg()
    })

    test('Enter XSS in username', async ({ page }) => {
        const pageObjectManager = new PageObjectManager(page);
        const loginPage = pageObjectManager.getLoginPage();
        await loginPage.goto('/');
        await loginPage.login(users.scriptPayload.username, users.performance.password);
        await loginPage.validateErrorMsg()
    })

})

test.describe('Unauthenticated Access', () => {
   
    test('Without logging in Navigate directly to /inventory.html', async ({ browser }) => {
        // Create an isolated context without using the saved `storageState`
        const context = await browser.newContext();
        const page = await context.newPage();
        const pageObjectManager = new PageObjectManager(page);
        const loginPage = pageObjectManager.getLoginPage();
        await loginPage.goto('/inventory.html');
        const inventoryPage = pageObjectManager.getInventoryPage();
        await inventoryPage.validateLogout();
        await loginPage.goto('/inventory.html');
        await loginPage.validateDirectInventoryPageAccessError();
        await context.close();
    })

})