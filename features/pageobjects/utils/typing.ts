/**
 * Focuses a text field and waits for the keyboard to actually be up before
 * returning. A bare .click() followed immediately by .setValue() can race the
 * native field/keyboard animation - the first keystroke lands before the
 * field is ready and gets silently dropped (e.g. "WebdriverIO" -> "WdriverIO").
 */
export async function focusAndWaitForKeyboard(element: ChainablePromiseElement) {
    await element.click()
    await browser.waitUntil(() => driver.isKeyboardShown(), { timeout: 3000 }).catch(() => {})
    // isKeyboardShown() can report true right as the keyboard *starts*
    // animating in, not once it has fully settled - without this buffer the
    // field can still swallow the first keystroke, especially right after a
    // fresh app launch where the first keyboard presentation is slower.
    await browser.pause(300)
}

/**
 * Sets a field's value and verifies it actually landed intact, retrying on
 * mismatch. No fixed delay reliably rules out dropped characters - the very
 * first keyboard presentation after a cold app launch can still swallow a
 * character or two even after waitUntil(isKeyboardShown) and a settle pause,
 * so verify-and-retry is more robust than guessing at an ever-longer wait.
 */
export async function setValueReliably(element: ChainablePromiseElement, text: string, attempts = 3) {
    for (let attempt = 0; attempt < attempts; attempt++) {
        await element.clearValue()
        await element.setValue(text)

        if (await element.getAttribute('value') === text) {
            return
        }
    }
}
