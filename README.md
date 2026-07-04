# IG Toolkit - AI-Powered Content Intelligence Platform

A production-ready Android application and web platform for Instagram content creators.

## Project Structure

```
ig-toolkit/
├── www/                 # Web app (standalone, browser-ready)
│   ├── index.html
│   └── src/
├── android/            # Android native shell
│   └── app/src/main/assets/web/  # Copied from www/
├── src/                # Source files
├── package.json
└── .github/workflows/  # CI/CD
```

## Quick Start

### Web Development
```bash
npm install
npm start        # Run web app in browser (localhost:8080)
npm run dev      # Run with CORS enabled
```

### Android Development
```bash
npm run dev:android   # Build APK
npm run open:android  # Open in Android Studio
```

### Build Commands
```bash
npm run build:web     # Build web app (copies src/ to www/)
npm run build:android # Sync web to Android
```

## Architecture

```
┌─────────────────────┐     ┌─────────────────────┐
│   Web Browser       │     │   Android App       │
│   localhost:8080    │     │   (WebView)        │
└──────────┬──────────┘     └──────────┬──────────┘
           │                           │
           ▼                           ▼
      ┌────────────────────────────────┐
      │           www/ (web app)        │
      │  - Research Engine              │
      │  - Intelligence Engine         │
      │  - UI Components               │
      └────────────────────────────────┘
```

## Development Workflow

1. **Develop in browser** - `npm start` → `localhost:8080`
2. **Test changes** - Edit `src/` files → Refresh browser
3. **Build web** - `npm run build:web` (copies to www/)
4. **Build APK** - `npm run dev:android`

## GitHub Actions

CI/CD runs on every push:
1. Build web app (`npm run build:web`)
2. Copy to Android assets
3. Build Debug APK
4. Upload artifacts

## License

MIT
