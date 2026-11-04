import { platformElement } from './utils/platformElement'

class AlertPage {
    // React Native's Alert.alert renders a native alert on both platforms (AlertDialog
    // on Android, UIAlertController on iOS). Neither has a custom testID per button -
    // Appium exposes the button's own label as its accessible name/content-desc on both,
    // so the locator text is the same string either way.
    // @AndroidFindBy(accessibility = "<buttonText>")  @iOSXCUITFindBy(accessibility = "<buttonText>")
    button(text: string) {
        return platformElement(`~${text}`, `~${text}`)
    }

    async dismiss(buttonText: string) {
        const btn = await this.button(buttonText)
        await btn.waitForDisplayed({ timeout: 10000 })
        await btn.click()
    }
}

export default new AlertPage()
