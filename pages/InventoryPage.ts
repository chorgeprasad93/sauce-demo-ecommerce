import { Locator, Page, expect } from '@playwright/test';

class InventoryPage{
    readonly page: Page;
    readonly hamburgerMenun : Locator;
    readonly logoutBtn : Locator
    readonly itemCards : Locator;
    readonly productSort : Locator
    readonly descendingSortValue : string
    readonly itemName : Locator
    readonly expectedItemsList : string[]
    readonly ascendingSortValue : string
    readonly lowToHighSortValue : string
    readonly itemPrice : Locator
    readonly highToLowSortValue : string

    constructor(page: Page){
        this.page = page;
        this.hamburgerMenun = page.getByRole('button',{name:'Open Menu'});
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
    }
    async validateLogout(){
        await this.hamburgerMenun.click()
        await this.logoutBtn.click()
        await expect(this.page).toHaveURL('/')
    }
    async validateItemsCountOnPage(){
        await this.itemCards.first().waitFor({state:'visible'})
        const count = await this.itemCards.all()
        console.log(count.length)
    }
    async performSort(sortingValue:string){
        await this.productSort.click();
        await this.productSort.selectOption({label:sortingValue})
        await this.itemName.first().waitFor({state:'visible'}) 
    }
    async validateDescendingSort(){
        await this.performSort(this.descendingSortValue)
        const itemNames = await this.itemName.allTextContents()
        const isDescending = itemNames.every((val, i) => i === 0 || itemNames[i - 1] >= val);
        expect(isDescending).toBeTruthy()
    }
    async validateAescendingSort(){
        await this.performSort(this.ascendingSortValue)
        const itemNames = await this.itemName.allTextContents()
        const isAscending = itemNames.every((val, i) => i === 0 || itemNames[i - 1] <= val);
        expect(isAscending).toBeTruthy()
    }
    async validateLowToHighSort(){
        await this.performSort(this.lowToHighSortValue)
        const priceStrings:string[] = await this.itemPrice.allTextContents()
        const itemPrices: number[] = priceStrings.map(p => parseFloat(p.replace(/[^0-9.]/g, '')));
        const isAscending = itemPrices.every((val, i) => i === 0 || itemPrices[i - 1] <= val);
        expect(isAscending).toBeTruthy()
    }
    async validateHighToLowSort(){
        await this.performSort(this.highToLowSortValue)
        const priceStrings:string[] = await this.itemPrice.allTextContents()
        const itemPrices: number[] = priceStrings.map(p => parseFloat(p.replace(/[^0-9.]/g, '')));
        const isDescending = itemPrices.every((val, i) => i === 0 || itemPrices[i - 1] >= val);
        expect(isDescending).toBeTruthy()
    }
}

export default InventoryPage;