# Architecture

Native Android application built with Kotlin and Jetpack Compose.

## Tech Stack

| Layer | Technology |
|-------|------------|
| UI | Jetpack Compose + Material 3 |
| State | ViewModel + StateFlow |
| Network | OkHttp |
| Local Storage | DataStore Preferences |
| Build | Gradle + Kotlin DSL |

## Project Structure

```
android-kotlin/
├── app/src/main/java/com/igtoolkit/app/
│   ├── MainActivity.kt           # Entry point
│   ├── domain/
│   │   ├── model/
│   │   │   └── Models.kt         # Data classes
│   │   └── engine/
│   │       ├── ResearchEngine.kt    # Main orchestrator
│   │       ├── ProviderManager.kt    # Search providers
│   │       ├── QualityScorer.kt      # 7-factor scoring
│   │       ├── ResearchExtractor.kt   # Data extraction
│   │       ├── ResearchCache.kt      # In-memory cache
│   │       └── CaptionGenerator.kt   # AI generation
│   └── ui/
│       ├── MainViewModel.kt          # State management
│       ├── theme/
│       │   └── Theme.kt              # Material 3 theme
│       └── screens/
│           └── MainScreen.kt         # Main UI
```

## Domain Layer

### Research Engine

The `ResearchEngine` is the main orchestrator that coordinates research activities:

```
research(query)
    │
    ├─► tryLiveResearch()
    │       │
    │       └─► ProviderManager.search()
    │               │
    │               └─► ResearchExtractor.extract()
    │                       │
    │                       └─► QualityScorer.score()
    │
    ├─► researchCache.get()
    │
    └─► createOfflineResearch()
```

### Provider Manager

Manages search providers with auto-failover:

- **DuckDuckGo** - Free, no API key required
- **SerpAPI** - Google search, requires API key

Each provider reports:
- Health status (healthy/degraded/failing)
- API key configuration
- Success rate
- Latency
- Last error

### Quality Scorer

7-factor quality scoring (0-100):

| Factor | Weight | Criteria |
|--------|--------|----------|
| Results | 20% | Number of useful search results |
| Entities | 15% | Named entities extracted |
| Questions | 10% | Common questions found |
| Trends | 15% | Trending topics identified |
| Insights | 15% | Key insights extracted |
| Freshness | 10% | How recent the data is |
| Diversity | 15% | Variety of data types |

Quality threshold: 40 (minimum for "usable" research)

### Research Extractor

Extracts structured data from raw search results:

- **Entities**: People, companies, products
- **Questions**: What, how, why questions
- **Trends**: Trending topics, emerging patterns
- **Insights**: Key discoveries, secrets
- **Keywords**: Frequently mentioned terms
- **Pain Points**: User struggles, problems
- **Misconceptions**: Common myths
- **Statistics**: Numbers, percentages, data
- **Examples**: Use cases, demonstrations

### Caption Generator

AI-powered caption generation with personality presets:

| Personality | Description |
|-------------|-------------|
| Viral Creator | Attention-grabbing, playful |
| Luxury Brand | Premium, sophisticated |
| Startup Founder | Bold, innovative |
| Gen Z | Trendy, meme-savvy |
| Minimalist | Clean, simple |
| Funny | Humor-driven |
| Storyteller | Narrative-driven |
| Educational | Informative |
| Corporate | Professional |
| Influencer | Personal brand |

## UI Layer

### Main Screen

Single-screen UI with:

- Topic input field
- Personality dropdown selector
- Versions slider (1-5)
- Generate button
- Research quality indicator
- Caption cards with share/copy actions

### Research Mode Indicator

Shows current mode in app bar:

- **ONLINE** (green) - Live research active
- **CACHE** (orange) - Using cached data
- **MEMORY** (blue) - Using stored knowledge
- **OFFLINE** (red) - Local intelligence only

### Debug Bottom Sheet

Accessible via icon button:

- Current mode
- Last provider used
- Quality threshold
- Provider health status
- API key configuration
- Success rate per provider
- Error messages

## Data Flow

```
User Input (Topic)
       │
       ▼
┌──────────────────┐
│   MainViewModel  │
└──────────────────┘
       │
       ▼
┌──────────────────┐
│  ResearchEngine  │
└──────────────────┘
       │
       ├─► ProviderManager (network)
       ├─► ResearchCache (memory)
       └─► Local Knowledge (fallback)
       │
       ▼
┌──────────────────┐
│ QualityScorer    │
└──────────────────┘
       │
       ▼
┌──────────────────┐
│ CaptionGenerator │
└──────────────────┘
       │
       ▼
┌──────────────────┐
│   UI State       │
└──────────────────┘
```

## Error Handling

| Error Type | Handling |
|------------|---------|
| Missing API key | Skip provider, try next |
| Auth failure | Mark provider unhealthy |
| Rate limit | Back off, try next |
| Network error | Try next provider |
| Empty response | Try next provider |
| Low quality | Try next provider |
| All fail | OFFLINE mode |
