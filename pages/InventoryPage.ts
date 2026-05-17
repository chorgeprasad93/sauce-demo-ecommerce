import { Locator, Page, expect } from '@playwright/test';

class InventoryPage {
    readonly page: Page;
    readonly hamburgerMenun: Locator;
    readonly logoutBtn: Locator
    readonly itemCards: Locator;
    readonly productSort: Locator
    readonly descendingSortValue: string
    readonly itemName: Locator
    readonly expectedItemsList: string[]
    readonly ascendingSortValue: string
    readonly lowToHighSortValue: string
    readonly itemPrice: Locator
    readonly highToLowSortValue: string
    readonly cartValue: Locator
    readonly itemCard: Locator
    readonly screenshotsPath: string = '/Users/prasadchorge/Desktop/saucedemo-playwright/screenshots/invetoryPage/'
    screenshot: Buffer | null
    screenshotProblem: Buffer | null


    constructor(page: Page) {
        this.page = page;
        this.hamburgerMenun = page.getByRole('button', { name: 'Open Menu' });
        this.logoutBtn = page.locator("//a[.='Logout']")
        this.itemCards = page.locator('.inventory_item')
        this.productSort = page.locator('.product_sort_container')
        this.descendingSortValue = 'Name (Z to A)'
        this.ascendingSortValue = 'Name (A to Z)'
        this.lowToHighSortValue = 'Price (low to high)'
        this.highToLowSortValue = 'Price (high to low)'
        this.itemName = page.locator('.inventory_item_name')
        this.itemPrice = page.locator('.inventory_item_price')
        this.expectedItemsList = []
        this.cartValue = page.locator('.shopping_cart_badge')
        this.itemCard = page.locator('.inventory_item')
        this.screenshot = null
    }
    async validateLogout() {
        await this.hamburgerMenun.click()
        await this.logoutBtn.click()
        await expect(this.page).toHaveURL('/')
    }
    async validateItemsCountOnPage() {
        await this.itemCards.first().waitFor({ state: 'visible' })
        const count = await this.itemCards.all()
        console.log(count.length)
    }
    async performSort(sortingValue: string) {
        await this.productSort.click();
        await this.productSort.selectOption({ label: sortingValue })
        await this.itemName.first().waitFor({ state: 'visible' })
    }
    async validateDescendingSort() {
        await this.performSort(this.descendingSortValue)
        const itemNames = await this.itemName.allTextContents()
        const isDescending = itemNames.every((val, i) => i === 0 || itemNames[i - 1] >= val);
        expect(isDescending).toBeTruthy()
    }
    async validateAescendingSort() {
        await this.performSort(this.ascendingSortValue)
        const itemNames = await this.itemName.allTextContents()
        const isAscending = itemNames.every((val, i) => i === 0 || itemNames[i - 1] <= val);
        expect(isAscending).toBeTruthy()
    }
    async validateLowToHighSort() {
        await this.performSort(this.lowToHighSortValue)
        const priceStrings: string[] = await this.itemPrice.allTextContents()
        const itemPrices: number[] = priceStrings.map(p => parseFloat(p.replace(/[^0-9.]/g, '')));
        const isAscending = itemPrices.every((val, i) => i === 0 || itemPrices[i - 1] <= val);
        expect(isAscending).toBeTruthy()
    }
    async validateHighToLowSort() {
        await this.performSort(this.highToLowSortValue)
        const priceStrings: string[] = await this.itemPrice.allTextContents()
        const itemPrices: number[] = priceStrings.map(p => parseFloat(p.replace(/[^0-9.]/g, '')));
        const isDescending = itemPrices.every((val, i) => i === 0 || itemPrices[i - 1] >= val);
        expect(isDescending).toBeTruthy()
    }
    async validateAddToCart(productName: string) {
        await this.itemCards.filter({ hasText: `${productName}` }).getByRole('button', { name: 'Add to cart' }).click()
        await expect(this.itemCards.filter({ hasText: `${productName}` }).getByRole('button', { name: 'Remove' })).toContainText('Remove')
    }
    async validateCartCount(productName1: string, productName2: string, productName3: string) {
        await this.itemCards.filter({ hasText: `${productName1}` }).getByRole('button', { name: 'Add to cart' }).click()
        await this.itemCards.filter({ hasText: `${productName2}` }).getByRole('button', { name: 'Add to cart' }).click()
        await this.itemCards.filter({ hasText: `${productName3}` }).getByRole('button', { name: 'Add to cart' }).click()
        await expect(this.cartValue).toHaveText('3')
    }
    async validateProductDetails() {
        const count = await this.itemCard.count()
        for (let i = 0; i < count; i++) {
            await expect(this.itemCard.nth(i).locator('.inventory_item_name')).toBeVisible()
            await expect(this.itemCard.nth(i).locator('.inventory_item_desc')).toBeVisible()
            await expect(this.itemCard.nth(i).locator('.inventory_item_price')).toBeVisible()
            await expect(this.itemCard.nth(i).locator('img.inventory_item_img')).toBeVisible()
        }
    }
    async takeScreenshotOfProductImage() {
        await this.page.waitForLoadState('networkidle');
        this.screenshot = await this.page.screenshot({ path: `${this.screenshotsPath}inventoryPage.png`, fullPage: true });
    }

    /**
     * Take a screenshot for the current page (problem user) and compare to the previously
     * captured baseline screenshot (standard user). Fails the test if the images are equal.
     */
    async validateBrokenImages() {
        if (!this.screenshot) throw new Error('Baseline screenshot not captured. Call takeScreenshotOfProductImage() first.');
        await this.page.waitForLoadState('networkidle');
        this.screenshotProblem = await this.page.screenshot({ path: `${this.screenshotsPath}inventoryPage-problem.png`, fullPage: true });
        expect(this.screenshotProblem).not.toEqual(this.screenshot);
    }

}

export default InventoryPage;