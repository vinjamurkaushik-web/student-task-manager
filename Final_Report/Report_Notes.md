# Report Notes – Student Task Manager DevOps Report

Generated 1 November 2026 from the repository at `C:\Devop_Project` (branch `feature/auth-selenium-integration`, HEAD `ef9e7a6`).

Files in this folder:

- `Student_Task_Manager_DevOps_Report.docx`: the editable report. Word has already updated the TOC, List of Figures and List of Tables. If you edit the document, right-click any list and choose **Update Field → Update entire table**.
- `Student_Task_Manager_DevOps_Report.pdf`: exported from the final DOCX by Microsoft Word (29 pages: 7 preliminary pages in roman numerals, then 22 numbered pages).
- `previous_version_67_pages/`: the earlier, longer version of the report (67 pages).

**Shortened version (6 November 2026).** The report was cut from 67 to 29 pages using the same screenshots and diagrams and the same format. Prose was condensed; the code listings were removed except the Dockerfile; Chapters 7 and 8 were merged into one chapter, *Deployment, Operations and Monitoring*, so *Conclusion and Future Scope* is now Chapter 8. These tables were dropped: the full commit history, branches, localStorage keys, the Jenkinsfile comparison, Compose services, the Docker commands, test node IDs, the per-module summary and the DevOps concepts table. The three evidence placeholders were removed. Some screenshots now sit side by side. Figure and table numbers below refer to the 67-page version.

---

## 1. Missing evidence

The three evidence placeholders (signup page, `docker compose up --build` output, browser at `localhost:8080`) were removed from the shortened report. If you capture these screenshots, they could be added back.

Other evidence that would strengthen the report:

- **Commit history screenshot from GitHub.**
- **Jenkins console output for the Checkout stage.** Only the end of the build #14 log was captured.
- **noVNC live browser view** (`http://localhost:7900`) during a test run.
- **Docker Hub page** for `sohails2409/student-task-manager`. The README documents the push, but nothing shows it actually happened. The report says this explicitly.
- **GitHub Pages URL and source branch** (Settings → Pages). The report only states what Figure 2.1 shows: a `github-pages` environment with 8 deployments.

## 2. Discrepancies found and how the report handles them

1. **Team roles compared with the Git history.** The brief said Sohail did authentication and Tejashwin did Docker/Selenium. The commits show the reverse:
   - `e03b8f1` (auth) was authored by *vibemax07* using Tejashwin's email.
   - `f17a511`, `9ee8c97` and `ef9e7a6` were authored by *RenNeedsSleep* using Sohail's email.
   - The Docker Hub tag is `sohails2409`.

   As you chose, the report follows the Git evidence: **Sohail** did Docker, Compose, Selenium, the Jenkins extension, the README and the dark mode. **Tejashwin** did authentication, profile, statistics and categories. **Kaushik** did the report, documentation, initial setup and Jenkins.
2. **Jenkinsfile: the version that ran is not the version committed on the integration branch.**
   - Build #14 validated only `index.html`, `style.css` and `script.js` (console screenshot). So Jenkins ran the **main-branch** Jenkinsfile: Checkout, Validate, Archive.
   - The Jenkinsfile on `feature/auth-selenium-integration` adds **Docker Build** and **Selenium Tests** stages and `post { docker compose down }`. That is the version shown in the VS Code screenshot.
   - The report says clearly that no Jenkins run of these extra stages appears in the evidence (Section 4.8, Table 4.2).
3. **README on the integration branch is outdated.**
   - It lists six Jenkins stages as if they all run.
   - It describes Docker Build as building a `todo-app` image, but the Jenkinsfile actually runs `docker compose build web`.
   - Its Selenium table still says "Not run" for every test. Update it to PASS (16 passed in 34.01 s) before the demo, because the README is graded.
4. **The second-phase work is not merged into `main`.** `feature/auth-selenium-integration` is 5 commits ahead of main, and there is no pull request. GitHub Pages and the Jenkins job therefore still serve and build the first-phase app. Recommendation: open and merge a PR, then optionally tag `v1.0`.
5. **The shared context expected a different merge flow.** It planned "merge auth first, then rebase docker-selenium". In practice the two branches were combined with a merge commit on an integration branch. The report describes what actually happened (Section 2.8).
6. **Stage count.** The shared context says the pipeline has 3 stages. Jenkins shows 4 because declarative pipelines from SCM add an implicit **Checkout SCM** stage. The explicit Checkout stage is redundant, as Section 4.4.2 explains.
7. **File name.** The brief refers to `00-SHARED-CONTEXT.md`. The actual file is `00 shared context.md`.
8. **"Existing IDs" in the shared context was never filled in.** The report lists the IDs from `index.html` instead (Section 3.2.1).
9. **Login does more validation than the contract requires.** It also shows "All fields are required" and "Enter a valid email address". This is documented in Table 3.3.
10. **The untracked folder `student-task-manager/`** is an old clone of `main` at `c813f78`. It is not part of the report.

## 3. Assumptions – please confirm

- **The *Kaushik2* GitHub account (which merged PR #1 and PR #2) belongs to Vinjamur Kaushik.** It uses a different email from *Kaushik192006*.
- **Faculty titles and designations.** The report uses "K. Sunitha, Faculty In-charge" and "Rajnikanth, Head of the Department" with no Dr./Prof. prefixes. Add titles if they are required.
- **No course code.** The report calls the work a "DevOps laboratory project" because no code (similar to CS456PC in the reference) was given.
- **Wording copied from the MyMentor reference.** The title page, certificate and the MGIT logo follow the reference. That includes the affiliation line "(Affiliated to Jawaharlal Nehru Technological University Hyderabad) … (Autonomous)".
- **The Principal is not named.** The acknowledgement thanks the Principal by role only.
- **Jenkins installation details are generic.** Section 4.2 describes the standard Windows install, matching the observed workspace path `C:\ProgramData\Jenkins\...`. The Jenkins version, port and plugins were not captured.
- **Team member names follow your brief.** The reference report spells Sohail's name "MOHAMMED SOHAIL ALI", but the report uses "Mohammed Sohail" as given. Confirm which form the department expects.
- **The Selenium run is the one in the screenshots.** It was run in containers named `devop_project-*`, i.e. from this working directory on the integration branch.

## 4. Reference report

`MyMentor Draft Docs final.docx` was read: Word converted it to PDF, and its text and page images were inspected. The report copies its A4 page, title-page layout (red title and names, centred MGIT logo, department block), certificate layout, declaration, acknowledgement, abstract with keywords, and numbered chapters. The reference has unusually narrow margins (about 0.5–0.6 in), so the report uses the 1-inch margins from your brief instead.

## 5. Redaction and privacy

- E-mail addresses were redacted in the profile screenshot (Figure 3.6) and the login screenshot (Figure 3.5).
- No e-mail addresses appear anywhere in the report text. Commits are identified by account name only.
- The original screenshots in `screenshots/` are unchanged.

## 6. Diagrams

Figures 1.1, 2.3, 3.1, 4.2 and 5.2 are explanatory diagrams drawn for this report from the actual configuration and Git history. They are not screenshots, and their captions describe them as diagrams or reconstructions.
