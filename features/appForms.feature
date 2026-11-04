Feature: Form interaction on the Forms screen

  Background:
    Given the demo app is launched
    When the user opens the Forms screen

  @Forms @HappyPath
  Scenario Outline: Typed text is reflected back by the form
    When the user types "<Text>" into the text field
    Then the form should display "<Text>" as the typed result

    Examples:
      | Text                |
      | WebdriverIO          |
      | Capitec Assessment   |
      | 12345                |

  @Forms @HappyPath
  Scenario: Toggling the switch updates its label
    Given the switch label reads "Click to turn the switch ON"
    When the user toggles the switch
    Then the switch label reads "Click to turn the switch OFF"
