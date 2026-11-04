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

    Examples:
      | Text                | Dropdown                 |
      | Capitec Assessment  | Appium is awesome        |
      | 12345               | webdriver.io is awesome  |

  @Forms @HappyPath
  Scenario: Tapping the disabled Inactive button raises no alert
    When the user types "WebdriverIO" into the text field
    Then the form should display "WebdriverIO" as the typed result
    And the switch label reads "Click to turn the switch ON"
    When the user toggles the switch
    Then the switch label reads "Click to turn the switch OFF"
    When the user selects "This app is awesome" from the dropdown
    Then the dropdown should display "This app is awesome" as the selected option
    When the user taps the "Inactive" button
    Then an alert "should not" appear
