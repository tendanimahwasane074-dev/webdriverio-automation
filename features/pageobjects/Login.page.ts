import { platformElement } from './utils/platformElement'
import { focusAndWaitForKeyboard, setValueReliably } from './utils/typing'

class LoginPage {
    // @AndroidFindBy(accessibility = "button-login-container")  @iOSXCUITFindBy(accessibility = "button-login-container")
    get loginTabButton() {
        return platformElement('~button-login-container', '~button-login-container')
    }

    // @AndroidFindBy(accessibility = "button-sign-up-container")  @iOSXCUITFindBy(accessibility = "button-sign-up-container")
    get signUpTabButton() {
        return platformElement('~button-sign-up-container', '~button-sign-up-container')
    }

    // @AndroidFindBy(accessibility = "input-email")  @iOSXCUITFindBy(accessibility = "input-email")
    get emailInput() {
        return platformElement('~input-email', '~input-email')
    }

    // @AndroidFindBy(accessibility = "input-password")  @iOSXCUITFindBy(accessibility = "input-password")
    get passwordInput() {
        return platformElement('~input-password', '~input-password')
    }

    // @AndroidFindBy(accessibility = "input-repeat-password")  @iOSXCUITFindBy(accessibility = "input-repeat-password")
    get repeatPasswordInput() {
        return platformElement('~input-repeat-password', '~input-repeat-password')
    }

    // Same submit control for both forms; its accessible name is "button-<text on
    // it>" (see the demo app's src/components/Button.tsx), so it reads "button-LOGIN"
    // on the Login tab and "button-SIGN UP" on Sign up.
    // @AndroidFindBy(accessibility = "button-LOGIN")  @iOSXCUITFindBy(accessibility = "button-LOGIN")
    get submitButton() {
        return platformElement('~button-LOGIN', '~button-LOGIN')
    }

    // @AndroidFindBy(accessibility = "button-SIGN UP")  @iOSXCUITFindBy(accessibility = "button-SIGN UP")
    get signUpSubmitButton() {
        return platformElement('~button-SIGN UP', '~button-SIGN UP')
    }

    async switchToSignUp() {
        await this.signUpTabButton.click()
    }

    async switchToLogin() {
        await this.loginTabButton.click()
    }

    async login(email: string, password: string) {
        // setValueReliably clears and retries on mismatch: on iOS, setValue()
        // alone doesn't reliably replace existing text (leftover text from a
        // prior Examples row can get appended instead of replaced), and the
        // very first keyboard presentation after a fresh app launch can drop
        // a character or two even once it's confirmed shown.
        await focusAndWaitForKeyboard(this.emailInput)
        await setValueReliably(this.emailInput, email)

        // Secure fields report their "value" attribute as masked bullets, so
        // setValueReliably's verification would always see a mismatch here -
        // a plain clear + set is all that's reliably checkable.
        await focusAndWaitForKeyboard(this.passwordInput)
        await this.passwordInput.clearValue()
        await this.passwordInput.setValue(password)

        await this.submitButton.click()
    }

    async signUp(email: string, password: string, passwordConfirmation: string) {
        await this.switchToSignUp()
        await focusAndWaitForKeyboard(this.emailInput)
        await setValueReliably(this.emailInput, email)

        // Sign up has two adjacent secure fields, so iOS treats this as a "new
        // password" form and pops its own "Use Strong Password?" suggestion
        // sheet the instant one is focused - it swallows the first keystroke
        // before auto-dismissing itself, corrupting whatever we try to type.
        // Dismiss it ourselves right after focusing, before typing anything.
        // Secure fields report their "value" attribute as masked bullets, so
        // setValueReliably's verification doesn't apply here either.
        await focusAndWaitForKeyboard(this.passwordInput)
        await this.dismissStrongPasswordPromptIfPresent()
        await this.passwordInput.clearValue()
        await this.passwordInput.setValue(password)

        await focusAndWaitForKeyboard(this.repeatPasswordInput)
        await this.dismissStrongPasswordPromptIfPresent()
        await this.repeatPasswordInput.clearValue()
        await this.repeatPasswordInput.setValue(passwordConfirmation)

        await this.signUpSubmitButton.click()
    }

    // iOS-only: the "Use Strong Password?" suggestion sheet (see signUp()).
    // No-ops quickly if it never shows up.
    private async dismissStrongPasswordPromptIfPresent() {
        if (!driver.isIOS) {
            return
        }
        try {
            const closeButton = await $('-ios predicate string:type == "XCUIElementTypeButton" AND label == "Close"')
            await closeButton.waitForDisplayed({ timeout: 2000 })
            await closeButton.click()
        } catch {
            // Didn't show up this time - nothing to dismiss.
        }
    }

    // The validation error text (react-native-elements Input's `errorMessage` prop)
    // isn't given its own accessibility id in the app, so unlike every other element
    // on this page it has to be found by its literal visible text - Appium has no
    // cross-platform "find by text" strategy, so this is the one element here where
    // the Android and iOS locator strategies genuinely differ, not just their value.
    // @AndroidFindBy(xpath = "//*[contains(@text,'<message>')]")  @iOSXCUITFindBy(iOSNsPredicate = "label == '<message>'")
    errorMessage(text: string) {
        return platformElement(
            `android=new UiSelector().textContains("${text}")`,
            // RN's <Text> renders a non-accessible wrapper node around the real
            // accessible leaf, both carrying the identical label - without
            // "accessible == 1" this matches both and trips strict-mode.
            `-ios predicate string:label == "${text}" AND accessible == 1`,
        )
    }
}

export default new LoginPage()
