"""Login, route protection, and logout scenarios (TC07-TC11)."""

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from conftest import login, signup


def create_account(browser, base_url, suffix=""):
    """Create an account and leave the browser on the login page."""
    email = f"tc-login{suffix}@example.com"
    password = "student-login"
    signup(browser, base_url, "Login Student", email, password)
    WebDriverWait(browser, 5).until(EC.url_contains("/login.html"))
    return email, password


def wait_for_login_error(browser, expected):
    """Wait for the exact login error text required by the contract."""
    WebDriverWait(browser, 5).until(
        lambda driver: driver.find_element(By.ID, "login-error").text == expected
    )


def test_tc07_login_with_valid_credentials_shows_greeting(browser, base_url):
    email, password = create_account(browser, base_url, "-valid")
    login(browser, base_url, email, password)

    WebDriverWait(browser, 5).until(EC.url_contains("/index.html"))
    WebDriverWait(browser, 5).until(
        lambda driver: driver.find_element(By.ID, "user-greeting").text.strip()
    )
    assert browser.current_url.endswith("/index.html")


def test_tc08_login_with_wrong_password_shows_error(browser, base_url):
    email, _ = create_account(browser, base_url, "-wrong-password")
    login(browser, base_url, email, "incorrect-password")

    wait_for_login_error(browser, "Invalid email or password")


def test_tc09_login_with_unknown_email_shows_error(browser, base_url):
    login(browser, base_url, "unknown@example.com", "student-login")

    wait_for_login_error(browser, "Invalid email or password")


def test_tc10_task_page_redirects_logged_out_user_to_login(browser, base_url):
    browser.get(f"{base_url}/index.html")

    WebDriverWait(browser, 5).until(EC.url_contains("/login.html"))
    assert browser.current_url.endswith("/login.html")


def test_tc11_logout_returns_to_login_and_blocks_task_page(browser, base_url):
    email, password = create_account(browser, base_url, "-logout")
    login(browser, base_url, email, password)
    WebDriverWait(browser, 5).until(EC.url_contains("/index.html"))

    browser.find_element(By.ID, "logout-btn").click()
    WebDriverWait(browser, 5).until(EC.url_contains("/login.html"))
    browser.get(f"{base_url}/index.html")

    WebDriverWait(browser, 5).until(EC.url_contains("/login.html"))
    assert browser.current_url.endswith("/login.html")
