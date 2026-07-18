"""
Proxy backend for ig-toolkit's Android app.

Keeps the SerpAPI key and MinIO admin credentials server-side only, so neither
ever ships inside the distributed APK (a hardcoded secret in a client app can
always be pulled back out by decompiling it, regardless of git history).
"""
import time
from collections import defaultdict, deque

import boto3
import requests
from botocore.client import Config as BotoConfig
from decouple import config
from fastapi import FastAPI, Header, HTTPException, Query
from fastapi.responses import JSONResponse

app = FastAPI(title="ig-toolkit backend")

SERPAPI_KEY = config("SERPAPI_KEY")
APP_SHARED_SECRET = config("APP_SHARED_SECRET")

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
