# PROGRESS.md

Tracks the "production-grade rebuild" effort for ig-toolkit, started 2026-07-18. See `PROJECT.md`/`TASKS.md`/`DECISIONS.md` for the standing project docs — this file is specifically for tracking the large multi-session transformation effort.

## How this effort is being run

User explicitly chose "go broad — attempt as much of the full wishlist as possible," accepting this spans many sessions and incurs real LLM/infra costs. Working incrementally per the user's own instructions: for every major change, explain why, show before/after, apply, verify the build still succeeds, run lint/tests where applicable. Priority order (user's own): security > build errors > architecture > AI capabilities > UI/UX > performance > new features.

## Baseline (2026-07-18)

Full audit performed before any changes — see chat history / commit messages for the full 14-category report. Summary scores at baseline:

| Category | Score |
|---|---|
| Architecture | 3/10 |
| Folder structure | 4/10 |
| Dependencies | 4/10 |
| Security | 2/10 (7/10 after prior session's secret-removal fix) |
| Performance | 6/10 |
| UI | 5/10 |
| Compose | 5/10 |
| State management | 6/10 |
| Network | 4/10 |
| Build | 5/10 |
| AI capability | 2/10 (template strings, no real LLM call anywhere) |
| Offline capability | 6/10 |
| Testability | 1/10 (zero tests) |
| Maintainability | 4/10 |

Build baseline: `./gradlew assembleDebug` — **BUILD SUCCESSFUL** (2m52s, only unused-variable warnings, no errors). This is the reference point for "did I break anything."

## Completed

- [2026-07-18] Removed hardcoded SerpAPI key + MinIO admin password; added `backend/` FastAPI proxy (prior session, commit `6d20bea`, pushed to `origin/main`).
- [2026-07-18] Full codebase audit (14 categories, scored above).
- [2026-07-18] Installed JDK 17 (user, via sudo) and verified clean baseline build.
- [2026-07-18] Hilt DI refactor (commit `59a766e`): all engines converted to `@Inject constructor()`/`@Singleton`, `MainViewModel` → `@HiltViewModel`, `MainActivity` → `@AndroidEntryPoint`. Also fixed an unrelated bug found along the way: `android-kotlin/.gradle/` was accidentally tracked in git.
- [2026-07-18] Real LLM caption generation (commit `6142b9b`): `POST /generate` on the backend (Groq), new `LlmCaptionClient`, `MainViewModel` tries LLM first with automatic fallback to templates. Not yet tested end-to-end (backend not deployed).
- [2026-07-18] Room persistence for drafts: `DraftEntity`/`DraftDao`/`AppDatabase` + `DatabaseModule` (Hilt), `MainViewModel.drafts` StateFlow, every generated caption version is now saved automatically. Build verified (`./gradlew assembleDebug`, 1m11s). **Not yet surfaced in the UI** — data layer only; a drafts/history screen is a UI/UX-phase task.

## In Progress

- Task #4 (real LLM integration) — **done**, see Completed section below.
- Task #5 (Room persistence) — **done**, see Completed section below.

## Remaining (backlog, roughly in priority order)

1. **Architecture refactor** — introduce Hilt DI, split into proper `data/remote`, `data/local`, `domain`, `presentation` layers; extract interfaces for engines so they're testable.
2. **Real LLM integration** — replace `CaptionGenerator`'s template strings with an actual LLM call routed through `backend/` (candidate: Groq, since a key is already available in the user's personal credentials store — never in the APK).
3. **Local persistence** — Room for drafts/history instead of in-memory-only state.
4. **Tests** — unit tests for engines/ViewModel once they're behind interfaces; instrumented UI tests later.
5. **UI/UX pass** — navigation (multi-screen via Navigation Compose), loading/error/empty states, dark mode/dynamic color audit.
6. **RAG / knowledge graph upgrade, multi-LLM provider selection, agent-style prompting** — deferred until one real LLM path is solid; these are additive once the foundation exists.
7. **Team workspace / cloud sync** — explicitly out of scope until the user decides this is still a single-user tool or something more.
8. **Play Store compliance pass** — privacy policy, permissions audit, Play Integrity — deferred until the app has real functionality worth publishing.

## Known Issues

- No JDK/Android SDK path was configured for CI-equivalent local builds until this session; now resolved locally (JDK 17 installed via sudo).
- Minor Kotlin compiler warnings exist (unused params/vars in `KnowledgeGraphBuilder.kt`, `ResearchEngine.kt`, `ResearchExtractor.kt`, `MainViewModel.kt`, `MainScreen.kt`) — harmless, but should be cleaned up as those files are touched.
- `backend/` proxy (built prior session) is still not deployed anywhere — real LLM/SerpAPI integration work depends on it being reachable.
- Exposed SerpAPI key / MinIO password from the prior incident still not rotated by the user as of this entry.

## Architecture Decisions

See `DECISIONS.md` for the running decisions log (secrets-via-backend-proxy decision already recorded there). New architectural decisions from this effort will be added there, not duplicated here.

## Migration Notes

(populated as refactors happen — e.g. "CaptionGenerator.generate() signature changed from X to Y, callers updated in MainViewModel")
