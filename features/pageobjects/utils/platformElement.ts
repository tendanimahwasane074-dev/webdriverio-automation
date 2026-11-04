/**
 * WebdriverIO/TypeScript equivalent of the Java suite's
 * @AndroidFindBy(...) / @iOSXCUITFindBy(...) pair on a single field: every
 * element below declares both locators side by side, and this picks the
 * right one for whichever platform session is active.
 */
export function platformElement(androidSelector: string, iosSelector: string) {
    return driver.isIOS ? $(iosSelector) : $(androidSelector)
}
