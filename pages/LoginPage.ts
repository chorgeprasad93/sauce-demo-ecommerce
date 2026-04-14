import { Locator, Page, expect } from '@playwright/test';
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = this.page.locator('#user-name');
    this.passwordInput = this.page.locator('#password');
    this.loginButton = this.page.getByRole('button', { name: 'Login' });
    
  }

  async goto(path:string) {
    await this.page.goto(path);
  }
  async login(username:string, password:string){
    await this.usernameInput.waitFor({ state: 'visible' });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    //await this.page.waitForTimeout(5000);
    await this.loginButton.click();
  }
  async validateSuccessfulLogin(){
    await expect(this.page).toHaveURL('/inventory.html')
  }
  ////h3[text()='Epic sadface: Username is required']
  async validateUsernameError(){
    let usernameRequiredMsg = await this.page.locator("//h3[text()='Epic sadface: Username is required']").textContent()
    console.log(usernameRequiredMsg)
    expect(usernameRequiredMsg).toContain("Epic sadface: Username is required")
  }
  async validatePasswordError(){
    let passwordRequiredMsg = await this.page.locator("//h3[text()='Epic sadface: Password is required']").textContent()
    console.log(passwordRequiredMsg)
    expect(passwordRequiredMsg).toContain("Epic sadface: Password is required")
  }
  async validateLockedUserError(){
    let lockedourErrorMsg = await this.page.locator("//h3[text()='Epic sadface: Sorry, this user has been locked out.']").textContent()
    console.log(lockedourErrorMsg)
    expect(lockedourErrorMsg).toContain("Epic sadface: Sorry, this user has been locked out.")
  }
  async validateInvalidPasswordError(){
    let invalidPasswordErrorMsg = await this.page.locator("//h3[text()='Epic sadface: Username and password do not match any user in this service']").textContent()
    console.log(invalidPasswordErrorMsg)
    expect(invalidPasswordErrorMsg).toContain("Epic sadface: Username and password do not match any user in this service")
  }
  async validateDirectInventoryPageAccessError(){
    let directInventoryPageAccessErrorMsg = await this.page.locator('//h3[@data-test="error"]').textContent()
    console.log(directInventoryPageAccessErrorMsg)
    expect(directInventoryPageAccessErrorMsg).toContain("Epic sadface: You can only access '/inventory.html' when you are logged in.")
  }
  async validateErrorMsg(){
    let usernameErrorMsg = await this.page.locator('//h3[@data-test="error"]').textContent()
    console.log(usernameErrorMsg)
    expect(usernameErrorMsg).toContain("Epic sadface: Username and password do not match any user in this service")
  }
  
}

export default LoginPage;