"""Signup validation and account-creation scenarios (TC01-TC06)."""

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from conftest import signup


def wait_for_signup_error(browser, expected):
    """Wait for the exact validation text required by the shared contract."""
    WebDriverWait(browser, 5).until(
        lambda driver: driver.find_element(By.ID, "signup-error").text == expected
    )


def test_tc01_signup_with_valid_data_redirects_to_login(browser, base_url):
    signup(browser, base_url, "Student One", "tc01@example.com", "student1")

    WebDriverWait(browser, 5).until(EC.url_contains("/login.html"))
    assert browser.current_url.endswith("/login.html")


def test_tc02_signup_with_empty_fields_shows_required_message(browser, base_url):
    browser.get(f"{base_url}/signup.html")
    browser.find_element(By.ID, "signup-submit").click()

    wait_for_signup_error(browser, "All fields are required")


def test_tc03_signup_with_invalid_email_shows_validation_message(browser, base_url):
    signup(browser, base_url, "Student Three", "not-an-email", "student3")

    wait_for_signup_error(browser, "Enter a valid email address")


def test_tc04_signup_with_short_password_shows_validation_message(browser, base_url):
    signup(browser, base_url, "Student Four", "tc04@example.com", "short")

    wait_for_signup_error(browser, "Password must be at least 6 characters")


def test_tc05_signup_password_mismatch_shows_validation_message(browser, base_url):
    signup(
        browser,
        base_url,
        "Student Five",
        "tc05@example.com",
        "student5",
        confirmation="different",
    )

    wait_for_signup_error(browser, "Passwords do not match")


def test_tc06_signup_duplicate_email_shows_validation_message(browser, base_url):
    signup(browser, base_url, "Student Six", "tc06@example.com", "student6")
    WebDriverWait(browser, 5).until(EC.url_contains("/login.html"))

    signup(browser, base_url, "Student Six Again", "tc06@example.com", "student6")

    wait_for_signup_error(browser, "Email already registered")
