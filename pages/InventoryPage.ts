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
    constructor(page: Page){
        this.page = page;
        this.hamburgerMenun = page.getByRole('button',{name:'Open Menu'});
        this.logoutBtn = page.locator("//a[.='Logout']")
        this.itemCards = page.locator('.inventory_item')
        this.productSort = page.locator('.product_sort_container')
        this.descendingSortValue = 'Name (Z to A)'
        this.itemName = page.locator('.inventory_item_name')
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
    async validateDescendingSort(){
        await this.productSort.click();
        await this.productSort.selectOption({label:this.descendingSortValue})
        await this.itemName.first().waitFor({state:'visible'})
        const itemNames = await this.itemName.allTextContents()
        console.log(itemNames)

    }
}

export default InventoryPage;