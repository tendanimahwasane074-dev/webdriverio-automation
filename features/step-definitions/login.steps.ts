import { When, Then } from '@cucumber/cucumber'
import { expect } from 'expect-webdriverio'
import LoginPage from '../pageobjects/Login.page'
import AlertPage from '../pageobjects/Alert.page'
import { randomEmail, randomPassword } from '../pageobjects/utils/randomCredentials'

// Shared between the "sign up" and "log in with the same credentials" steps
// below - safe as module state since both steps run sequentially within the
// one scenario/session that generates them.
let generatedEmail: string
let generatedPassword: string

When('the user logs in with email {string} and password {string}', async function (email: string, password: string) {
    await LoginPage.login(email, password)
})

When('the user signs up with a random email and password', async function () {
    generatedEmail = randomEmail()
    generatedPassword = randomPassword()
    await LoginPage.signUp(generatedEmail, generatedPassword, generatedPassword)
})

When('the user switches to the Login tab', async function () {
    await LoginPage.switchToLogin()
})

When('the user logs in with the same credentials', async function () {
    await LoginPage.login(generatedEmail, generatedPassword)
})

When(
    'the user signs up with email {string}, password {string} and confirmation {string}',
    async function (email: string, password: string, confirmation: string) {
        await LoginPage.signUp(email, password, confirmation)
    },
)

Then('a {string} alert saying {string} should be displayed', async function (_title: string, message: string) {
    const messageEl = await $(`~${message}`)
    await messageEl.waitForDisplayed({ timeout: 10000 })
    await expect(messageEl).toBeDisplayed()
})

Then('an inline error {string} should be displayed', async function (message: string) {
    const errorEl = await LoginPage.errorMessage(message)
    await errorEl.waitForDisplayed({ timeout: 10000 })
    await expect(errorEl).toBeDisplayed()
})
