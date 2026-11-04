import { platformElement } from './utils/platformElement'

class BottomNavPage {
    // @AndroidFindBy(accessibility = "Home")  @iOSXCUITFindBy(accessibility = "Home")
    get homeTab() {
        return platformElement('~Home', '~Home')
    }

    // @AndroidFindBy(accessibility = "Login")  @iOSXCUITFindBy(accessibility = "Login")
    get loginTab() {
        return platformElement('~Login', '~Login')
    }

    // @AndroidFindBy(accessibility = "Forms")  @iOSXCUITFindBy(accessibility = "Forms")
    get formsTab() {
        return platformElement('~Forms', '~Forms')
    }

    // @AndroidFindBy(accessibility = "Swipe")  @iOSXCUITFindBy(accessibility = "Swipe")
    get swipeTab() {
        return platformElement('~Swipe', '~Swipe')
    }

    async openLogin() {
        await this.loginTab.click()
    }

    async openForms() {
        await this.formsTab.click()
    }

    async openSwipe() {
        await this.swipeTab.click()
    }
}

export default new BottomNavPage()
