"""Profile editing and password-change scenarios (TC12-TC13)."""

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from conftest import login, signup


def logged_in_student(browser, base_url):
    """Create and sign in a fresh student account for profile tests."""
    email = "tc-profile@example.com"
    password = "profile-password"
    signup(browser, base_url, "Profile Student", email, password)
    WebDriverWait(browser, 5).until(EC.url_contains("/login.html"))
    login(browser, base_url, email, password)
    WebDriverWait(browser, 5).until(EC.url_contains("/index.html"))
    return email, password


def open_profile(browser, base_url):
    """Open the profile page through the documented profile link."""
    browser.find_element(By.ID, "profile-link").click()
    WebDriverWait(browser, 5).until(EC.url_contains("/profile.html"))
    assert browser.current_url.endswith("/profile.html")


def test_tc12_profile_name_update_changes_the_greeting(browser, base_url):
    logged_in_student(browser, base_url)
    open_profile(browser, base_url)
    name = browser.find_element(By.ID, "profile-name")
    name.clear()
    name.send_keys("Updated Student")
    browser.find_element(By.ID, "profile-save").click()

    WebDriverWait(browser, 5).until(
        lambda driver: driver.find_element(By.ID, "profile-message").text
        == "Profile updated"
    )
    browser.find_element(By.ID, "back-to-tasks").click()
    WebDriverWait(browser, 5).until(EC.url_contains("/index.html"))
    assert "Updated Student" in browser.find_element(By.ID, "user-greeting").text


def test_tc13_changed_password_can_be_used_to_log_in(browser, base_url):
    email, old_password = logged_in_student(browser, base_url)
    open_profile(browser, base_url)
    browser.find_element(By.ID, "current-password").send_keys(old_password)
    browser.find_element(By.ID, "new-password").send_keys("new-profile-password")
    browser.find_element(By.ID, "change-password-btn").click()

    WebDriverWait(browser, 5).until(
        lambda driver: driver.find_element(By.ID, "password-message").text
        == "Password changed"
    )
    browser.find_element(By.ID, "back-to-tasks").click()
    WebDriverWait(browser, 5).until(EC.url_contains("/index.html"))
    browser.find_element(By.ID, "logout-btn").click()
    WebDriverWait(browser, 5).until(EC.url_contains("/login.html"))
    login(browser, base_url, email, "new-profile-password")

    WebDriverWait(browser, 5).until(EC.url_contains("/index.html"))
    assert browser.current_url.endswith("/index.html")
