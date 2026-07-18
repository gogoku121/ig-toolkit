# Agent Context & Credentials

## MinIO Storage
Credentials are **not** stored in this file (they were previously committed here in plaintext — see CHANGELOG.md and DECISIONS.md, since this repo is public). Real values live in:
- `backend/.env` (gitignored) for the backend proxy service
- The user's local `~/.secrets/personal-credentials.env` for the shared/master copy

The Android app itself no longer needs MinIO credentials at all — it fetches release APKs via a presigned URL from the `backend` service's `/apk/latest` endpoint.

## SerpAPI
Same pattern — the real key lives only in `backend/.env`, never in app source. See `backend/README.md`.

## Project Structure
- `android-kotlin/` — native Kotlin Android app (Jetpack Compose)
- `backend/` — FastAPI proxy that keeps the above secrets off the device
- `android/`, `src/` — legacy Capacitor/web app
