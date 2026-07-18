# PROJECT.md

## Project Overview
IG Toolkit — an AI-powered Instagram content assistant (captions, hashtags, Reels ideas, product descriptions, story posts, reply suggestions) with live web research to ground generated content. Originally a web app wrapped in Capacitor; now primarily a native Kotlin Android app.

## Goal
Give a single user (or small team) a mobile tool that generates high-quality, research-grounded Instagram content across multiple formats and "personality" styles.

## Current Status
Native Android app (`android-kotlin/`) is the active codebase — Jetpack Compose UI, an internal ResearchEngine with provider failover (SerpAPI/DuckDuckGo), quality scoring, and a debug panel. The original Capacitor/web app (`android/`, `src/`, `www/`) is legacy and no longer the primary target. As of 2026-07-18, a `backend/` FastAPI proxy was added to stop the app from embedding a live SerpAPI key and MinIO admin credentials directly (both had been committed to this public repo in plaintext).

## Tech Stack
- **Active:** Kotlin, Jetpack Compose, Material 3, OkHttp, kotlinx.coroutines, DataStore
- **Backend proxy:** Python, FastAPI, boto3 (MinIO/S3), python-decouple
- **Legacy web app:** vanilla JS (ES modules), Capacitor (Android WebView wrapper)

## Architecture
```
UI Layer (Jetpack Compose - MainScreen)
        │
Domain Layer (ResearchEngine, CaptionGenerator, QualityScorer, ProviderManager)
        │
Data Layer (OkHttp → backend proxy → SerpAPI/DuckDuckGo/MinIO; DataStore for local persistence)
```
The Android app no longer talks to SerpAPI or MinIO directly — it goes through `backend/` (see `backend/README.md` and `DECISIONS.md`), which holds the real secrets server-side and exposes `/research` and `/apk/latest`.

## Folder Structure
```
ig-toolkit/
├── android-kotlin/     # Active native Android app
├── backend/            # FastAPI proxy (SerpAPI + MinIO credential isolation)
├── android/            # Legacy Capacitor wrapper
├── src/, www/          # Legacy web app source/build
├── components/, core/, generators/  # Legacy web app modules (duplicated under src/)
├── docs/               # ARCHITECTURE.md, SPEC.md
├── AGENTS.md           # Where credentials/config actually live (no secrets committed)
└── INTELLIGENCE_AUDIT.md
```

## Development Environment
- Android app: build via `android-kotlin/./gradlew assembleDebug`; requires `RESEARCH_BACKEND_URL` and `RESEARCH_BACKEND_APP_KEY` env vars set at build time (see `android-kotlin/app/build.gradle.kts`).
- Backend: `cd backend && python3 -m venv venv && pip install -r requirements.txt`, configure via `.env` (copy from `.env.example`).
- Legacy web app: `npm start` (serves `www/` on :8080).

## Dependencies
See `android-kotlin/app/build.gradle.kts` for Android deps; `backend/requirements.txt` for the proxy service; `package.json` for the legacy web app.

## Coding Standards
Modular, small well-documented functions; readability over cleverness; avoid duplication; add logging where appropriate; add tests for new functionality when practical; never delete existing functionality without confirmation; preserve backward compatibility unless explicitly instructed otherwise. Never hardcode secrets in client-distributed code (Android app) — anything sensitive goes through `backend/`.

## Current Milestone
Post-incident hardening: secrets removed from the client app and backend proxy stood up. Next milestone is deploying that backend somewhere reachable and rotating the exposed credentials.

## Current Task
Decide and set up hosting for `backend/`; repo owner still needs to rotate the exposed SerpAPI key and MinIO admin password.

## Completed Tasks
- Native Kotlin Android app with Research Engine, quality scoring, debug panel (prior sessions — see CHANGELOG.md)
- Identified two live secrets committed to this public repo (SerpAPI key, MinIO admin password) — 2026-07-18
- Built `backend/` FastAPI proxy for SerpAPI search + presigned MinIO APK downloads — 2026-07-18
- Removed hardcoded secrets from `MainViewModel.kt`, `ProviderManager.kt`, `AGENTS.md`; wired Android build to inject backend config via env vars instead — 2026-07-18
- Created PROJECT.md, TASKS.md, DECISIONS.md (this doc set) — 2026-07-18

## Upcoming Tasks
See TASKS.md.

## Design Decisions
See DECISIONS.md.

## Known Issues
- **The exposed SerpAPI key and MinIO password have NOT been rotated yet.** Removing them from the code does not undo ~2 weeks of public exposure on GitHub. This is the repo owner's action item, outside the assistant's access.
- `backend/` is not deployed anywhere yet — `RESEARCH_BACKEND_URL` is empty by default, so the Android app's SerpAPI path is currently disabled (falls back to DuckDuckGo) until it's deployed and the build env vars are set.
- Legacy web app (`android/`, `src/`, `www/`) is unmaintained; unclear if it should be deleted or kept for reference.
- Git history still contains the old plaintext secrets in earlier commits; scrubbing history (e.g. `git filter-repo`) is optional once rotation is done, since exposure already happened.

## Risks
- Reused credentials: the leaked MinIO password was also used for the user's personal MinIO instance elsewhere — rotating it here means updating it everywhere it's used (see the assistant's memory reference for personal credential locations).
- Public repo: any future commit needs a quick secret-scan before pushing (no automated pre-commit hook for this exists yet — consider adding one, e.g. `gitleaks`).

## Testing Status
No automated tests currently exist for either the Android app or the backend proxy.

## Deployment Status
Android app: not published, built from source / sideloaded APK. Backend: not deployed (see Known Issues).

## Useful Commands
```bash
# Android
cd android-kotlin && ./gradlew assembleDebug

# Backend
cd backend && source venv/bin/activate && uvicorn main:app --reload --port 8001

# Legacy web app
npm start
```

## References
- `docs/ARCHITECTURE.md`, `docs/SPEC.md` — legacy web app architecture/spec
- `INTELLIGENCE_AUDIT.md` — audit of the content-generation intelligence engine
- `backend/README.md` — why the proxy exists and how to run it

## Session Notes
- 2026-07-18: Cloned the repo fresh from GitHub as a new local project. Discovered a live MinIO admin password (`AGENTS.md`) and a hardcoded SerpAPI key (`MainViewModel.kt`) committed to this **public** repo since 2026-07-04. User asked for a workaround so end users never interact with these secrets directly (relevant since this is a distributed Android app — a hardcoded secret is recoverable via APK decompilation regardless of git history). Built a `backend/` FastAPI proxy holding both secrets server-side, updated the Android app to call the proxy instead, and removed the plaintext values from source. Repo owner still needs to rotate both credentials and decide where to host the backend.
