import { platformElement } from './utils/platformElement'
import { scrollDownOnScreen, swipeLeftOnElement } from './utils/gestures'

class SwipePage {
    // @AndroidFindBy(accessibility = "Carousel")  @iOSXCUITFindBy(accessibility = "Carousel")
    get carousel() {
        return platformElement('~Carousel', '~Carousel')
    }

    // The slide title/subtitle Text elements have no custom testID (see the demo
    // app's src/components/SliderEntry.tsx), so - same as the Login error message -
    // they have to be found by their literal visible text, which is the one thing
    // on this page that needs a genuinely different locator strategy per platform.
    // The title is rendered upper-cased by the component itself.
    // @AndroidFindBy(xpath = "//*[contains(@text,'<TITLE>')]")  @iOSXCUITFindBy(iOSNsPredicate = "label == '<TITLE>'")
    slideTitle(title: string) {
        const upper = title.toUpperCase()
        return platformElement(
            `android=new UiSelector().textContains("${upper}")`,
            // RN's <Text> renders a non-accessible wrapper node around the real
            // accessible leaf, both carrying the identical label - without
            // "accessible == 1" this matches both and trips strict-mode.
            `-ios predicate string:label == "${upper}" AND accessible == 1`,
        )
    }

    // @AndroidFindBy(xpath = "//*[contains(@text,'You found me!!!')]")  @iOSXCUITFindBy(iOSNsPredicate = "label == 'You found me!!!'")
    get hiddenMessage() {
        return platformElement(
            `android=new UiSelector().textContains("You found me!!!")`,
            `-ios predicate string:label == "You found me!!!" AND accessible == 1`,
        )
    }

    async swipeCarouselLeft() {
        await swipeLeftOnElement(this.carousel)
    }

    async scrollDownToRevealHiddenMessage() {
        // A couple of swipes: the carousel + intro content is taller than one screen.
        await scrollDownOnScreen()
        await scrollDownOnScreen()
    }
}

export default new SwipePage()
