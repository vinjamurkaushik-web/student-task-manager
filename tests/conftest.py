"""Shared remote-browser fixture and form helpers for the Selenium tests."""

import os

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By


@pytest.fixture
def base_url():
    """Use the Compose web service by default; allow local overrides."""
    return os.getenv("BASE_URL", "http://web").rstrip("/")


@pytest.fixture
def browser():
    """Create one clean remote Chrome session for each test."""
    options = webdriver.ChromeOptions()
    driver = webdriver.Remote(
        command_executor=os.getenv(
            "SELENIUM_URL", "http://selenium:4444/wd/hub"
        ),
        options=options,
    )
    try:
        driver.set_window_size(1280, 900)
        yield driver
    finally:
        driver.quit()


def signup(browser, base_url, name, email, password, confirmation=None):
    """Fill and submit the signup form using the shared contract IDs."""
    browser.get(f"{base_url}/signup.html")
    browser.find_element(By.ID, "signup-name").send_keys(name)
    browser.find_element(By.ID, "signup-email").send_keys(email)
    browser.find_element(By.ID, "signup-password").send_keys(password)
    browser.find_element(By.ID, "signup-confirm").send_keys(
        confirmation if confirmation is not None else password
    )
    browser.find_element(By.ID, "signup-submit").click()


def login(browser, base_url, email, password):
    """Fill and submit the login form using the shared contract IDs."""
    browser.get(f"{base_url}/login.html")
    browser.find_element(By.ID, "login-email").send_keys(email)
    browser.find_element(By.ID, "login-password").send_keys(password)
    browser.find_element(By.ID, "login-submit").click()
