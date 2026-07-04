# AI Instagram Business Toolkit

Generate Instagram content including captions, hashtags, reels ideas, product descriptions, story posts, and reply suggestions.

## Features

- **Caption Generator** - Professional, casual, funny, inspirational, promotional tones
- **Hashtag Generator** - Popular, niche, and keyword-based hashtags
- **Reels Ideas Generator** - Hooks, scripts, duration, and trending audio suggestions
- **Product Description Generator** - Compelling product copy with multiple variations
- **Story Posts Generator** - Engaging story concepts with slide-by-slide breakdowns
- **Reply Suggestions Generator** - Smart reply templates for different comment types

## Architecture

Built with a modular ES6+ architecture:

```
src/
├── core/           # Core utilities
│   ├── config.js    # Application configuration
│   ├── state.js     # Reactive state management
│   ├── storage.js   # localStorage abstraction
│   ├── eventBus.js  # Event communication
│   ├── dom.js       # DOM utilities
│   └── contentData.js # Content phrase banks
├── components/      # Reusable UI components
│   ├── Button.js
│   ├── Toast.js
│   ├── Modal.js
│   ├── FormElements.js
│   └── ContentCard.js
├── generators/     # Content generators
│   ├── CaptionGenerator.js
│   ├── HashtagGenerator.js
│   ├── ReelsGenerator.js
│   ├── ProductGenerator.js
│   ├── StoryGenerator.js
│   └── ReplyGenerator.js
├── styles/
│   └── main.css    # CSS with custom properties
└── index.js        # Main entry point
```

## Key Features

- **ES Modules** - Clean module imports, no bundler required
- **Reactive State** - Proxy-based state management
- **Component Architecture** - Reusable Button, Toast, Modal, Card components
- **Accessibility** - ARIA labels, keyboard navigation, focus management
- **Safe DOM** - No innerHTML, escapeHtml for XSS prevention
- **Loading States** - Skeleton loaders and error handling
- **Export/History** - localStorage-based history and favorites
- **Theme Toggle** - Dark/light mode with persistence
- **Keyboard Shortcuts** - Quick navigation (1-6 for tools, G to generate)

## Usage

```bash
npm install
npm run dev
```

Then open http://localhost:8080

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| 1-6 | Switch tools |
| G | Generate |
| T | Toggle theme |

## Future AI Integration

The architecture is prepared for AI API integration. Each generator returns a standard format:

```javascript
{
  id: string,
  type: string,
  title: string,
  content: string,
  metadata: object
}
```

## Tech Stack

- Vanilla HTML5/CSS3/JavaScript ES6+
- CSS Custom Properties for theming
- localStorage for persistence
- No external dependencies (production)

## License

MIT
