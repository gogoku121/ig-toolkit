# Changelog

All notable changes to the IG Toolkit project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [2.1.0] - 2026-07-04

### Added
- **Intelligence Engine Modules** - Complete AI-powered content generation system
  - `EntityIntelligenceEngine` - Detects 12+ brands/products (Tesla, OpenAI, ChatGPT, Notion, Canva, iPhone, Nike, Bitcoin, Airbnb, Starbucks)
  - `KnowledgeLayer` - Structured knowledge base for 10 categories with insights, facts, tips
  - `ReasoningEngine` - Internal strategic reasoning with 10 pre-generation questions
  - `HumanWritingEngine` - Eliminates robotic patterns with varied sentence structure, transitions, emoji placement
  - `MemoryManager` - Tracks used elements to ensure uniqueness and variety
  - `CritiqueEngine` - Self-critique with up to 3 rewrite iterations
  - `IntelligencePipeline` - Orchestrates all modules in 10-stage pipeline

### Pipeline Stages (10 total)
1. Entity Detection
2. Topic Classification  
3. Internal Reasoning
4. Knowledge Expansion
5. Strategy Selection
6. Content Generation
7. Humanization
8. Self-Critique & Rewrite
9. Final Scoring
10. Memory Tracking

### Scoring System
- Hook strength (15%)
- Readability (20%)
- Engagement (20%)
- Uniqueness (15%)
- Goal Alignment (15%)
- CTA Quality (10%)

### Content Strategies
- Educational
- Storytelling
- Problem-Solution
- Myth-Bust
- How-To
- Comparison

### Personalities (13 total)
Viral Creator, Luxury Brand, Startup Founder, Gen Z, Minimalist, Funny, Storyteller, Educational, Corporate, Premium Brand, Influencer, Emotional, Luxury Lifestyle

### Goals (8 total)
Educate, Entertain, Inspire, Sell, Build Trust, Generate Comments/Shares/Saves

---

## [2.0.0] - 2026-07-04

### Added
- **ES Module Architecture** - Clean separation of concerns
- **Component Architecture** - Reusable Button, Toast, Modal, FormElements, ContentCard
- **Reactive State Management** - Proxy-based Store
- **Safe DOM Operations** - No innerHTML, escapeHtml for XSS prevention
- **Accessibility** - ARIA labels, keyboard navigation, focus traps
- **Loading/Error States** - Skeleton loaders, error handling
- **localStorage Persistence** - Preferences, history, favorites
- **CSS Custom Properties** - Dark/light theming
- **Keyboard Shortcuts** - 1-6 for tools, G to generate, T for theme
- **Topic Classification** - 20 categories with keyword detection

### Personalities (13)
Viral Creator, Luxury Brand, Startup Founder, Gen Z, Minimalist, Funny, Storyteller, Educational, Corporate, Premium Brand, Influencer, Emotional, Luxury Lifestyle

### Goals (8)
Educate, Entertain, Inspire, Sell, Build Trust, Generate Comments, Generate Shares, Generate Saves

### Story Patterns (10)
Auto-select, Storytelling, Before/After, Problem/Solution, Listicle, Case Study, Comparison, Q&A, Behind the Scenes, Myth/Truth

---

## [1.0.0] - 2026-07-04

### Added
- Caption Generator with tone and length options
- Hashtag Generator
- Reels Ideas Generator
- Product Description Generator
- Story Posts Generator
- Reply Suggestions Generator
- Android APK wrapper with Capacitor
- Basic dark/light theme

---

## [Unreleased]

### Security
- Removed a hardcoded SerpAPI key from `MainViewModel.kt` and a plaintext MinIO admin password from `AGENTS.md` — both had been committed to this public repo since 2026-07-04. Added a `backend/` FastAPI proxy service that holds both secrets server-side; the Android app now calls `/research` and `/apk/latest` on that backend instead of calling SerpAPI/MinIO directly. See `DECISIONS.md`.
- **Action still required by repo owner:** rotate the exposed SerpAPI key and MinIO admin password — removing them from the current code does not undo the ~2-week public exposure.

### Planned
- LLM API integration for enhanced generation
- A/B testing framework
- User content templates library
- Analytics dashboard
- Export history to JSON/CSV
- Batch generation
- Content scheduling
- Deploy the new `backend/` proxy service somewhere reachable (hosting location not yet decided)
