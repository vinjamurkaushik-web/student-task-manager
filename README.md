# Student Task Manager

A simple web application to manage your college tasks. Built as a **DevOps lab project** to demonstrate Git branching, GitHub Pull Requests, GitHub Pages deployment, and Jenkins CI pipelines.

---

## Features

- Add, complete, and delete tasks
- Tasks saved in localStorage (survive page refresh)
- Clean, responsive design (desktop and mobile)
- Task statistics counter *(added in Feature Branch 2)*
- **Dark Mode / Light Mode toggle** *(added in `feature/dark-mode`)*
  - Smooth CSS transition between themes
  - User preference saved to localStorage
  - No flash of wrong theme on page reload (FOUC-free)
- Client-side signup, login, logout, and profile management
- User-specific task lists saved in browser localStorage

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

---

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML | Page structure |
| CSS | Styling, responsive layout, CSS custom properties for theming |
| JavaScript | Task logic, localStorage, theme toggle |

No frameworks, no dependencies, no build tools required.

---

## How to Run

1. Clone or download this repository
2. Open `index.html` in any modern browser
3. Open `login.html` or `signup.html` and create an account — no server or
   installation needed

---

## Project Structure

```
student-task-manager/
├── index.html    ← Page structure + theme init script
├── login.html    ← Login form
├── signup.html  ← Registration form
├── profile.html ← Profile and password management
├── style.css     ← All styling (CSS variables for light/dark)
├── script.js     ← User-specific task logic and theme toggle
├── auth.js       ← Client-side demo authentication
├── README.md     ← This file
├── Jenkinsfile   ← Jenkins CI pipeline
└── .gitignore    ← Files excluded from Git
```

---

## Git / GitHub Workflow

```
main (stable)
 ├── feature/base-tasks       ← Student 1: core task features
 ├── feature/stats-darkmode   ← Student 2: statistics + dark mode
 └── feature/dark-mode        ← Dark mode toggle (this branch)
```

1. Each student creates a **feature branch** from `main`
2. Student makes changes and commits on their branch
3. Student opens a **Pull Request** on GitHub
4. Team reviews and merges the PR into `main`

---

## Jenkins CI Workflow

1. Jenkins watches the GitHub repository
2. When a commit is pushed, Jenkins automatically:
   - Checks out the code
   - Validates all required files exist
   - Prints build info
   - Archives project files as build artifacts
3. Pass/Fail result shown on the Jenkins dashboard

---

*DevOps Lab Project — for demonstration purposes only.*

Jenkins CI automation test

Testing phase 2

Testing phase 3

Testing 4