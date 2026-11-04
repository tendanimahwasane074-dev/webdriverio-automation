import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from 'expect-webdriverio'
import SwipePage from '../pageobjects/Swipe.page'

Given('the slide titled {string} is visible', async function (title: string) {
    await expect(SwipePage.slideTitle(title)).toBeDisplayed()
})

When('the user swipes the carousel left', async function () {
    await SwipePage.swipeCarouselLeft()
})

Then('the slide titled {string} should become visible', async function (title: string) {
    await expect(SwipePage.slideTitle(title)).toBeDisplayed()
})

Given('the hidden message is not yet visible', async function () {
    await expect(SwipePage.hiddenMessage).not.toBeDisplayed()
})

When('the user scrolls down the screen', async function () {
    await SwipePage.scrollDownToRevealHiddenMessage()
})

Then('the hidden message {string} should become visible', async function (_text: string) {
    await SwipePage.hiddenMessage.waitForDisplayed({ timeout: 10000 })
    await expect(SwipePage.hiddenMessage).toBeDisplayed()
})
