# AI Instagram Business Toolkit

An intelligent content generation platform for Instagram creators, marketers, and businesses. Generate context-aware captions, hashtags, reels ideas, and more using AI-powered content engines.

## Features

- **Caption Generator** - Context-aware, multi-version captions with personality and goal targeting
- **Hashtag Generator** - Topic-based hashtag collections
- **Reels Ideas Generator** - Hooks, scripts, and trending suggestions
- **Product Description Generator** - Compelling product copy
- **Story Posts Generator** - Engaging story concepts
- **Reply Suggestions Generator** - Smart reply templates

## Intelligence Engine

The toolkit includes a sophisticated **Intelligence Engine** that produces human-like, context-aware content:

### Architecture

```
src/core/intelligence/
├── EntityIntelligenceEngine.js  # Brand/product detection (Tesla, OpenAI, etc.)
├── KnowledgeLayer.js           # Structured knowledge for 10 categories
├── ReasoningEngine.js         # Strategic pre-generation reasoning
├── HumanWritingEngine.js      # Natural writing patterns
├── MemoryManager.js           # Uniqueness tracking
├── CritiqueEngine.js          # Self-critique with rewrites
└── IntelligencePipeline.js     # 10-stage orchestration
```

### 10-Stage Pipeline

1. **Entity Detection** - Identifies brands/products (Tesla, OpenAI, ChatGPT, etc.)
2. **Topic Classification** - 20+ categories with auto-detection
3. **Internal Reasoning** - Strategic questions answered before generation
4. **Knowledge Expansion** - Facts, insights, tips from knowledge layer
5. **Strategy Selection** - Educational, Storytelling, Problem-Solution, etc.
6. **Content Generation** - Entity-aware, knowledge-grounded output
7. **Humanization** - Varies sentence structure, removes robotic patterns
8. **Self-Critique** - Evaluates 6 criteria, rewrites weak sections (up to 3 iterations)
9. **Quality Scoring** - Hook, readability, engagement, uniqueness, goal alignment, CTA
10. **Memory Tracking** - Ensures uniqueness across generations

### 13 Personality Presets

Viral Creator, Luxury Brand, Startup Founder, Gen Z, Minimalist, Funny, Storyteller, Educational, Corporate, Premium Brand, Influencer, Emotional, Luxury Lifestyle

### 8 Goals

Educate, Entertain, Inspire, Sell, Build Trust, Generate Comments, Generate Shares, Generate Saves

### Scoring System

Each generated content is scored A+ to F across:
- Hook Strength (15%)
- Readability (20%)
- Engagement (20%)
- Uniqueness (15%)
- Goal Alignment (15%)
- CTA Quality (10%)

## Usage

```bash
npm install
npm run dev
```

Open http://localhost:8080

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| 1-6 | Switch tools |
| G | Generate |
| T | Toggle theme |

## Tech Stack

- Vanilla HTML5/CSS3/JavaScript ES6+
- Capacitor for Android APK
- CSS Custom Properties for theming
- localStorage for persistence
- No external dependencies (production)

## API Readiness

The Intelligence Pipeline returns structured output ready for LLM API integration:

```javascript
{
  topic,
  personality,
  goal,
  category,
  primaryEntity,
  versions: [
    {
      content: "Humanized caption text...",
      scores: { hook, readability, engagement, uniqueness, goalAlignment, cta, total },
      grade: "A",
      rank: 1,
      strategy: "storytelling"
    }
  ],
  bestVersion,
  reasoning: { whyCare, problemSolved, misconception, surprisingElement, ... }
}
```

## License

MIT
