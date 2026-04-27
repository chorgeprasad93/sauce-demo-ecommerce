import { test } from '../utils/fixtures';
import PageObjectManager from "../pages/PageObjectManager";
import InventoryPage from '../pages/InventoryPage';
import LoginPage from '../pages/LoginPage';

test.describe("Inventory Page Tests",()=>{
    let pageObjectManager: PageObjectManager;
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    test.beforeEach(async ({ page }) => {
        pageObjectManager = new PageObjectManager(page);
        loginPage = pageObjectManager.getLoginPage();
        inventoryPage = pageObjectManager.getInventoryPage();
        
        await loginPage.goto('/inventory.html');
    });
    test('Login as standard_user Count all product cards on /inventory.html',async({page})=>{
        await inventoryPage.validateItemsCountOnPage()
    })

    test("Select sort option 'Name (Z to A)'",async({page})=>{
        await inventoryPage.validateDescendingSort()
    })

    test("Select sort option 'Name (A to Z)'",async({page})=>{
        await inventoryPage.validateAescendingSort()
    })

    test("Select sort option 'Price (low to high)'",async({page})=>{
        await inventoryPage.validateLowToHighSort()
    })

    test("Select sort option 'Price (high to low)'",async({page})=>{
        await inventoryPage.validateHighToLowSort()
    })

})