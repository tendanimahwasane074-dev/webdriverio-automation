/**
 * Focuses a text field and waits for the keyboard to actually be up before
 * returning. A bare .click() followed immediately by .setValue() can race the
 * native field/keyboard animation - the first keystroke lands before the
 * field is ready and gets silently dropped (e.g. "WebdriverIO" -> "WdriverIO").
 */
export async function focusAndWaitForKeyboard(element: ChainablePromiseElement) {
    await element.click()
    await browser.waitUntil(() => driver.isKeyboardShown(), { timeout: 3000 }).catch(() => {})
}
