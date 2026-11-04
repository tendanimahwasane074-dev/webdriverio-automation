/**
 * W3C pointer actions, run through Appium, work identically on both the
 * UiAutomator2 (Android) and XCUITest (iOS) drivers - so unlike the raw-text
 * locators elsewhere, gestures need no platform branching at all.
 */
export async function swipeLeftOnElement(selector: ChainablePromiseElement) {
    const rect = await selector.getElementRect(await selector.elementId)
    const startX = rect.x + rect.width * 0.85
    const endX = rect.x + rect.width * 0.15
    const y = rect.y + Math.floor(rect.height / 2)

    await browser.action('pointer', { parameters: { pointerType: 'touch' } })
        .move({ x: startX, y })
        .down()
        .pause(100)
        .move({ duration: 300, x: endX, y })
        .up()
        .perform()
}

export async function scrollDownOnScreen(amount = 0.6) {
    const { width, height } = await browser.getWindowSize()
    const startX = Math.floor(width / 2)
    const startY = Math.floor(height * (0.5 + amount / 2))
    const endY = Math.floor(height * (0.5 - amount / 2))

    await browser.action('pointer', { parameters: { pointerType: 'touch' } })
        .move({ x: startX, y: startY })
        .down()
        .pause(100)
        .move({ duration: 400, x: startX, y: endY })
        .up()
        .perform()
}
