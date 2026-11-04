Feature: Sign up for a new account

  Background:
    Given the demo app is launched
    When the user opens the Login screen

  @Signup @HappyPath
  Scenario Outline: Signing up with a valid, matching password succeeds
    When the user signs up with email "<Email>", password "<Password>" and confirmation "<Confirmation>"
    Then a "Signed Up!" alert saying "You successfully signed up!" should be displayed
    And the user dismisses the alert

    Examples:
      | Email                   | Password    | Confirmation |
      | new.user@example.com    | Password123 | Password123  |
      | another.user@wdio.io    | Secur3Pass! | Secur3Pass!  |

  @Signup @Negative
  Scenario: Signing up with mismatched passwords shows a validation error
    When the user signs up with email "mismatch@example.com", password "Password123" and confirmation "Different123"
    Then an inline error "Please enter the same password" should be displayed

  @Signup @Login @HappyPath
  Scenario: Signing up then logging in with the same random credentials succeeds
    When the user signs up with a random email and password
    Then a "Signed Up!" alert saying "You successfully signed up!" should be displayed
    And the user dismisses the alert
    When the user switches to the Login tab
    And the user logs in with the same credentials
    Then a "Success" alert saying "You are logged in!" should be displayed
    And the user dismisses the alert
