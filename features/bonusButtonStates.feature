# Bonus scenario (see README "Bonus scenario" for why this one was chosen).
Feature: Enabled vs disabled button behaviour on the Forms screen

  Background:
    Given the demo app is launched
    When the user opens the Forms screen

  @Bonus
  Scenario Outline: Only the enabled button raises an alert when tapped
    When the user taps the "<Button>" button
    Then an alert "<AlertExpectation>" appear

    Examples:
      | Button   | AlertExpectation |
      | Active   | should           |
      | Inactive | should not       |
