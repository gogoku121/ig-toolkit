# AI Instagram Business Toolkit - Specification

## 1. Project Overview

**Project Name:** AI Instagram Business Toolkit  
**Type:** Single-page web application (vanilla HTML/CSS/JS with AI-powered content generation)  
**Core Functionality:** Generate Instagram content including captions, hashtags, reels ideas, product descriptions, story posts, and reply suggestions using AI templates and randomization  
**Target Users:** Instagram creators, small business owners, social media managers

---

## 2. Visual & Rendering Specification

### Scene Setup
- **Layout:** Single-page application with sidebar navigation and main content area
- **Header:** Fixed top bar with app branding and theme toggle
- **Navigation:** Left sidebar with icon-based tool selection
- **Content Area:** Right-side panel showing active tool interface

### Color Palette & Theme
**Dark Mode (Default):**
- Background: `#0a0a0f` (deep charcoal)
- Surface: `#1a1a24` (elevated cards)
- Surface Hover: `#252532`
- Primary Gradient: `linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)` (Instagram-inspired)
- Accent: `#dc2743` (Instagram red-pink)
- Text Primary: `#ffffff`
- Text Secondary: `#a0a0b0`
- Border: `#2a2a3a`

**Light Mode:**
- Background: `#fafafa`
- Surface: `#ffffff`
- Text Primary: `#262626`
- Text Secondary: `#737373`

### Typography
- **Headings:** "Clash Display" (Google Fonts) - bold, modern
- **Body:** "Satoshi" (Google Fonts alternative via CDN) or "Inter"
- **Fallbacks:** system-ui, sans-serif

### Visual Effects
- Card shadows with colored glow on hover
- Gradient text for branding elements
- Subtle backdrop blur on modals
- Smooth transitions (0.3s ease)
- Copy-to-clipboard animation feedback
- Loading shimmer effect during generation

---

## 3. Content Generation Tools

### Tool 1: Caption Generator
**Input Fields:**
- Niche/Topic (text input)
- Tone selector (dropdown: Professional, Casual, Funny, Inspirational, Promotional)
- Caption length (slider: Short/Medium/Long)

**Output:** 
- Generated caption with emoji
- Call-to-action included
- Copy button

### Tool 2: Hashtag Generator
**Input Fields:**
- Post topic/keywords (text input, comma-separated)
- Hashtag count slider (5-30)

**Output:**
- Mix of popular and niche hashtags
- Clickable hashtags (selectable)
- Copy all button
- Hashtag groups (popular, niche, branded)

### Tool 3: Reels Ideas Generator
**Input Fields:**
- Content category (dropdown)
- Target audience (text input)
- Trendy/P evergreen toggle

**Output:**
- 5 Reels ideas with titles
- Hook/script outline for each
- Estimated duration
- Trending audio suggestions

### Tool 4: Product Description Generator
**Input Fields:**
- Product name (text input)
- Key features (textarea)
- Price range (optional)
- Target audience (text input)

**Output:**
- Compelling product description
- Benefit-focused copy
- 2-3 variations
- Highlight bullet points

### Tool 5: Story Posts Generator
**Input Fields:**
- Story type (dropdown: Announcement, Poll, Question, Behind-scenes, User-generated)
- Topic/theme (text input)

**Output:**
- 5 story slide concepts
- Text overlays suggestions
- Sticker/element ideas
- Posting time recommendations

### Tool 6: Reply Suggestions Generator
**Input Fields:**
- Comment type (dropdown: Positive, Question, Negative, Sarcastic, Follower)
- Context/post topic (text input)

**Output:**
- 8-10 reply templates
- Emojis included
- Conversation starters
- Engagement-boosting phrasing

---

## 4. Interaction Specification

### User Controls
- **Sidebar Navigation:** Click icons to switch between tools
- **Generate Button:** Primary CTA to create content
- **Copy Buttons:** Copy generated content to clipboard
- **Regenerate:** Generate new content with same inputs
- **Theme Toggle:** Switch between dark/light mode

### Animations & Feedback
- Button hover: Scale up 1.02x with shadow
- Card hover: Subtle lift with gradient border glow
- Copy success: Checkmark animation + toast notification
- Loading state: Skeleton shimmer while generating
- Tool switch: Fade transition between content

### Empty States
- Initial state shows tool description with example
- "Generate" CTA prominent

---

## 5. Technical Implementation

### Structure
```
/workspace/project/
├── index.html
├── styles.css
├── app.js
└── SPEC.md
```

### Content Generation Logic
Since this is a client-side app without actual AI API:
- Use template-based generation with randomization
- Phrase banks for different tones/contexts
- Markov-chain-like word selection for variety
- Pre-written high-quality content patterns

### Key Features
- LocalStorage for saving favorite generations
- Export options (copy to clipboard)
- Responsive design (mobile-friendly sidebar collapses)
- Keyboard shortcuts (1-6 for tools, g for generate)

---

## 6. Acceptance Criteria

1. ✓ All 6 tools accessible via sidebar navigation
2. ✓ Each tool generates relevant, usable content
3. ✓ Copy to clipboard works with visual feedback
4. ✓ Theme toggle persists across sessions
5. ✓ Smooth animations throughout
6. ✓ Mobile responsive
7. ✓ No external API dependencies (works offline)
8. ✓ Modern, Instagram-inspired aesthetic
9. ✓ Loading states shown during generation
10. ✓ Content is varied (not repetitive)
