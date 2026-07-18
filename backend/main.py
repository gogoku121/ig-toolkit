"""
Proxy backend for ig-toolkit's Android app.

Keeps the SerpAPI key and MinIO admin credentials server-side only, so neither
ever ships inside the distributed APK (a hardcoded secret in a client app can
always be pulled back out by decompiling it, regardless of git history).
"""
import json
import time
from collections import defaultdict, deque

import boto3
import requests
from botocore.client import Config as BotoConfig
from decouple import config
from fastapi import Body, FastAPI, Header, HTTPException, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI(title="ig-toolkit backend")

SERPAPI_KEY = config("SERPAPI_KEY")
APP_SHARED_SECRET = config("APP_SHARED_SECRET")

GROQ_API_KEY = config("GROQ_API_KEY", default="")
GROQ_MODEL = config("GROQ_MODEL", default="llama-3.3-70b-versatile")

MINIO_ENDPOINT_URL = config("MINIO_ENDPOINT_URL")
MINIO_ACCESS_KEY = config("MINIO_ACCESS_KEY")
MINIO_SECRET_KEY = config("MINIO_SECRET_KEY")
MINIO_BUCKET = config("MINIO_BUCKET")
APK_OBJECT_KEY = config("APK_OBJECT_KEY", default="ig-toolkit-kotlin-v1.apk")

RATE_LIMIT_MAX_REQUESTS = config("RATE_LIMIT_MAX_REQUESTS", default=30, cast=int)
RATE_LIMIT_WINDOW_SECONDS = config("RATE_LIMIT_WINDOW_SECONDS", default=60, cast=int)

s3 = boto3.client(
    "s3",
    endpoint_url=MINIO_ENDPOINT_URL,
    aws_access_key_id=MINIO_ACCESS_KEY,
    aws_secret_access_key=MINIO_SECRET_KEY,
    config=BotoConfig(signature_version="s3v4"),
)

_request_log: dict[str, deque] = defaultdict(deque)


def _check_rate_limit(client_key: str) -> None:
    now = time.monotonic()
    log = _request_log[client_key]
    while log and now - log[0] > RATE_LIMIT_WINDOW_SECONDS:
        log.popleft()
    if len(log) >= RATE_LIMIT_MAX_REQUESTS:
        raise HTTPException(status_code=429, detail="Rate limit exceeded")
    log.append(now)


def _require_app_secret(x_app_key: str | None) -> None:
    if x_app_key != APP_SHARED_SECRET:
        raise HTTPException(status_code=401, detail="Invalid or missing X-App-Key header")


@app.get("/research")
def research(q: str = Query(..., min_length=1), x_app_key: str | None = Header(default=None)):
    _require_app_secret(x_app_key)
    _check_rate_limit(x_app_key or "anonymous")

    response = requests.get(
        "https://serpapi.com/search.json",
        params={"q": q, "api_key": SERPAPI_KEY},
        timeout=15,
    )
    if response.status_code != 200:
        raise HTTPException(status_code=502, detail=f"SerpAPI upstream error: {response.status_code}")

    data = response.json()
    if "error" in data:
        raise HTTPException(status_code=502, detail=f"SerpAPI error: {data['error']}")

    return JSONResponse({"organic_results": data.get("organic_results", [])})


class GenerateRequest(BaseModel):
    topic: str
    personality: str = "Viral Creator"
    personality_description: str = ""
    goal: str = "Engage"
    versions: int = 3
    research_insights: list[str] = []
    research_keywords: list[str] = []
    research_pain_points: list[str] = []
    research_entities: list[str] = []


class GeneratedCaption(BaseModel):
    caption: str
    hashtags: list[str]


class GenerateResponse(BaseModel):
    captions: list[GeneratedCaption]
    model: str


def _build_prompt(req: GenerateRequest) -> str:
    context_lines = []
    if req.research_insights:
        context_lines.append("Research insights: " + "; ".join(req.research_insights[:3]))
    if req.research_pain_points:
        context_lines.append("Audience pain points: " + "; ".join(req.research_pain_points[:2]))
    if req.research_keywords:
        context_lines.append("Relevant keywords: " + ", ".join(req.research_keywords[:5]))
    if req.research_entities:
        context_lines.append("Related entities/brands: " + ", ".join(req.research_entities[:3]))
    context_block = "\n".join(context_lines) if context_lines else "No live research available for this topic."

    return f"""You are writing Instagram captions for a creator with a "{req.personality}" voice ({req.personality_description}).
Goal of this post: {req.goal}.
Topic: {req.topic}

{context_block}

Write {req.versions} distinct Instagram caption options for this topic. Each should:
- Open with a strong hook (no generic "check this out")
- Reflect the stated personality and goal
- Use the research context above where it's genuinely relevant (don't force it)
- End with a natural call-to-action appropriate to the goal
- Include 8-12 relevant hashtags (no repeats across versions)

Respond ONLY with valid JSON matching this exact shape, no markdown fences, no commentary:
{{"captions": [{{"caption": "...", "hashtags": ["...", "..."]}}]}}"""


@app.post("/generate", response_model=GenerateResponse)
def generate(req: GenerateRequest = Body(...), x_app_key: str | None = Header(default=None)):
    _require_app_secret(x_app_key)
    _check_rate_limit(x_app_key or "anonymous")

    if not GROQ_API_KEY:
        raise HTTPException(status_code=503, detail="LLM generation not configured on the backend")

    prompt = _build_prompt(req)

    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
        json={
            "model": GROQ_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.9,
            "response_format": {"type": "json_object"},
        },
        timeout=30,
    )
    if response.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Groq upstream error: {response.status_code} {response.text[:200]}")

    data = response.json()
    try:
        content = data["choices"][0]["message"]["content"]
    except (KeyError, IndexError) as exc:
        raise HTTPException(status_code=502, detail="Unexpected Groq response shape") from exc

    try:
        parsed_content = json.loads(content)
        captions = [
            GeneratedCaption(caption=c["caption"], hashtags=c.get("hashtags", []))
            for c in parsed_content.get("captions", [])
        ]
    except (ValueError, KeyError) as exc:
        raise HTTPException(status_code=502, detail="Model did not return valid JSON") from exc

    if not captions:
        raise HTTPException(status_code=502, detail="No captions generated")

    return GenerateResponse(captions=captions, model=GROQ_MODEL)


@app.get("/apk/latest")
def apk_latest(x_app_key: str | None = Header(default=None)):
    _require_app_secret(x_app_key)
    _check_rate_limit(x_app_key or "anonymous")

    url = s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": MINIO_BUCKET, "Key": APK_OBJECT_KEY},
        ExpiresIn=600,
    )
    return {"url": url, "expires_in": 600}


@app.get("/health")
def health():
    return {"status": "ok"}
