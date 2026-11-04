import { platformElement } from './utils/platformElement'

class FormsPage {
    // @AndroidFindBy(accessibility = "text-input")  @iOSXCUITFindBy(accessibility = "text-input")
    get textInput() {
        return platformElement('~text-input', '~text-input')
    }

    // @AndroidFindBy(accessibility = "input-text-result")  @iOSXCUITFindBy(accessibility = "input-text-result")
    get inputTextResult() {
        return platformElement('~input-text-result', '~input-text-result')
    }

    // @AndroidFindBy(accessibility = "switch")  @iOSXCUITFindBy(accessibility = "switch")
    get toggleSwitch() {
        return platformElement('~switch', '~switch')
    }

    // @AndroidFindBy(accessibility = "switch-text")  @iOSXCUITFindBy(accessibility = "switch-text")
    get switchText() {
        return platformElement('~switch-text', '~switch-text')
    }

    // @AndroidFindBy(accessibility = "button-Active")  @iOSXCUITFindBy(accessibility = "button-Active")
    get activeButton() {
        return platformElement('~button-Active', '~button-Active')
    }

    // @AndroidFindBy(accessibility = "button-Inactive")  @iOSXCUITFindBy(accessibility = "button-Inactive")
    get inactiveButton() {
        return platformElement('~button-Inactive', '~button-Inactive')
    }

    async typeText(text: string) {
        await this.textInput.setValue(text)
    }

    async toggleTheSwitch() {
        await this.toggleSwitch.click()
    }
}

export default new FormsPage()
