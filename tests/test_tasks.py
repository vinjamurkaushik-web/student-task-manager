"""Task persistence, per-user isolation, and theme scenarios (TC14-TC16)."""

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from conftest import login, signup


def create_and_login(browser, base_url, name, email, password):
    """Register one account and sign into its task page."""
    signup(browser, base_url, name, email, password)
    WebDriverWait(browser, 5).until(EC.url_contains("/login.html"))
    login(browser, base_url, email, password)
    WebDriverWait(browser, 5).until(EC.url_contains("/index.html"))


def task_names(browser):
    """Read visible task names using the existing task-list markup."""
    return [
        item.text
        for item in browser.find_elements(By.CSS_SELECTOR, "#taskList .task-name")
    ]


def add_task(browser, name):
    """Add one task through the existing task form."""
    browser.find_element(By.ID, "taskInput").send_keys(name)
    browser.find_element(By.ID, "addTaskBtn").click()
    WebDriverWait(browser, 5).until(lambda driver: name in task_names(driver))


def test_tc14_added_task_persists_after_refresh(browser, base_url):
    create_and_login(
        browser, base_url, "Task Student", "tc14@example.com", "task-password"
    )
    add_task(browser, "Refresh persistence task")

    browser.refresh()

    WebDriverWait(browser, 5).until(
        lambda driver: "Refresh persistence task" in task_names(driver)
    )
    assert "Refresh persistence task" in task_names(browser)


def test_tc15_two_users_have_separate_task_lists(browser, base_url):
    create_and_login(
        browser, base_url, "First Student", "tc15-first@example.com", "first-password"
    )
    add_task(browser, "First user's private task")
    browser.find_element(By.ID, "logout-btn").click()
    WebDriverWait(browser, 5).until(EC.url_contains("/login.html"))

    create_and_login(
        browser,
        base_url,
        "Second Student",
        "tc15-second@example.com",
        "second-password",
    )
    assert "First user's private task" not in task_names(browser)
    add_task(browser, "Second user's private task")
    browser.find_element(By.ID, "logout-btn").click()
    WebDriverWait(browser, 5).until(EC.url_contains("/login.html"))

    login(browser, base_url, "tc15-first@example.com", "first-password")
    WebDriverWait(browser, 5).until(EC.url_contains("/index.html"))
    names = task_names(browser)
    assert "First user's private task" in names
    assert "Second user's private task" not in names


def test_tc16_theme_toggle_persists_after_refresh(browser, base_url):
    create_and_login(
        browser, base_url, "Theme Student", "tc16@example.com", "theme-password"
    )
    browser.find_element(By.ID, "themeToggleBtn").click()
    selected_theme = browser.execute_script(
        "return document.documentElement.getAttribute('data-theme') || 'light';"
    )

    browser.refresh()

    WebDriverWait(browser, 5).until(
        lambda driver: (
            driver.execute_script(
                "return document.documentElement.getAttribute('data-theme') || 'light';"
            )
            == selected_theme
        )
    )
    assert selected_theme == "dark"
