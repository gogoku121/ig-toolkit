# IG Toolkit - AI-Powered Content Intelligence Platform

A production-ready Android application and web platform for Instagram content creators.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Android App (Native Shell)              │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ Splash Screen│  │  Settings   │  │  Share Sheet    │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
├─────────────────────────────────────────────────────────┤
│                   WebView (Business Logic)              │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐   │
│  │           Research Engine (Internet-First)         │   │
│  │  ProviderManager → ResearchCache → Generator      │   │
│  └──────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐   │
│  │           Intelligence Engine (AI)                 │   │
│  │  SupremeGenerator → OriginalityEngine → Editor    │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Quick Start

### Web App
```bash
npm install
npm start
```

### Android App
```bash
npx cap sync android
npx cap open android
```

## Build

### Debug APK
```bash
cd android
./gradlew assembleDebug
```
APK: `android/app/build/outputs/apk/debug/app-debug.apk`

## GitHub Actions

CI/CD runs on every push:
- Lint code
- Build Debug APK
- Build Release APK
- Upload artifacts

## Project Structure

```
├── index.html           # Web app entry
├── src/                # Web app source
│   ├── core/          # Intelligence & Research engines
│   ├── generators/     # Content generators
│   └── ui/            # UI components
├── android/           # Android native shell
└── .github/workflows/ # CI/CD
```

## License

MIT
