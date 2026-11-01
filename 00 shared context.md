# DevOps Lab Project — Shared Context (everyone + every agent reads this first)

## 1. What this project is
A DevOps lab project built around a small, framework-free to-do web app for students.
The app is only a vehicle to demonstrate: Git branching, pull requests, GitHub Pages, Jenkins CI, and (new) Docker, Docker Compose and Selenium testing.

**Hard deadline: Monday 02.11.2026 (lab project evaluation, 20 marks).**
Evaluation items: (1) Docker deployment demo, (2) Selenium testing demo, (3) README file updated, (4) project report hard copy (single copy per team).

## 2. Current state of the repo
- `index.html` (78 lines): page structure + inline script that sets saved theme before first paint (no flash of wrong theme).
- `script.js` (195 lines): tasks are `{id: Date.now(), name, completed}` in an in-memory array; `addTask`, `toggleTask`, `deleteTask`, `renderTasks`; persisted in `localStorage`; task stats counter; dark/light toggle (also in `localStorage`).
- `style.css` (300 lines): responsive, CSS custom properties for light/dark theming with transition.
- `Jenkinsfile`: declarative pipeline, 3 stages: Checkout (`checkout scm`) -> Validate (Windows `bat`, only checks that index.html/style.css/script.js exist) -> Archive (fingerprinted artifacts). No tests, no lint.
- Git history: feature-branch + PR workflow (`feature/dark-mode` merged as PR #2). Latest commits: "New change now", "Showing maam".
- README ends with stray lines ("Jenkins CI automation test", "Testing phase 2/3/4") — clean these up.
- No build step, no dependencies. Keep it that way (vanilla HTML/CSS/JS only).

## 3. What we are adding
The app has too few features to test meaningfully, so we add an **authentication layer** (signup, login, logout, profile) that is Selenium-friendly. Everything is client-side (localStorage) — there is no backend. Then we containerise it and write Selenium tests.

## 4. Team split (three people, three agents, working in parallel)
| Person | Owns | Branch | Brief file |
|---|---|---|---|
| 1 | Project report (Word/PDF, hard copy) | `docs/report` (or off-repo) | `01-report-person.md` |
| 2 | Auth features (signup/login/logout/profile) | `feature/auth` | `02-auth-features-person.md` |
| 3 | Dockerfile, docker-compose, Selenium tests, Jenkinsfile update, README | `feature/docker-selenium` | `03-docker-selenium-person.md` |

Each person gives their agent: this file + their own brief.

## 5. THE CONTRACT (do not change without telling the other two)
Persons 2 and 3 work at the same time, so Person 3 writes tests against this contract **before** Person 2 finishes. Person 2 must implement exactly these names.

### 5.1 Pages
| File | Purpose |
|---|---|
| `signup.html` | Create account |
| `login.html` | Log in |
| `index.html` | Task list (existing). Requires login; otherwise redirect to `login.html` |
| `profile.html` | Edit name, change password. Requires login |
| `auth.js` | Shared auth logic used by all pages |

### 5.2 Element IDs (Selenium locators)
**signup.html:** `signup-name`, `signup-email`, `signup-password`, `signup-confirm`, `signup-submit`, `signup-error`, `goto-login`
**login.html:** `login-email`, `login-password`, `login-submit`, `login-error`, `goto-signup`
**index.html (added):** `user-greeting`, `profile-link`, `logout-btn`. Existing task elements keep their current IDs — **Person 2 must list those existing IDs at the bottom of this file under "Existing IDs" and not rename them.**
**profile.html:** `profile-name`, `profile-email` (read-only), `profile-save`, `profile-message`, `current-password`, `new-password`, `change-password-btn`, `password-message`, `back-to-tasks`

### 5.3 Validation rules and exact messages
| Rule | Message shown in the error element |
|---|---|
| Any field empty | `All fields are required` |
| Email not like `name@domain.tld` | `Enter a valid email address` |
| Password shorter than 6 chars | `Password must be at least 6 characters` |
| Confirm does not match | `Passwords do not match` |
| Email already registered | `Email already registered` |
| Login: email not found or wrong password | `Invalid email or password` |
| Profile saved | `Profile updated` |
| Password changed | `Password changed` |
| Current password wrong | `Current password is incorrect` |

Successful signup -> redirect to `login.html`. Successful login -> redirect to `index.html`. Logout -> `login.html`.

### 5.4 localStorage keys
- `users` — JSON array of `{id, name, email, passwordHash}`
- `currentUserId` — id of logged-in user (absent when logged out)
- `tasks_<userId>` — each user's own tasks (users must NOT see each other's tasks)
- `theme` — existing theme key (leave unchanged)

Email comparison is case-insensitive (store lowercase).

### 5.5 Docker contract
- App served by nginx on container port 80, published on host `http://localhost:8080`.
- Inside the compose network the app is reachable at `http://web`.
- Tests read env vars `BASE_URL` (default `http://web`) and `SELENIUM_URL` (default `http://selenium:4444/wd/hub`).

### 5.6 Gotcha everyone should know
`crypto.subtle` only works in a secure context (https or `localhost`). Selenium reaches the app at `http://web`, which is NOT secure, so `crypto.subtle` would be undefined and login would break in tests. **Person 2: do not use `crypto.subtle`.** Use a simple hand-written hash function (demo-level, say so in a comment and in the report). This is a lab project, not real security.

## 6. Git rules
- One branch per person (table above). Never commit straight to `main`.
- Open a PR per branch; the others review it (this is also report material — screenshots of PRs).
- Merge order: `feature/auth` first, then `feature/docker-selenium`. Person 3 rebases after auth merges and re-runs tests.
- Small commits with clear messages (not "New change now").

## 7. Timeline (deadline is Monday)
| When | Target |
|---|---|
| Tonight | Person 2: auth pages working + PR open. Person 3: Dockerfile + compose running the app, test skeleton written against the contract. Person 1: report structure, certificate, TOC, front matter, chapters drafted |
| Sunday/Monday morning | Merge auth, run Selenium tests green, update Jenkinsfile + README, Person 1 drops in screenshots, print and bind report |
| Before demo | Everyone rehearses: `docker compose up --build` then `docker compose run --rm tests` |

## 8. Instructions for every agent
- The user is a student: write **very beginner-friendly code** with a comment on every non-obvious line.
- For each piece of code explain: what it does, why it exists, how to run it.
- Stay vanilla (no frameworks, no build tools) for the app.
- Stay inside your own brief's scope; if you need something from another person, state it as a request rather than editing their files.
- Be honest about what is demo-level.

## Existing IDs (Person 2 fills this in)
_(list the IDs currently used in index.html for the task input, add button, list, stats, theme toggle)_