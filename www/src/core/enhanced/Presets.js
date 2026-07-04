// Personality Presets, Goals, and Audiences

export const PERSONALITY_PRESETS = {
  'viral creator': {
    name: 'Viral Creator',
    description: 'Hook-heavy, trend-aware, engagement optimized',
    traits: {
      hookStyle: 'provocative',
      emojiUsage: 'heavy',
      sentenceLength: 'varied',
      ctaStyle: 'engagement',
      formality: 2
    },
    vocabulary: ['literally', 'so', 'bc', 'ngl', 'fr', 'bestie', 'slay', 'no cap', 'bussin', 'ate that'],
    sentenceStarters: ['POV:', 'Wait for it...', 'Nobody is talking about', 'Breaking:', 'I tried'],
    emojiPlacement: 'throughout'
  },
  'luxury brand': {
    name: 'Luxury Brand',
    description: 'Refined, elegant, exclusive feel',
    traits: {
      hookStyle: 'mysterious',
      emojiUsage: 'minimal',
      sentenceLength: 'measured',
      ctaStyle: 'invitation',
      formality: 5
    },
    vocabulary: ['excellence', 'artistry', 'refined', 'distinction', 'crafted', 'curated', 'bespoke', 'premium'],
    sentenceStarters: ['Introducing', 'Where', 'The pursuit of', 'Discover', 'Experience'],
    emojiPlacement: 'rare'
  },
  'startup founder': {
    name: 'Startup Founder',
    description: 'Bold, direct, insight-driven',
    traits: {
      hookStyle: 'controversial',
      emojiUsage: 'medium',
      sentenceLength: 'short',
      ctaStyle: 'direct',
      formality: 3
    },
    vocabulary: ['hot take', 'unpopular opinion', 'framework', 'scale', 'pivot', 'disrupt', '10x', 'leverage'],
    sentenceStarters: ['We spent', 'Why', 'Hot take:', 'The truth nobody tells you', 'Most people get'],
    emojiPlacement: 'end'
  },
  'gen z': {
    name: 'Gen Z',
    description: 'Casual, authentic, relatable',
    traits: {
      hookStyle: 'relatable',
      emojiUsage: 'moderate',
      sentenceLength: 'short',
      ctaStyle: 'casual',
      formality: 1
    },
    vocabulary: ['lowkey', 'highkey', 'bestie', 'main character', 'vibe check', 'bussin', 'no yapping', 'slay'],
    sentenceStarters: ['no bc', 'the way', 'not me', 'main character energy', 'ngl'],
    emojiPlacement: 'heavy'
  },
  'minimalist': {
    name: 'Minimalist',
    description: 'Clean, focused, essential-only',
    traits: {
      hookStyle: 'simple',
      emojiUsage: 'rare',
      sentenceLength: 'varied',
      ctaStyle: 'subtle',
      formality: 3
    },
    vocabulary: ['essential', 'fundamental', 'matters', 'simple', 'less', 'focus', 'purpose'],
    sentenceStarters: ['On', 'What matters', 'The', 'Less about', 'Focus on'],
    emojiPlacement: 'rare'
  },
  'funny': {
    name: 'Funny',
    description: 'Humor-driven, self-deprecating, playful',
    traits: {
      hookStyle: 'funny',
      emojiUsage: 'moderate',
      sentenceLength: 'varied',
      ctaStyle: 'funny',
      formality: 1
    },
    vocabulary: ['broke me', 'plot twist', 'not me', 'realized', 'honestly', 'story of my life', 'same vibes'],
    sentenceStarters: ['Plot twist:', 'POV:', 'When', 'I asked', 'Checklist'],
    emojiPlacement: 'scattered'
  },
  'storyteller': {
    name: 'Storyteller',
    description: 'Narrative-driven, emotional, memorable',
    traits: {
      hookStyle: 'narrative',
      emojiUsage: 'minimal',
      sentenceLength: 'long',
      ctaStyle: 'emotional',
      formality: 3
    },
    vocabulary: ['chapter', 'journey', 'moment', 'remember', 'still gives me chills', 'never forget', 'changed everything'],
    sentenceStarters: ['Three years ago', 'The story that', 'What nobody tells you', 'A moment that', 'The chapter'],
    emojiPlacement: 'rare'
  },
  'educational': {
    name: 'Educational',
    description: 'Informative, structured, value-packed',
    traits: {
      hookStyle: 'informative',
      emojiUsage: 'rare',
      sentenceLength: 'medium',
      ctaStyle: 'informative',
      formality: 4
    },
    vocabulary: ['fundamentals', 'key', 'understanding', 'concept', 'strategy', 'approach', 'method', 'technique'],
    sentenceStarters: ['101:', 'The complete guide', 'What you need to know', 'Everything wrong', 'The blueprint'],
    emojiPlacement: 'rare'
  },
  'corporate': {
    name: 'Corporate',
    description: 'Professional, formal, authority',
    traits: {
      hookStyle: 'professional',
      emojiUsage: 'none',
      sentenceLength: 'long',
      ctaStyle: 'professional',
      formality: 5
    },
    vocabulary: ['strategic', 'leveraging', 'optimization', 'considerations', 'perspective', 'insights', 'driving value'],
    sentenceStarters: ['Strategic insights', 'Leveraging', 'Key considerations', 'Industry perspective', 'Driving value'],
    emojiPlacement: 'none'
  },
  'premium brand': {
    name: 'Premium Brand',
    description: 'Upscale, quality-focused, aspirational',
    traits: {
      hookStyle: 'aspirational',
      emojiUsage: 'minimal',
      sentenceLength: 'medium',
      ctaStyle: 'premium',
      formality: 4
    },
    vocabulary: ['standard', 'excellence', 'distinction', 'experience', 'refined', 'exceptional', 'superior'],
    sentenceStarters: ['The standard', 'Experience the difference', 'Redefining', 'For those who accept', 'The distinction'],
    emojiPlacement: 'end'
  },
  'influencer': {
    name: 'Influencer',
    description: 'Friendly, warm, community-focused',
    traits: {
      hookStyle: 'friendly',
      emojiUsage: 'heavy',
      sentenceLength: 'short',
      ctaStyle: 'community',
      formality: 1
    },
    vocabulary: ['besties', 'hi friends', 'talking about', 'transparency', 'grwm', 'full transparency', 'appreciate you'],
    sentenceStarters: ['Hi besties!', 'Grwm for', 'Things I wish', 'Full transparency', 'The content you asked for'],
    emojiPlacement: 'heavy'
  },
  'emotional': {
    name: 'Emotional',
    description: 'Deep, vulnerable, heartfelt',
    traits: {
      hookStyle: 'vulnerable',
      emojiUsage: 'minimal',
      sentenceLength: 'long',
      ctaStyle: 'connection',
      formality: 3
    },
    vocabulary: ['broke me open', 'changed me', 'never forget', 'deeply', 'truth that', 'taught me', 'journey is'],
    sentenceStarters: ['Why', 'The truth that', 'What', 'This journey', 'The moment'],
    emojiPlacement: 'rare'
  },
  'luxury lifestyle': {
    name: 'Luxury Lifestyle',
    description: 'Aspirational, curated, aesthetic-focused',
    traits: {
      hookStyle: 'aesthetic',
      emojiUsage: 'moderate',
      sentenceLength: 'medium',
      ctaStyle: 'exclusive',
      formality: 4
    },
    vocabulary: ['living beautifully', 'intentional', 'curated', 'refined', 'philosophy', 'art of', 'everyday moments'],
    sentenceStarters: ['Living beautifully', 'The', 'Curating', 'Refined perspectives', 'The art of'],
    emojiPlacement: 'moderate'
  }
};

export const GOALS = {
  educate: {
    name: 'Educate',
    description: 'Teach something valuable',
    icon: '📚',
    contentFocus: 'value, clarity, structure',
    ctaTypes: ['save', 'share', 'comment for questions']
  },
  entertain: {
    name: 'Entertain',
    description: 'Make people laugh or feel good',
    icon: '😂',
    contentFocus: 'humor, surprise, relatability',
    ctaTypes: ['follow', 'comment', 'share']
  },
  inspire: {
    name: 'Inspire',
    description: 'Motivate and uplift',
    icon: '✨',
    contentFocus: 'emotion, story, aspiration',
    ctaTypes: ['follow', 'save', 'share']
  },
  sell: {
    name: 'Sell',
    description: 'Drive purchases or conversions',
    icon: '🛒',
    contentFocus: 'benefits, urgency, trust',
    ctaTypes: ['link in bio', 'shop now', 'dm']
  },
  'build trust': {
    name: 'Build Trust',
    description: 'Establish authority and credibility',
    icon: '🤝',
    contentFocus: 'transparency, expertise, social proof',
    ctaTypes: ['follow', 'learn more', 'check other content']
  },
  'generate comments': {
    name: 'Generate Comments',
    description: 'Start conversations',
    icon: '💬',
    contentFocus: 'questions, opinions, engagement',
    ctaTypes: ['comment', 'tell me', 'what do you think']
  },
  'generate shares': {
    name: 'Generate Shares',
    description: 'Encourage resharing',
    icon: '🔄',
    contentFocus: 'taggable, relatable, save-worthy',
    ctaTypes: ['tag someone', 'share', 'send to friend']
  },
  'generate saves': {
    name: 'Generate Saves',
    description: 'Encourage bookmarking',
    icon: '🔖',
    contentFocus: 'useful, referenceable, detailed',
    ctaTypes: ['save this', 'bookmark', 'pin']
  }
};

export const AUDIENCES = {
  beginners: {
    name: 'Beginners',
    description: 'Just starting out',
    modifiers: {
      complexity: 'simple',
      jargon: 'avoid',
      explanation: 'detailed',
      pace: 'slow'
    }
  },
  professionals: {
    name: 'Professionals',
    description: 'Industry experienced',
    modifiers: {
      complexity: 'advanced',
      jargon: 'use',
      explanation: 'concise',
      pace: 'fast'
    }
  },
  students: {
    name: 'Students',
    description: 'Learning phase',
    modifiers: {
      complexity: 'medium',
      jargon: 'some',
      explanation: 'practical examples',
      pace: 'medium'
    }
  },
  creators: {
    name: 'Creators',
    description: 'Content creators',
    modifiers: {
      complexity: 'medium',
      jargon: 'trendy',
      explanation: 'actionable tips',
      pace: 'fast'
    }
  },
  entrepreneurs: {
    name: 'Entrepreneurs',
    description: 'Business builders',
    modifiers: {
      complexity: 'advanced',
      jargon: 'business',
      explanation: 'results-focused',
      pace: 'medium'
    }
  },
  parents: {
    name: 'Parents',
    description: 'Busy parents',
    modifiers: {
      complexity: 'simple',
      jargon: 'avoid',
      explanation: 'quick wins',
      pace: 'fast'
    }
  },
  'fitness enthusiasts': {
    name: 'Fitness Enthusiasts',
    description: 'Health & fitness focused',
    modifiers: {
      complexity: 'mixed',
      jargon: 'some',
      explanation: 'technique-focused',
      pace: 'medium'
    }
  },
  general: {
    name: 'General',
    description: 'Broad audience',
    modifiers: {
      complexity: 'medium',
      jargon: 'minimal',
      explanation: 'balanced',
      pace: 'medium'
    }
  }
};

export default { PERSONALITY_PRESETS, GOALS, AUDIENCES };
