# IG Toolkit

**Native Android app** for AI-powered Instagram caption generation with real-time research capabilities.

## Features

- 🤖 **AI Caption Generation** - 10 personality types, multiple versions
- 🔍 **Live Research** - DuckDuckGo & SerpAPI with auto-failover
- 📊 **Quality Scoring** - 7-factor research quality assessment
- 🌐 **Smart Fallback** - ONLINE → CACHE → MEMORY → OFFLINE
- 📱 **Native Android** - Jetpack Compose, Material 3
- 🐛 **Debug Panel** - Provider health, latency, success rates

## Get Started

### Install APK

Download `ig-toolkit-kotlin-v1.apk` from MinIO and install on your Android device.

### Build from Source

```bash
cd android-kotlin
./gradlew assembleDebug
```

APK: `android-kotlin/app/build/outputs/apk/debug/app-debug.apk`

### Development

```bash
cd android-kotlin
./gradlew run
```

## Project Structure

```
├── android-kotlin/     # Native Kotlin Android app (Jetpack Compose)
├── android/           # Capacitor WebView app (legacy)
├── src/               # Web app source files (legacy)
└── docs/              # Documentation
```

## Architecture

```
┌─────────────────────────────────────────┐
│              UI Layer                    │
│  (Jetpack Compose - MainScreen)         │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│           Domain Layer                   │
│  ResearchEngine │ CaptionGenerator       │
│  QualityScorer │ ProviderManager       │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│           Data Layer                     │
│  OkHttp (Network) │ DataStore (Local)   │
└─────────────────────────────────────────┘
```

## App Modes

| Mode | Indicator | Description |
|------|-----------|-------------|
| ONLINE | 🟢 Green | Live research from search APIs |
| CACHE | 🟠 Orange | Using cached research data |
| MEMORY | 🔵 Blue | Using stored knowledge |
| OFFLINE | 🔴 Red | Local intelligence only |

## Documentation

- [docs/SPEC.md](./docs/SPEC.md) - Technical specification
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Architecture details
- [CHANGELOG.md](./CHANGELOG.md) - Version history
