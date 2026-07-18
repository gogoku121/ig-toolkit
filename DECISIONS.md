# DECISIONS.md

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
