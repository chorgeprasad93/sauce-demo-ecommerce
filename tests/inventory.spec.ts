import { Expect,test } from "@playwright/test";
import PageObjectManager from "../pages/PageObjectManager";

test.describe("Inventory Page Tests",()=>{
    test('Login as standard_user Count all product cards on /inventory.html',async({page})=>{
        const pageObjectManager = new PageObjectManager(page)
        const loginPage = pageObjectManager.getLoginPage()
        const inventoryPage = pageObjectManager.getInventoryPage()
        await loginPage.goto('/inventory.html')
        await inventoryPage.validateItemsCountOnPage()
    })

    test("Select sort option 'Name (Z to A)'",async({page})=>{
        const pageObjectManager = new PageObjectManager(page)
        const loginPage = pageObjectManager.getLoginPage()
        const inventoryPage = pageObjectManager.getInventoryPage()
        await loginPage.goto('/inventory.html')
        await inventoryPage.validateDescendingSort()
    })

})