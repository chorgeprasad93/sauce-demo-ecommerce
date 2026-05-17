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

    test("Click Add to Cart butto and check it changes to Remove button'",async({page})=>{
        await inventoryPage.validateAddToCart('Sauce Labs Backpack')
    })

    test("Add 3 items to cart Verify cart badge",async({page})=>{
        await inventoryPage.validateCartCount('Sauce Labs Backpack','Sauce Labs Bike Light','Sauce Labs Bolt T-Shirt')
    })

    test("Verify each product has name, price, description, and image",async({page})=>{
        await inventoryPage.validateProductDetails()
    })

})

test.describe('problematic user tests',()=>{
    let pageObjectManager: PageObjectManager;
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    test('Login as Problem User Check if product images are broken',async({page})=>{
        pageObjectManager = new PageObjectManager(page);
        loginPage = pageObjectManager.getLoginPage();
        inventoryPage = pageObjectManager.getInventoryPage();
        await loginPage.goto('/');
        await loginPage.login(process.env.STANDARD_USER!,process.env.STANDARD_PASS!);
        await inventoryPage.takeScreenshotOfProductImage()
        await inventoryPage.validateLogout()
        await loginPage.goto('/');
        await loginPage.login(process.env.PROBLEM_USER!,process.env.PROBLEM_PASS!);
        await inventoryPage.validateBrokenImages()
    })
})