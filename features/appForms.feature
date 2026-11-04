Feature: Form interaction on the Forms screen

  Background:
    Given the demo app is launched
    When the user opens the Forms screen

  @Forms @HappyPath
  Scenario Outline: Typed text, switch toggle, dropdown selection, and button tap all work on the Forms screen
    When the user types "<Text>" into the text field
    Then the form should display "<Text>" as the typed result
    And the switch label reads "Click to turn the switch ON"
    When the user toggles the switch
    Then the switch label reads "Click to turn the switch OFF"
    When the user selects "<Dropdown>" from the dropdown
    Then the dropdown should display "<Dropdown>" as the selected option
    When the user taps the "Active" button
    Then an alert "should" appear
    And the user dismisses the alert

    Examples:
      | Text                | Dropdown                 |
      | Capitec Assessment  | Appium is awesome        |
      | 12345               | webdriver.io is awesome  |
