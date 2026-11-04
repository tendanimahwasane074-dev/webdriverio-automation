Feature: Login to the demo app

  Background:
    Given the demo app is launched
    When the user opens the Login screen

  @Login @HappyPath
  Scenario Outline: Login with valid credentials succeeds
    When the user logs in with email "<Email>" and password "<Password>"
    Then a "Success" alert saying "You are logged in!" should be displayed
    And the user dismisses the alert

    Examples:
      | Email                  | Password    |
      | jane.doe@example.com   | Password123 |
      | test.user@wdio.io      | Secur3Pass! |

  @Login @Negative
  Scenario Outline: Login with an invalid password shows a validation error
    When the user logs in with email "<Email>" and password "<Password>"
    Then an inline error "Please enter at least 8 characters" should be displayed

    Examples:
      | Email                 | Password |
      | jane.test@example.com | small4   |
      | test.user@gmail.com   | abc      |

  @Login @Negative
  Scenario: Login with an invalid email address shows a validation error
    When the user logs in with email "not-an-email" and password "Password123"
    Then an inline error "Please enter a valid email address" should be displayed
