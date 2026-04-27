import { test as base } from '@playwright/test';
import { STORAGE_STATE } from '../playwright.config';

// extend base test with storageState always applied
export const test = base.extend({
    page: async ({ page }, use) => {
        await use(page);
    }
});

export { expect } from '@playwright/test';

// apply storageState globally to this custom test
test.use({ storageState: STORAGE_STATE });