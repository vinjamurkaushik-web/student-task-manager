# Student Task Manager

A framework-free to-do application used for a DevOps lab demonstration of Git branching, pull requests, Jenkins CI, Docker, Docker Compose, and Selenium browser testing.

## Features

- Add, complete, and delete tasks; task data is saved in browser localStorage.
- Task statistics and a responsive layout.
- Dark/light theme preference saved in localStorage, including preference persistence.
- Signup, login, logout, and profile editing using browser localStorage.
- User-specific task lists saved in browser localStorage.
- Selenium tests for authentication, profile, task persistence/isolation, and theme behavior.

## Authentication

Create an account at `signup.html`, then log in at `login.html`. The profile page
lets the logged-in user edit their name and change their password. Email is
displayed as read-only account information.
Each account's tasks are stored under a separate `tasks_<userId>` localStorage
key, so task lists remain separate when accounts are switched in the same browser.
The `theme` preference follows the shared contract; the original `studentTheme`
key remains supported and is kept in sync for compatibility.

This is an academic demonstration that stores accounts and sessions in browser
localStorage and uses a simple deterministic hash for password checks. It is not
production-grade authentication and does not protect data from someone who can
inspect or modify the browser. A real application must authenticate through a
backend and use secure server-side password hashing.

> **Demo limitation:** Authentication and task data are stored in the browser, not on a server. This is for a classroom demonstration and is not suitable for real accounts or sensitive data.

## Technologies

| Technology | Purpose |
|---|---|
| HTML, CSS, JavaScript | Static app and browser-side behavior |
| Nginx | Serves the app's static files in Docker |
| Docker Compose | Runs the app, Selenium browser, and optional tests |
| Python, pytest, Selenium | Drives automated browser tests |
| Jenkins | Validates files, builds the image, runs tests, and archives files |

## Project structure

```text
student-task-manager/
├── index.html              # Task page
├── login.html              # Login page
├── signup.html             # Account creation page
├── profile.html            # Profile and password page
├── style.css               # Shared styling and themes
├── script.js               # Task and theme behavior
├── auth.js                 # Shared browser-side authentication behavior
├── Dockerfile              # Nginx image for the static app
├── .dockerignore           # Files excluded from the app image
├── docker-compose.yml      # App, Selenium, and optional test services
├── tests/
│   ├── Dockerfile          # Python test-runner image
│   ├── requirements.txt    # pytest and Selenium dependencies
│   ├── conftest.py         # Browser fixture and signup/login helpers
│   ├── test_signup.py      # TC01-TC06
│   ├── test_login.py       # TC07-TC11
│   ├── test_profile.py     # TC12-TC13
│   └── test_tasks.py       # TC14-TC16
├── Jenkinsfile             # Windows-agent Jenkins pipeline
└── README.md               # This guide
```

## Run locally

Open `index.html` in a modern browser. To exercise signup, login, and profile flows, open the relevant page in the same browser; browser storage is local to that browser. Docker is the recommended way to run the full Selenium suite because it provides a shared browser and app network.

## Run with Docker

Install and start Docker Desktop, then run these commands from the project directory:

```powershell
docker compose up --build
```

Open <http://localhost:8080> to use the app. Press `Ctrl+C` to stop the foreground services.
The `web` image is tagged `sohails2409/student-task-manager:latest`; after the image builds, find it under **Images** in Docker Desktop. The running app appears under **Containers**.

## Publish the app image to Docker Hub

Sign in to Docker Desktop with the `sohails2409` Docker Hub account, or run `docker login` and authenticate interactively. Do not put an access token or password in this repository. Create a **public** repository named `student-task-manager` under that account, then build and publish the web image:

```powershell
docker compose build web
docker compose push web
```

The published image will be `sohails2409/student-task-manager:latest` on Docker Hub. The same image tag is visible in Docker Desktop under **Images**. Publishing requires Docker Desktop's Linux engine to be running and the app files listed in the Dockerfile to exist in the checkout.

Dockerfile details:

- `FROM nginx:alpine` starts from the small official Nginx web server image.
- `COPY` places the four HTML pages and three browser-side files in Nginx's public directory.
- `EXPOSE 80` documents the HTTP port inside the container; Compose publishes it as port 8080 on the computer.

With no profile selected, Compose starts only `web`. The `test` profile adds Selenium and its test runner; Selenium listens on port 4444 for WebDriver commands and port 7900 for the live noVNC browser view. Open <http://localhost:7900> while tests are running to watch the browser.

## Run Selenium tests

Run the test profile from the project directory:

```powershell
docker compose --profile test run --build --rm tests
```

Pytest runs in verbose, unbuffered mode: each test name and its `PASSED` or `FAILED` result appears in the terminal as it finishes, followed by a full result summary.

Compose starts the web app and waits for Selenium's `/status` health check before launching pytest. The suite creates a fresh remote Chrome session per test and uses explicit waits for page behavior. To stop and remove the Compose services afterward:

```powershell
docker compose down
```

The Selenium cases cover the following contract and expected outcomes:

Test results are pending until the merged application and Selenium suite are run.

| ID | Scenario | Expected result | Result |
|---|---|---|---|
| TC01 | Signup with valid data | Redirects to the login page | Not run |
| TC02 | Signup with empty fields | `All fields are required` | Not run |
| TC03 | Signup with invalid email | `Enter a valid email address` | Not run |
| TC04 | Signup with short password | `Password must be at least 6 characters` | Not run |
| TC05 | Signup password mismatch | `Passwords do not match` | Not run |
| TC06 | Signup duplicate email | `Email already registered` | Not run |
| TC07 | Login with valid credentials | Task page opens and greeting is visible | Not run |
| TC08 | Login with wrong password | `Invalid email or password` | Not run |
| TC09 | Login with unknown email | `Invalid email or password` | Not run |
| TC10 | Open task page while logged out | Redirects to login | Not run |
| TC11 | Logout | Returns to login and blocks the task page | Not run |
| TC12 | Update profile name | `Profile updated`; greeting uses new name | Not run |
| TC13 | Change password, then log in | `Password changed`; new password works | Not run |
| TC14 | Add a task and refresh | Task remains visible | Not run |
| TC15 | Two users use the app | Each user sees only their own tasks | Not run |
| TC16 | Toggle theme and refresh | Selected theme remains active | Not run |

## Jenkins pipeline stages

The declarative pipeline is designed for a Windows Jenkins agent and uses `bat` commands:

1. **Checkout** — checks out the selected branch.
2. **Validate** — checks that the app, Docker, and Selenium test files exist.
3. **Archive** — archives the project files with fingerprints.
4. **Docker Build** — builds the `todo-app` image.
5. **Selenium Tests** — builds and runs the Compose Selenium suite, using the test service's exit code as the stage result.
6. **Cleanup** — `post { always { ... } }` runs `docker compose down` after the pipeline.

The Docker Build and Selenium Tests stages require Docker Engine and the Compose plugin to be available to the Jenkins Windows agent. If the lab agent cannot run Docker, those stages will fail; report the actual Jenkins output rather than marking tests as passed.

## Team members and roles

| Person | Responsibility | Branch |
|---|---|---|
| Person 1 | Project report and demonstration evidence | `docs/report` or off-repo |
| Person 2 | Signup, login, logout, and profile features | `feature/auth` |
| Person 3 | Docker, Compose, Selenium, Jenkins, and README | `feature/docker-selenium` |

The authentication, tasks, and profile data are demo-level browser storage only. Do not use real credentials or sensitive information.
