# DECISIONS.md

## MockK + kotlinx-coroutines-test for the first unit tests, not Mockito
- **Decision:** Added `io.mockk`, `kotlinx-coroutines-test`, and `app.cash.turbine` as test dependencies; wrote `QualityScorerTest`, `CaptionGeneratorTest` (pure-logic classes, no mocks needed), and `MainViewModelTest` (mocks `ResearchEngine`/`CaptionGenerator`/`LlmCaptionClient`/`DraftDao`).
- **Reason:** MockK mocks Kotlin final classes natively (the engine classes aren't behind interfaces yet — see the deferred folder-restructure task), whereas Mockito needs `mockito-inline`/careful setup to do the same. `kotlinx-coroutines-test`'s `StandardTestDispatcher` is needed to deterministically drive `MainViewModel`'s `viewModelScope.launch` coroutines in tests.
- **Alternatives considered:** Mockito-Kotlin — more common historically, but MockK's DSL is more idiomatic for Kotlin and handles `StateFlow` properties on mocked classes more cleanly.
- **Trade-offs:** None significant; this is a standard, well-supported combination for Android/Kotlin testing.
- **Note:** the test suite caught two wrong assertions in my own first draft of `QualityScorerTest` (assumed "empty research" would score 0, but a fresh timestamp alone contributes 10 points; assumed a "rich" fixture would hit exactly 100 but I'd omitted one of 8 diversity categories) — fixed by actually running `./gradlew testDebugUnitTest` rather than assuming the tests were correct once written.

## Room persistence added at the data layer only, no UI yet
- **Decision:** Added `DraftEntity`/`DraftDao`/`AppDatabase` (Room) and wired `MainViewModel` to auto-save every generated caption version and expose a `drafts` StateFlow. Did not add a drafts/history screen in the same pass.
- **Reason:** The app previously lost all generated captions on process death (audit flagged this — no `SavedStateHandle`, no persistence at all). Room is the standard Android solution and was already implied by the brief. Building the data layer first, UI later, follows the same "don't bundle unrelated concerns in one diff" approach used for the Hilt refactor.
- **Alternatives considered:** DataStore (already a dependency) — rejected for structured, queryable, growing lists of drafts; DataStore suits key-value preferences, not a table of records. SQLDelight — viable alternative to Room, but Room has tighter Hilt/Compose ecosystem integration and is the more common default.
- **Trade-offs:** Drafts are being saved but there's no way for a user to see/browse/delete them yet — that's a real UX gap until the drafts screen is built (tracked in TASKS.md, part of the UI/UX phase which also needs Navigation Compose since the app is currently single-screen).

## Real LLM generation added as primary path, templates kept as fallback (not replaced)
- **Decision:** Added a `/generate` endpoint to `backend/` that calls Groq's API server-side. `MainViewModel.generate()` tries this LLM path first when the backend is configured, and falls back to the existing template-based `CaptionGenerator` on any failure — network error, backend unreachable, rate limit, or malformed model output.
- **Reason:** The audit flagged "AI capability" at 2/10 because generation was purely string templates despite being marketed as "AI-powered." Groq was chosen because a working API key already exists in the user's personal credentials store (see the assistant's memory reference for where it's stored) — no new account/signup needed to get a first real integration working. Keeping templates as a fallback (rather than deleting them) preserves the app's existing offline-capability story (ONLINE→CACHE→MEMORY→OFFLINE ladder) — a network/backend outage degrades caption quality but doesn't break the app.
- **Alternatives considered:** Multi-provider selection (Gemini/Claude/GPT/OpenRouter/Ollama) as requested in the original brief — deferred; picking one working provider end-to-end first is lower risk than building a provider-abstraction layer before any of them are proven to work through the new backend. Removing templates entirely — rejected, since that would remove the offline fallback with no replacement.
- **Trade-offs:** Real LLM calls cost money per request (Groq) and add latency (network round trip to backend, then to Groq) compared to instant local template generation. This path is code-complete but not yet tested end-to-end since `backend/` isn't deployed anywhere yet.

## Adopted Hilt for dependency injection instead of manual construction
- **Decision:** All engine classes (`ProviderManager`, `ResearchCache`, `QualityScorer`, `ResearchExtractor`, `NetworkChecker`, `ResearchEngine`, `CaptionGenerator`) now use `@Inject constructor()` and are provided as `@Singleton`s; `MainViewModel` is `@HiltViewModel`; `MainActivity` uses `@AndroidEntryPoint`.
- **Reason:** The original code had `MainViewModel` directly constructing `ResearchEngine()` and `CaptionGenerator()`, which themselves directly constructed their own dependencies internally. This tight coupling made the classes impossible to unit test (no way to substitute a fake `ProviderManager` in `ResearchEngine`, for example) and was flagged as the #1 architecture issue in the audit (3/10).
- **Alternatives considered:** Manual DI (factory functions/service locator) — rejected as still ad-hoc and not idiomatic for the rest of the Android ecosystem (Room, WorkManager, Navigation all have first-class Hilt integration); Koin — viable alternative, but Hilt is the Google-recommended default and has less runtime reflection overhead.
- **Trade-offs:** Adds KSP annotation processing to the build (slightly longer build times — this build went from 2m52s to 3m10s baseline), but unlocks proper testability and is a prerequisite for Room/WorkManager integration.

## Deferred: physical folder restructuring into data/domain/presentation layers
- **Decision:** Did the Hilt DI wiring (removing tight coupling) without also physically moving files into `data/remote/`, `data/local/`, `presentation/` folders in the same pass.
- **Reason:** The DI wiring alone already delivers the testability/coupling win; a large file-move in the same commit would make the diff much harder to review and increases risk of merge/rename mistakes. Splitting the two concerns into separate, independently-verifiable steps follows the "explain why, show before/after, verify build" workflow requested for this effort.
- **Alternatives considered:** Doing both at once — rejected for the reason above.
- **Trade-offs:** Folder structure still doesn't reflect the "3/10 → target" architecture goal yet; tracked as a follow-up in TASKS.md/PROGRESS.md rather than considered done.

## Secrets moved server-side via a new backend proxy, not just deleted from git
- **Decision:** Instead of only removing the hardcoded SerpAPI key and MinIO admin password from source, stood up a small `backend/` FastAPI service that holds both secrets server-side and exposes safe, narrow endpoints (`/research`, `/apk/latest`) for the Android app to call.
- **Reason:** This is a distributed Android app — any secret embedded in app source ships inside the built APK and can be recovered by decompiling it, independent of whether it's also visible in git history. Removing a secret from source without changing the architecture would have just re-hidden the same problem. The user explicitly wants end users to never interact with (or be able to extract) these credentials.
- **Alternatives considered:** (a) Just delete the secrets from source and rely on `.gitignore`/env vars baked into the APK at build time — rejected, since build-time env vars still get compiled into `BuildConfig` constants inside the APK, equally extractable; (b) route everything through the existing n8n instance as a workflow — user chose a standalone service instead so it isn't coupled to n8n's uptime/availability.
- **Trade-offs:** Adds a new service to deploy and keep running; the Android app now has a hard dependency on that backend being reachable for the SerpAPI path (DuckDuckGo still works with no backend, as a fallback).

## App-level shared secret (`X-App-Key`) is not a real security boundary
- **Decision:** The backend requires an `X-App-Key` header, but this value still ships inside the APK (via `BuildConfig.RESEARCH_BACKEND_APP_KEY`) and is technically extractable the same way the old SerpAPI key was.
- **Reason:** The goal here isn't perfect security (impossible for a fully client-distributed app without a real user-auth/backend-issued-token system) — it's to stop the *billed, high-value* secrets (SerpAPI key, MinIO admin credentials) from being exposed. The shared secret just adds basic gating plus rate limiting against casual abuse/scraping of the proxy itself.
- **Alternatives considered:** Real per-user auth (OAuth/JWT issued at login) — overkill for a single-user personal tool at this stage; anonymous/no-auth proxy — rejected, since it would let anyone who finds the URL run up the SerpAPI bill with no rate limiting.
- **Trade-offs:** If someone decompiles the APK and extracts the shared secret, they can still hit the rate-limited proxy (burning quota/incurring some cost) — but they cannot get the actual SerpAPI key or MinIO credentials, which was the primary risk.

## MinIO APK download via presigned URL, not public bucket ACL
- **Decision:** Rather than making the MinIO bucket/object public-read, the backend generates a short-lived (10 minute) presigned URL for the APK object on request.
- **Reason:** Avoids making a live change to bucket ACLs on the user's actual running MinIO server without being asked; keeps one consistent security model (everything goes through `backend/`) instead of two different ones (public bucket for APK, proxy for search).
- **Alternatives considered:** Public-read bucket policy for just the APK object — simpler, no backend endpoint needed, but wasn't pursued without explicit confirmation since it's a live infrastructure change to a shared system.
- **Trade-offs:** Requires the backend to be up for anyone to download the APK (a public bucket would work even if the backend were down), but avoids touching live bucket permissions unilaterally.

## Backend built as a standalone Python service, hosting decided later
- **Decision:** Built `backend/` as an independent FastAPI service rather than as an n8n workflow or embedded in the existing n8n instance.
- **Reason:** User's explicit choice, given as an option alongside "reuse the n8n server" and "expose as an n8n workflow."
- **Alternatives considered:** n8n webhook workflow (would need no new codebase, but ties this critical path to n8n's uptime and workflow-editor-based logic instead of ordinary code); reusing the n8n server as host (still undecided — could still end up there).
- **Trade-offs:** One more service to deploy and operate, but decoupled from n8n and easier to reason about/version in git as ordinary code.
