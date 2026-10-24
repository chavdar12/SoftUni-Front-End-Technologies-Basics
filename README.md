# SoftUni – Front-End Technologies Basics

Exercises from the SoftUni QA course [Front-End Technologies Basics](https://softuni.bg/courses/front-end-technologies-basics):
HTML/CSS, async JavaScript, DOM, Firebase, QUnit and Playwright UI testing.

## Sources

Most lesson content is copied from other students' public repositories. They carry no license, so credit goes to their authors:

| Lesson | Source |
| --- | --- |
| 002–004, 006, 007, 009–013, 015–017, 020, 021 | [SimeonSavov/Front-End-Technologies](https://github.com/SimeonSavov/Front-End-Technologies) @ `c1f0207` |
| 005, 008 (lecture demos/notes) | [justdeso99/SoftUni-Front-End-Technologies-Basics](https://github.com/justdeso99/SoftUni-Front-End-Technologies-Basics) @ `d67632c` |
| 001, 014, 018, 019 | nothing public found – empty project |

## Tests

```bash
npm ci && npm test                                   # node:test + jsdom unit tests (*.unit.mjs next to each program)
cd 012-Exercise-qUnit && npm ci && npm test          # QUnit lessons (also 011)
```

E2E (Playwright) projects: 015, 016, 017, 020/02, 021/Task-2. In each one:

```bash
npm ci && npx playwright install chromium
cd server && node server.js &                        # REST backend on :3030 (not needed for 015)
npx http-server -a localhost -p 3001 -P "http://localhost:3001?" -c-1 &   # 015 uses port 8090
npm test
```

GitHub Actions (`.github/workflows/ci.yml`) runs all of the above on every push to `main` and on pull requests.
