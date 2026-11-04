/**
 * Mirrors the Java suite's Hooks/ExtentHooks.java: log the scenario starting,
 * log + screenshot each step's pass/fail, and log the scenario's final result.
 * The WebdriverIO/Cucumber.js equivalent of @Before/@AfterStep/@After.
 */
import { Before, AfterStep, After, Status, ITestCaseHookParameter, ITestStepHookParameter } from '@cucumber/cucumber'
import allureReporter from '@wdio/allure-reporter'
import fs from 'node:fs'
import path from 'node:path'

const SCREENSHOTS_DIR = path.join(__dirname, '../../reports/screenshots')

Before(async function (scenario: ITestCaseHookParameter) {
    console.log(`🚀 Starting Scenario: ${scenario.pickle.name}`)
})

AfterStep(async function (step: ITestStepHookParameter) {
    const stepText = step.pickleStep.text

    if (step.result?.status === Status.FAILED) {
        console.log(`❌ Step failed: ${stepText}`)

        try {
            fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
            const stamp = new Date().toISOString().replace(/[:.]/g, '-')
            const filePath = path.join(SCREENSHOTS_DIR, `FAILURE_${stamp}.png`)

            const png = await browser.takeScreenshot()
            fs.writeFileSync(filePath, png, 'base64')
            allureReporter.addAttachment('Screenshot on failure', Buffer.from(png, 'base64'), 'image/png')

            console.log(`📸 Screenshot captured for step: ${stepText} -> ${filePath}`)
        } catch (e) {
            console.log(`⚠️ Could not take screenshot: ${(e as Error).message}`)
        }
    } else {
        console.log(`✅ Step passed.`)
    }
})

After(async function (scenario: ITestCaseHookParameter) {
    if (scenario.result?.status === Status.FAILED) {
        console.log(`❌ Scenario failed: ${scenario.pickle.name}`)
    } else {
        console.log(`✅ Scenario passed successfully.`)
    }
})
