# Brief — Person 3: Docker, Compose, Selenium, CI, README
Read `00-SHARED-CONTEXT.md` first. Section 5 (THE CONTRACT) is binding. Branch: `feature/docker-selenium`.

## Goal
1. Run the app through Docker and Docker Compose.
2. Write Selenium test cases for the auth flows and run them in Docker.
3. Extend the Jenkinsfile.
4. Update the README.
These are exactly the items examined on Monday (Docker deployment demo, Selenium testing, README).

## Deliverables and layout
```
Dockerfile                 # nginx serving the static files
.dockerignore
docker-compose.yml         # services: web, selenium, tests
tests/
  Dockerfile               # python + selenium + pytest
  requirements.txt
  conftest.py              # browser fixture (remote WebDriver) + helpers
  test_signup.py
  test_login.py
  test_profile.py
  test_tasks.py
Jenkinsfile                # extended
README.md                  # cleaned and updated
```

## Docker design
- `Dockerfile`: `FROM nginx:alpine`, copy `index.html login.html signup.html profile.html style.css script.js auth.js` into `/usr/share/nginx/html`. Expose 80.
- `docker-compose.yml`:
  - `web`: build `.`, ports `8080:80`.
  - `selenium`: image `selenium/standalone-chrome`, `shm_size: 2gb`, ports `4444:4444` and `7900:7900` (7900 lets you watch the browser live, great for the demo and for report screenshots).
  - `tests`: build `./tests`, env `BASE_URL=http://web`, `SELENIUM_URL=http://selenium:4444/wd/hub`, `depends_on` web and selenium, and `profiles: ["test"]` so a plain `docker compose up` only starts the app.
- Wait for Selenium to be ready before tests start (poll `http://selenium:4444/status` in conftest or use a healthcheck).
- Demo commands to document in README:
  - `docker compose up --build` -> app at http://localhost:8080
  - `docker compose --profile test run --rm tests` -> runs Selenium suite
  - `docker compose down`

## Selenium design
- Python + pytest + selenium, using `webdriver.Remote` to the selenium container.
- Use **only** the IDs and messages from the contract. Use `WebDriverWait` instead of `sleep`.
- Fresh browser per test (clean localStorage) via a fixture; helper functions `signup(...)` and `login(...)` to avoid repetition.
- Name tests clearly; the test list goes into the report as a table (ID, description, expected, result).

### Test cases to write (target 14+)
| ID | Test | Expected |
|---|---|---|
| TC01 | Signup with valid data | Redirect to login page |
| TC02 | Signup with empty fields | `All fields are required` |
| TC03 | Signup with invalid email | `Enter a valid email address` |
| TC04 | Signup with short password | `Password must be at least 6 characters` |
| TC05 | Signup password mismatch | `Passwords do not match` |
| TC06 | Signup duplicate email | `Email already registered` |
| TC07 | Login with valid credentials | Lands on task page, greeting visible |
| TC08 | Login wrong password | `Invalid email or password` |
| TC09 | Login unknown email | `Invalid email or password` |
| TC10 | Open task page while logged out | Redirected to login |
| TC11 | Logout | Back on login page, task page now blocked |
| TC12 | Update profile name | `Profile updated`, greeting shows new name |
| TC13 | Change password, then login with new one | `Password changed`, login works |
| TC14 | Add a task and refresh | Task persists |
| TC15 | Two users see separate task lists | Isolation holds |
| TC16 | Theme toggle persists after refresh | Same theme |

Start writing tests now from the contract. They will fail until Person 2's PR lands; that is expected. Rebase after `feature/auth` merges and get them green.

## Jenkinsfile (Windows agent, uses `bat`)
Keep the existing three stages. Update the Validate file list for the new files. Add:
- `Docker Build`: `docker build -t todo-app .`
- `Selenium Tests`: `docker compose --profile test up --build --abort-on-container-exit --exit-code-from tests`
- `post { always { bat 'docker compose down' } }`
If Jenkins on the lab machine can't run Docker, say so and keep the stage but note it in the report; ask the team which is true. Do not invent results.

## README (must be updated, it is graded)
Sections: project overview, features (incl. auth), project structure, how to run locally, how to run with Docker, how to run Selenium tests, Jenkins pipeline stages, team members and roles. **Delete the stray lines** ("Jenkins CI automation test", "Testing phase 2/3/4").

## Evidence for Person 1 (send with filenames)
`docker compose up` output, `docker ps`, app at localhost:8080, Selenium run all green, browser view on port 7900, Jenkins stage view + console, PR screenshot.

## Rules
- Beginner-friendly: comment every file, explain each Docker line in the README or in comments.
- Be honest about results; never report tests as passing unless they ran.
- Docker Desktop on Windows: if mounts or networking misbehave, mention it, don't hide it.