import { Page } from "@playwright/test";
import { LoginPage } from "./LoginPage";
import InventoryPage from "./InventoryPage";
export class PageObjectManager{
    private loginPage : LoginPage;
    private inventoryPage : InventoryPage;
    
    constructor(page: Page){
        this.loginPage = new LoginPage(page);
        this.inventoryPage = new InventoryPage(page)
    }
    getLoginPage(){
        return this.loginPage;
    }
    getInventoryPage(){
        return this.inventoryPage;
    }

}
export default PageObjectManager;