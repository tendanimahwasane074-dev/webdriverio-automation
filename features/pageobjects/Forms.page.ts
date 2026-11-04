import { platformElement } from './utils/platformElement'
import { focusAndWaitForKeyboard, setValueReliably } from './utils/typing'

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

    // react-native-picker-select on iOS: the chevron icon is what actually
    // opens the picker - tapping the wider "Dropdown" touchable wrapper or the
    // (disabled-looking) text field underneath it does not trigger onPress.
    // @AndroidFindBy(accessibility = "dropdown-chevron")  @iOSXCUITFindBy(accessibility = "dropdown-chevron")
    get dropdownChevron() {
        return platformElement('~dropdown-chevron', '~dropdown-chevron')
    }

    // Mirrors the selected label (or the "Select an item..." placeholder) -
    // same element either way.
    // @AndroidFindBy(accessibility = "text_input")  @iOSXCUITFindBy(accessibility = "text_input")
    get dropdownValue() {
        return platformElement('~text_input', '~text_input')
    }

    async typeText(text: string) {
        await focusAndWaitForKeyboard(this.textInput)
        await setValueReliably(this.textInput, text)
    }

    async toggleTheSwitch() {
        await this.toggleSwitch.click()
    }

    async selectDropdownOption(label: string) {
        await this.dropdownChevron.click()

        if (driver.isIOS) {
            // iOS renders its own picker wheel + accessory toolbar (not a native
            // UIPickerView controller) - setValue spins the wheel to the given
            // label, then "Done" confirms it.
            const wheel = await $('-ios predicate string:type == "XCUIElementTypePickerWheel"')
            await wheel.waitForDisplayed({ timeout: 5000 })
            await wheel.setValue(label)
            await $('~done_button').click()
        } else {
            // Android's native picker dialog selects and closes on a single tap.
            await $(`android=new UiSelector().textContains("${label}")`).click()
        }
    }
}

export default new FormsPage()
