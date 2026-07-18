# TASKS.md

## In Progress

### Deploy backend/ proxy service
- **Priority:** High
- **Description:** Decide hosting (previously deferred — "decide hosting later") and deploy the FastAPI proxy so `RESEARCH_BACKEND_URL` can be set for real builds. Until then, the app's SerpAPI path and the new `/generate` LLM path are both effectively disabled (falls back to DuckDuckGo research and template captions respectively).
- **Status:** Not started.
- **Dependencies:** None.

### Test real LLM caption generation end-to-end
- **Priority:** High
- **Description:** `LlmCaptionClient`/backend `/generate` are code-complete and build-verified, but have never been exercised against a live deployment + real Groq key. Needs a real device/emulator run once `backend/` is deployed.
- **Status:** Not started.
- **Dependencies:** Deploy backend/ proxy service.

### Restructure into data/domain/presentation folders
- **Priority:** Medium
- **Description:** Hilt DI wiring is done (engines are `@Inject`-able, testable in principle), but files still live in the original `domain/engine`/`domain/model` layout rather than proper `data/remote`, `data/local`, `presentation` layers. Deferred deliberately (see DECISIONS.md) to keep the DI change reviewable on its own.
- **Status:** Not started.
- **Dependencies:** None, but do before task #6 (unit tests) so test structure mirrors the final layout.

### Add multi-provider LLM selection (Gemini/Claude/GPT/OpenRouter/Ollama)
- **Priority:** Low (backlog — see DECISIONS.md)
- **Description:** Original brief asked for user-selectable providers. Deferred until the single Groq path is proven working end-to-end (see "Test real LLM caption generation end-to-end" above).
- **Status:** Not started.
- **Dependencies:** Test real LLM caption generation end-to-end.

### Add a drafts/history screen (UI)
- **Priority:** Medium
- **Description:** `MainViewModel.drafts` (Room-backed) exists but nothing in the UI shows it yet. Needs Navigation Compose (app is currently single-screen) to add a second screen without cramming it into `MainScreen.kt`.
- **Status:** Not started.
- **Dependencies:** None strictly, but natural to pair with the broader Navigation Compose adoption in the UI/UX phase.

## Upcoming

### Rotate exposed credentials (repo owner action)
- **Priority:** Critical
- **Description:** Change the MinIO admin password (`admin` / previously `Goku78700#123`, also used for the user's personal MinIO instance elsewhere) and regenerate the SerpAPI key. Both were committed in plaintext to this public GitHub repo since 2026-07-04.
- **Status:** Not started — requires the repo owner to act directly (outside assistant access).
- **Dependencies:** None, should happen ASAP regardless of other work.

### Set RESEARCH_BACKEND_URL / RESEARCH_BACKEND_APP_KEY for real builds
- **Priority:** High
- **Description:** Once backend is deployed, set these as env vars when running `./gradlew assembleDebug`/`assembleRelease` (see `android-kotlin/app/build.gradle.kts`).
- **Status:** Not started.
- **Dependencies:** Deploy backend/ proxy service.

### Decide fate of legacy web app
- **Priority:** Low
- **Description:** `android/`, `src/`, `www/`, `components/`, `core/`, `generators/` are the pre-Kotlin-pivot Capacitor web app. Decide whether to delete or keep for reference/history.
- **Status:** Not started.
- **Dependencies:** None.

### Add a pre-commit secret scan
- **Priority:** Medium
- **Description:** Add a tool like `gitleaks` as a pre-commit hook so hardcoded secrets can't be committed again.
- **Status:** Not started.
- **Dependencies:** None.

### Consider scrubbing old secrets from git history
- **Priority:** Low (optional — exposure already happened)
- **Description:** The old plaintext MinIO password and SerpAPI key remain visible in earlier commits' history even after removal from HEAD. Only useful for hygiene once rotation is complete — does not undo the exposure.
- **Status:** Not started.
- **Dependencies:** Rotate exposed credentials first.

### Add automated tests
- **Priority:** Medium
- **Description:** No tests currently exist for the Kotlin app or the backend proxy.
- **Status:** Not started.
- **Dependencies:** None.

## Completed
- Native Kotlin Android app with Research Engine, provider failover, quality scoring, debug panel — prior sessions (see CHANGELOG.md)
- Identified live secrets (SerpAPI key, MinIO password) committed to the public repo — 2026-07-18
- Built `backend/` FastAPI proxy (`/research`, `/apk/latest`, `/health`) — 2026-07-18
- Removed hardcoded secrets from `MainViewModel.kt`/`ProviderManager.kt`/`AGENTS.md`; wired Android build to inject backend config via env vars — 2026-07-18
- Created PROJECT.md, TASKS.md, DECISIONS.md documentation set — 2026-07-18
