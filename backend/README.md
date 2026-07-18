# ig-toolkit backend

Small FastAPI proxy that keeps the SerpAPI key and MinIO admin credentials off the Android device entirely. The app talks to this service instead of calling SerpAPI or MinIO directly.

## Why this exists

The Android app used to embed the SerpAPI key and a MinIO admin password directly in its source. Both were pulled straight out of the public GitHub repo (and would have been just as easy to pull out of the built APK via decompilation, regardless of git history). This service moves those secrets server-side.

## Endpoints

- `GET /research?q=<query>` — proxies to SerpAPI, returns `{"organic_results": [...]}`
- `POST /generate` — proxies to Groq's chat completions API for real LLM-based caption generation (replaces the Android app's old template-only generator; templates remain as an offline fallback client-side). Body: `{topic, personality, personality_description, goal, versions, research_insights, research_keywords, research_pain_points, research_entities}`. Returns `{"captions": [{"caption": "...", "hashtags": [...]}], "model": "..."}`. Returns `503` if `GROQ_API_KEY` isn't configured.
- `GET /apk/latest` — returns a short-lived (10 min) presigned MinIO URL for downloading the release APK
- `GET /health` — liveness check

All endpoints except `/health` require an `X-App-Key: <APP_SHARED_SECRET>` header (see `.env.example`). This isn't a substitute for real user auth — it's a minimal gate so casual scraping of the endpoint doesn't run up your SerpAPI bill — combined with basic per-key rate limiting.

## Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# fill in SERPAPI_KEY, APP_SHARED_SECRET, MINIO_ACCESS_KEY, MINIO_SECRET_KEY
```

## Running locally

```bash
source venv/bin/activate
uvicorn main:app --reload --port 8001
```

## Deployment

Not yet deployed — hosting location is still an open decision (see TASKS.md in the project root). Any host that can run a small Python process and reach both `serpapi.com` and the MinIO endpoint will work.
