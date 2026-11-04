Feature: Swipe and scroll gestures on the Swipe screen

  Background:
    Given the demo app is launched
    When the user opens the Swipe screen

  @Swipe @HappyPath
  Scenario: Swiping the carousel changes the visible slide
    Given the slide titled "Fully Open Source" is visible
    When the user swipes the carousel left
    Then the slide titled "Great community" should become visible

  @Swipe @HappyPath
  Scenario: Scrolling down reveals the hidden message
    Given the hidden message is not yet visible
    When the user scrolls down the screen
    Then the hidden message "You found me!!!" should become visible
