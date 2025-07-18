const {By} = require('selenium-webdriver');

class LoginPage {
    constructor(driver) {
        this.driver = driver;
    }

    async userName(uN){
        let usname = await this.driver.findElement(By.id('username'));
        usname.sendKeys(uN);
    }

    async password(pass){
        await this.driver.findElement(By.name('password')).sendKeys(pass);
    }

    async submitButton(){
        await this.driver.findElement(By.className('btn')).click();
    }

    async assertResult(){
        return await this.driver.findElement(By.css('h1.post-title')).getText();
    }

    async logout (){
        await this.driver.findElement(By.xpath("//a[text()='Log out']")).click();
    }

    async assertLogout () {
        return await this.driver.getTitle();
    }
}

module.exports = LoginPage;