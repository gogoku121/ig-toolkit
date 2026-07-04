/**
 * Entity Intelligence Engine
 * Detects specific brands, products, and organizations and provides rich metadata
 * for context-aware content generation
 */

export const ENTITY_DATABASE = {
  // Technology Companies
  tesla: {
    name: 'Tesla',
    type: 'company',
    industry: 'automotive/energy',
    audience: ['tech enthusiasts', 'investors', 'environmentalists', 'luxury buyers'],
    painPoints: [
      'charging anxiety',
      'high initial cost',
      'reliance on Supercharger network',
      ' Autopilot safety concerns',
      'insurance costs'
    ],
    benefits: [
      'electric efficiency',
      'low maintenance',
      'acceleration',
      'tech features',
      'environmental impact',
      'energy savings'
    ],
    misconceptions: [
      'range anxiety is overblown',
      'not just a luxury car',
      'quality issues are exaggerated',
      'not just for celebrities'
    ],
    competitors: ['Rivian', 'Lucid', 'Porsche', 'BMW i-series', 'Mercedes EQ'],
    trends: [
      'Full Self-Driving progress',
      'energy storage expansion',
      'affordable model development',
      'charging network growth'
    ],
    vocabulary: [
      'electric',
      'sustainable',
      'innovation',
      ' Autopilot',
      'Supercharger',
      'FSD',
      'EV',
      'battery',
      'range',
      'acceleration',
      'software',
      'updates',
      'future of driving'
    ],
    emotionalTriggers: [
      'environmental responsibility',
      'cutting-edge technology',
      'performance excitement',
      'independence from gas'
    ],
    useCases: [
      'daily commute',
      'road trips',
      'sustainability lifestyle',
      'tech showcase',
      'performance driving'
    ],
    faqs: [
      'How long does charging take?',
      'What is the real range?',
      'Is FSD worth it?',
      'How does insurance compare?',
      'What about winter performance?'
    ],
    hooks: {
      viral: [
        'The thing nobody tells you about driving Tesla',
        'POV: Your first Tesla road trip',
        'I swapped my BMW for a Tesla and...',
        'Tesla FSD saved me from',
        'Day 30 with my Tesla - the good and bad'
      ],
      educational: [
        'How Tesla charging actually works',
        'Understanding Tesla FSD levels',
        'Tesla vs gas: Real cost comparison',
        'What Tesla\'s battery degradation looks like',
        'The truth about Tesla\'s Autopilot'
      ],
      storytelling: [
        'The day I picked up my Tesla',
        'How Tesla changed my daily commute forever',
        'Our family\'s first week with an EV',
        'The road trip that proved range anxiety wrong'
      ]
    }
  },

  openai: {
    name: 'OpenAI',
    type: 'company',
    industry: 'AI/technology',
    audience: ['developers', 'businesses', 'AI enthusiasts', 'researchers', 'content creators'],
    painPoints: [
      'API costs',
      'prompt crafting difficulty',
      'output consistency',
      'integration complexity',
      'understanding limitations'
    ],
    benefits: [
      'natural language understanding',
      'content generation',
      'code assistance',
      'automation',
      'scalability',
      '24/7 availability'
    ],
    misconceptions: [
      'it can do anything',
      'no human oversight needed',
      'always accurate',
      'replaces human creativity entirely',
      'too complicated to use'
    ],
    competitors: ['Anthropic', 'Google Gemini', 'Meta AI', 'Cohere', 'Mistral'],
    trends: [
      'GPT-5 development',
      'multimodal capabilities',
      'enterprise solutions',
      'AI agents',
      'custom GPTs'
    ],
    vocabulary: [
      'LLM',
      'GPT',
      'ChatGPT',
      'API',
      'prompt engineering',
      'tokens',
      'natural language',
      'AI assistant',
      'automation',
      'workflow',
      'intelligence',
      'machine learning',
      'deep learning'
    ],
    emotionalTriggers: [
      'curiosity about AI future',
      'fear of being left behind',
      'excitement about possibilities',
      'concern about AI ethics'
    ],
    useCases: [
      'content creation',
      'code debugging',
      'customer service',
      'data analysis',
      'learning assistant',
      'writing aid'
    ],
    faqs: [
      'How do I write better prompts?',
      'What can GPT-4 actually do?',
      'How much does API cost?',
      'Is my data being used for training?',
      'Can it replace my job?'
    ],
    hooks: {
      viral: [
        'I asked ChatGPT to do my job for a week...',
        'The ChatGPT prompt that saved me 10 hours',
        'Nobody is talking about this OpenAI feature',
        'ChatGPT broke my brain with',
        'I built something with GPT in 24 hours'
      ],
      educational: [
        'How to structure prompts for better results',
        'Understanding AI limitations (it\'s not magic)',
        'The future of work with AI assistants',
        'How LLMs actually process your prompts',
        'A beginner\'s guide to OpenAI API'
      ],
      storytelling: [
        'The moment AI actually clicked for me',
        'How I used GPT to launch my side project',
        'My first experience with ChatGPT',
        'What happens when AI gets it wrong'
      ]
    }
  },

  chatgpt: {
    name: 'ChatGPT',
    type: 'product',
    industry: 'AI/technology',
    audience: ['everyone', 'professionals', 'students', 'creators', 'businesses'],
    painPoints: [
      'knowing what to ask',
      'filtering good from bad outputs',
      'privacy concerns',
      'information accuracy',
      'getting stuck in loops'
    ],
    benefits: [
      'instant answers',
      'creative assistance',
      'learning explainer',
      'productivity boost',
      'available 24/7',
      'multilingual support'
    ],
    misconceptions: [
      'it knows everything',
      'it\'s always right',
      'it can replace google',
      'it\'s sentient',
      'one prompt does everything'
    ],
    competitors: ['Claude', 'Gemini', 'Perplexity', 'Copilot', 'Meta AI'],
    trends: [
      'voice conversations',
      'image generation',
      'memory features',
      'custom instructions',
      ' GPT store'
    ],
    vocabulary: [
      'conversation',
      'prompt',
      'response',
      'context',
      'conversation',
      'assistant',
      'AI',
      'intelligent',
      'helpful',
      'creative'
    ],
    emotionalTriggers: [
      'curiosity satisfaction',
      'awe at capabilities',
      'frustration when it fails',
      'hope for productivity'
    ],
    useCases: [
      'brainstorming',
      'writing drafts',
      'learning topics',
      'problem solving',
      'coding help',
      'travel planning'
    ],
    faqs: [
      'How do I get better responses?',
      'Can I use it for work?',
      'What\'s the difference between free and paid?',
      'Is my data private?',
      'Can it think for itself?'
    ],
    hooks: {
      viral: [
        'ChatGPT helped me make \$10K in a month',
        'The question I always ask ChatGPT',
        'POV: You just discovered the perfect prompt',
        'I tested ChatGPT against my creativity',
        'ChatGPT\'s weirdest response yet'
      ],
      educational: [
        'How to have better conversations with AI',
        'The art of iterative prompting',
        'What AI can\'t do (yet)',
        'Why context matters in AI conversations',
        'The future of human-AI collaboration'
      ],
      storytelling: [
        'The first time AI understood me',
        'How ChatGPT became my daily tool',
        'The prompt that changed everything',
        'My week with AI as my coworker'
      ]
    }
  },

  notion: {
    name: 'Notion',
    type: 'product',
    industry: 'productivity software',
    audience: ['students', 'professionals', 'creators', 'teams', 'small businesses'],
    painPoints: [
      'steep learning curve',
      'overwhelming customization',
      'performance with large databases',
      'collaboration sync issues',
      'template paralysis'
    ],
    benefits: [
      'all-in-one workspace',
      'flexible databases',
      'beautiful templates',
      'cross-platform sync',
      'API integrations',
      'customizable'
    ],
    misconceptions: [
      'it\'s just notes',
      'too complicated to start',
      'only for tech people',
      'expensive for what it does',
      'replaces all other tools'
    ],
    competitors: ['Obsidian', 'Craft', 'Airtable', 'ClickUp', 'Asana', 'Coda'],
    trends: [
      'AI features (Notion AI)',
      'crossworkspace capabilities',
      'team collaboration features',
      'template marketplace',
      'API automation'
    ],
    vocabulary: [
      'workspace',
      'database',
      'page',
      'block',
      'template',
      'sidebar',
      'view',
      'filter',
      'relation',
      'formula',
      'synced block',
      'toggle',
      'embed'
    ],
    emotionalTriggers: [
      'organization satisfaction',
      'creative control',
      'productivity pride',
      'overwhelm relief'
    ],
    useCases: [
      'note taking',
      'project management',
      'wiki/knowledge base',
      'task tracking',
      'content calendar',
      'personal CRM',
      'habit tracking'
    ],
    faqs: [
      'How do I actually use databases?',
      'What\'s the best starter template?',
      'How much does it cost?',
      'Can it replace my project management tool?',
      'How do I stay organized without falling down rabbit holes?'
    ],
    hooks: {
      viral: [
        'My Notion setup after 2 years of obsession',
        'The Notion template that organizes my entire life',
        'POV: You finally understand Notion databases',
        'Notion changed how I think about productivity',
        'I built a second brain in Notion'
      ],
      educational: [
        'Notion basics: From zero to productive',
        'How databases actually work',
        'Building your first second brain',
        'Notion formulas explained simply',
        'The workflow behind a viral Notion template'
      ],
      storytelling: [
        'How I went from chaotic to organized with Notion',
        'The moment Notion finally clicked for me',
        'My workspace evolution over 3 years',
        'Why I stopped using 5 apps for just Notion'
      ]
    }
  },

  canva: {
    name: 'Canva',
    type: 'product',
    industry: 'design software',
    audience: ['small business owners', 'social media managers', 'content creators', 'non-designers'],
    painPoints: [
      'too many options',
      'subscription costs',
      'limited advanced features',
      'brand kit management',
      'export quality'
    ],
    benefits: [
      'easy to use',
      'pre-made templates',
      'free tier valuable',
      'quick social graphics',
      'brand consistency',
      'team collaboration'
    ],
    misconceptions: [
      'only for simple designs',
      'professionals can\'t use it',
      'replaces designers entirely',
      'free is enough',
      'all designs look the same'
    ],
    competitors: ['Adobe Express', 'Figma', 'Piktochart', 'VistaCreate', 'Crello'],
    trends: [
      'AI image generation',
      'Magic Design',
      'video editing features',
      'brand management tools',
      'presentation capabilities'
    ],
    vocabulary: [
      'template',
      'brand kit',
      'element',
      'resize',
      'layers',
      'font pairing',
      'color palette',
      'grid',
      'alignment',
      'export',
      'download',
      'share'
    ],
    emotionalTriggers: [
      'creative empowerment',
      'professional appearance',
      'time savings',
      'design confidence'
    ],
    useCases: [
      'social media graphics',
      'presentations',
      'business cards',
      'logos',
      'infographics',
      'YouTube thumbnails',
      'Instagram stories'
    ],
    faqs: [
      'Free vs Pro: Is it worth it?',
      'How do I maintain brand consistency?',
      'Can I use Canva for commercial work?',
      'What\'s the best template for social media?',
      'How do I create a brand kit?'
    ],
    hooks: {
      viral: [
        'I designed my entire brand with Canva (here\'s how)',
        'The Canva trick nobody knows about',
        'POV: You discover Magic Design in Canva',
        'Canva Pro actually changed my business',
        'I made a professional logo in Canva for free'
      ],
      educational: [
        'Canva beginner to pro in one post',
        'How to build a brand kit that works',
        'The hidden features that save hours',
        'Making money with Canva designs',
        'Canva vs Adobe: Honest comparison'
      ],
      storytelling: [
        'How I started designing without any skills',
        'My design journey from Canva to...',
        'The first time someone asked if I hired a designer',
        'Why I stopped paying for Adobe'
      ]
    }
  },

  iphone: {
    name: 'iPhone',
    type: 'product',
    industry: 'consumer electronics',
    audience: ['tech enthusiasts', 'professionals', 'photographers', 'general consumers', 'Apple ecosystem users'],
    painPoints: [
      'high cost',
      'closed ecosystem',
      'battery life',
      'storage limitations',
      'no USB-C (until recently)',
      'repairability'
    ],
    benefits: [
      'camera quality',
      'software updates',
      'ecosystem integration',
      'security',
      'resale value',
      'simplicity'
    ],
    misconceptions: [
      'always the best camera',
      'iMessage is the only messaging that matters',
      'more expensive = always better',
      'Android users can\'t join FaceTime',
      'Apple just copies features'
    ],
    competitors: ['Samsung Galaxy', 'Google Pixel', 'OnePlus', 'Nothing Phone', 'Sony Xperia'],
    trends: [
      'Computational photography',
      'AI features',
      'satellite connectivity',
      'action button',
      'USBC adoption',
      'Dynamic Island'
    ],
    vocabulary: [
      'ecosystem',
      'AirDrop',
      'iMessage',
      'FaceTime',
      'App Store',
      'camera',
      'computational photography',
      'portrait mode',
      'ProRAW',
      'cinematic mode',
      'battery',
      'Face ID',
      'dynamic island'
    ],
    emotionalTriggers: [
      'Apple loyalty',
      'status symbol',
      'creative tool',
      'privacy concern',
      'seamless experience desire'
    ],
    useCases: [
      'photography',
      ' videography',
      'social media content',
      'productivity',
      'communication',
      'entertainment'
    ],
    faqs: [
      'Which iPhone should I buy in 2024?',
      'Is the Pro worth the extra cost?',
      'How to maximize battery life?',
      'iPhone vs Android for photography?',
      'When is the best time to upgrade?'
    ],
    hooks: {
      viral: [
        'I switched from Android to iPhone and...',
        'The iPhone feature I use every single day',
        'POV: Your iPhone photo gets featured',
        'iPhone 15 Pro changed how I create content',
        'The hidden iPhone setting nobody talks about'
      ],
      educational: [
        'Camera settings most people never touch',
        'How to actually use ProRAW',
        'iPhone vs Pixel for everyday photography',
        'The truth about iPhone battery health',
        'Maximizing your iPhone\'s lifespan'
      ],
      storytelling: [
        'How iPhone photography changed my career',
        'The moment I became an Apple convert',
        'My iPhone replaced my mirrorless camera',
        'Why I finally switched (after 5 years on Android)'
      ]
    }
  },

  nike: {
    name: 'Nike',
    type: 'brand',
    industry: 'athletic apparel',
    audience: ['athletes', 'fitness enthusiasts', 'sneakerheads', 'casual wearers', 'sports fans'],
    painPoints: [
      'higher price point',
      'fake products on resale',
      'sizing inconsistencies',
      'limited store locations',
      'supply chain issues'
    ],
    benefits: [
      'quality materials',
      'innovation (Air, Flyknit)',
      'brand prestige',
      'wide size range',
      'carbon fiber plates',
      'durable construction'
    ],
    misconceptions: [
      'you\'re paying for the name',
      'expensive = better for everyone',
      'only for serious athletes',
      'all Nike is the same quality',
      'sneakers are just for sports'
    ],
    competitors: ['Adidas', 'Under Armour', 'Puma', 'New Balance', 'On Running', 'Hoka'],
    trends: [
      'sustainable materials',
      'NFT/digital sneakers',
      'customization options',
      'collaboration culture',
      'running technology'
    ],
    vocabulary: [
      'Just Do It',
      'Air',
      'Flyknit',
      'React',
      'Pegasus',
      ' Vaporfly',
      'swoosh',
      'dri-fit',
      'performance',
      'sneaker',
      ' trainers',
      ' athletic',
      ' momentum'
    ],
    emotionalTriggers: [
      'athletic achievement',
      'identity expression',
      'performance confidence',
      'belonging to culture',
      'inspiration to move'
    ],
    useCases: [
      'running',
      'training',
      'basketball',
      'casual lifestyle',
      'cross training',
      'recovery'
    ],
    faqs: [
      'Nike vs Adidas: Which is better?',
      'Are expensive running shoes worth it?',
      'How to spot fake Nikes?',
      'What\'s the best Nike for beginners?',
      'Air Max vs React: Which to choose?'
    ],
    hooks: {
      viral: [
        'I wore Nike every single day for 30 days',
        'The Nike shoe that changed my running',
        'POV: You finally get the Nike sneaker you wanted',
        'Nike\'s latest collab is different',
        'Real talk: Is Nike worth the price?'
      ],
      educational: [
        'Breaking down Nike\'s cushioning technology',
        'How to choose the right Nike for your sport',
        'Nike sizing guide: What nobody tells you',
        'The science behind Vaporfly speed',
        'Nike vs Adidas: Honest comparison'
      ],
      storytelling: [
        'The Nike shoes that got me through my first marathon',
        'How Nike became more than just a sneaker to me',
        'My collection story (it got out of hand)',
        'Why I keep buying Nike despite...'
      ]
    }
  },

  bitcoin: {
    name: 'Bitcoin',
    type: 'concept',
    industry: 'finance/cryptocurrency',
    audience: ['investors', 'tech enthusiasts', 'financial skeptics', 'early adopters', ' Libertarians'],
    painPoints: [
      'volatility',
      'complexity',
      'security concerns',
      'regulatory uncertainty',
      'environmental concerns',
      'long-term storage safety'
    ],
    benefits: [
      'decentralization',
      'finite supply',
      'portability',
      'transparency',
      'inflation hedge',
      'financial sovereignty'
    ],
    misconceptions: [
      'only for criminals',
      'too late to invest',
      'too complicated',
      'no intrinsic value',
      'will be replaced by better crypto',
      'just a speculative bubble'
    ],
    competitors: ['Ethereum', 'Solana', 'Cardano', 'Ripple', '央行 Digital Currencies'],
    trends: [
      'institutional adoption',
      'ETF products',
      'Lightning Network',
      'mining sustainability',
      'regulation',
      'BitcoinOrdinals/NFTs'
    ],
    vocabulary: [
      'blockchain',
      'decentralized',
      'HODL',
      'mining',
      'wallet',
      'private key',
      'Satoshi',
      ' halving',
      ' whale',
      ' bull run',
      ' dip',
      ' FOMO',
      ' diamond hands'
    ],
    emotionalTriggers: [
      'fear of missing out',
      'financial freedom',
      'distrust of institutions',
      'excitement of new technology',
      'risk tolerance'
    ],
    useCases: [
      'investment/holding',
      'remittances',
      'store of value',
      'hedge against inflation',
      'online purchases',
      'cross-border payments'
    ],
    faqs: [
      'How do I buy Bitcoin safely?',
      'Should I invest in Bitcoin now?',
      'What\'s a Bitcoin wallet?',
      'Is Bitcoin legal?',
      'What affects Bitcoin\'s price?'
    ],
    hooks: {
      viral: [
        'I bought Bitcoin at the peak and...',
        'The Bitcoin truth nobody wants to hear',
        'POV: Your Bitcoin transaction clears',
        'Hot take: Bitcoin is still early',
        'What \$100 in Bitcoin is worth today'
      ],
      educational: [
        'Bitcoin basics: What actually is it?',
        'How Bitcoin mining works (simply)',
        'Dollar-cost averaging Bitcoin explained',
        'The halving cycle: What to expect',
        'How to secure your first Bitcoin'
      ],
      storytelling: [
        'How I discovered Bitcoin in 2012',
        'The day I accidentally threw away my Bitcoin',
        'My family thinks I\'m crazy (but I\'m not)',
        'From skeptic to believer: My journey'
      ]
    }
  },

  airbnb: {
    name: 'Airbnb',
    type: 'product',
    industry: 'travel/accommodation',
    audience: ['travelers', 'budget-conscious', 'families', 'digital nomads', 'experience seekers'],
    painPoints: [
      'cleaning fees',
      'hidden costs',
      'cancellation policy issues',
      'photos vs reality',
      'check-in complications',
      'host communication'
    ],
    benefits: [
      'unique accommodations',
      'local experience',
      'more space than hotels',
      'kitchen facilities',
      'character and charm',
      'competitive pricing for groups'
    ],
    misconceptions: [
      'always cheaper than hotels',
      'always unique experiences',
      'no rules to follow',
      'only for budget travelers',
      'not safe',
      'replaces hotels entirely'
    ],
    competitors: ['VRBO', 'Booking.com', 'Hotels.com', 'Couchsurfing', 'Marriott Homes'],
    trends: [
      'workcation listings',
      'sustainable travel',
      'luxury retreats',
      'experience packages',
      'superhost loyalty',
      'long-term stays'
    ],
    vocabulary: [
      'Superhost',
      'listing',
      'check-in',
      'amenities',
      'host',
      'guest',
      'review',
      'instant book',
      'cancellation policy',
      'cleaning fee',
      'VRBO',
      ' space',
      'local'
    ],
    emotionalTriggers: [
      'wanderlust',
      'belonging anywhere',
      'authentic travel',
      'comfort away from home',
      'adventure excitement'
    ],
    useCases: [
      'vacation rentals',
      'business travel',
      'family gatherings',
      'romantic getaways',
      'digital nomad stays',
      'staycations'
    ],
    faqs: [
      'How to pick the perfect Airbnb?',
      'Are cleaning fees worth it?',
      'What Superhost status actually means?',
      'Airbnb vs Hotel: What\'s better?',
      'How to avoid Airbnb scams?'
    ],
    hooks: {
      viral: [
        'The Airbnb that made me never want to leave',
        'POV: You find the perfect last-minute Airbnb',
        'Airbnb hosting changed my life (here\'s how)',
        'The most unique Airbnb I\'ve ever stayed in',
        'Airbnb hack: Book like a pro'
      ],
      educational: [
        'How to read Airbnb reviews properly',
        'The hidden Airbnb fees decoded',
        'Superhost tips: How hosts actually win',
        'Airbnb vs VRBO: Which to choose?',
        'What Airbnb photos don\'t show you'
      ],
      storytelling: [
        'Our worst Airbnb experience (and what we learned)',
        'How we started hosting and became Superhosts',
        'The castle Airbnb I stayed in for \$100/night',
        'Why I switched from hotels to Airbnb'
      ]
    }
  },

  starbucks: {
    name: 'Starbucks',
    type: 'brand',
    industry: 'food/beverage',
    audience: ['coffee enthusiasts', 'professionals', 'students', 'casual drinkers', 'brand loyalists'],
    painPoints: [
      'price increases',
      'long wait times',
      'order complexity anxiety',
      'inconsistent drinks',
      'calorie content',
      'loyalty program complexity'
    ],
    benefits: [
      'consistent experience worldwide',
      'comfort and ambiance',
      'mobile ordering',
      'free WiFi',
      'loyalty rewards',
      'seasonal specialties'
    ],
    misconceptions: [
      'it\'s just overpriced coffee',
      'baristas judge your order',
      'all drinks are the same calories',
      'Starbucks is bad coffee',
      'you need to be a coffee expert to order'
    ],
    competitors: [' Dunkin\'', 'Peet\'s Coffee', 'Dutch Bros', 'McCafe', 'Local coffee shops'],
    trends: [
      'oat milk popularity',
      'plant-based options',
      'app loyalty program',
      'cold brew innovation',
      'sustainability initiatives',
      'recovery drinks'
    ],
    vocabulary: [
      'barista',
      'espresso',
      'frappuccino',
      'Grande',
      'Venti',
      'Trenta',
      'pump',
      'shot',
      'syrup',
      'foam',
      'iced',
      'Oatly',
      'seasonal',
      'PSL',
      'TikTok drink'
    ],
    emotionalTriggers: [
      'daily ritual comfort',
      'treat yourself',
      'third place feeling',
      'seasonal excitement',
      'ordering as identity'
    ],
    useCases: [
      'morning routine',
      'workspace',
      'catch-up with friends',
      'road trip staple',
      'treat yourself moment',
      'caffeine fix'
    ],
    faqs: [
      'What\'s actually in a Starbucks drink?',
      'How to order like a pro?',
      'Is the app worth it?',
      'What\'s the healthiest order?',
      'Secret menu: What actually exists?'
    ],
    hooks: {
      viral: [
        'I ordered Starbucks every day for a week and...',
        'POV: You finally learn to order like a regular',
        'The Starbucks hack that saved me \$50',
        'Starbucks baristas react to my order',
        'I tried every iced coffee on the menu'
      ],
      educational: [
        'Starbucks size guide: Order like a local',
        'How to customize any drink (hidden options)',
        'The truth about Starbucks calories',
        'How the loyalty program actually works',
        'What to order at Starbucks if you\'re not a coffee person'
      ],
      storytelling: [
        'My Starbucks order evolved over 10 years',
        'The barista who remembered my order',
        'How Starbucks became my office',
        'The drink that started my coffee obsession'
      ]
    }
  }
};

/**
 * EntityIntelligenceEngine
 * Detects entities in user input and provides rich context
 */
export class EntityIntelligenceEngine {
  constructor() {
    this.entities = ENTITY_DATABASE;
    this.detectedEntities = [];
    this.entityCache = new Map();
  }

  /**
   * Detect entities in user input
   * @param {string} text - User input text
   * @returns {Object[]} Array of detected entities with metadata
   */
  detect(text) {
    const normalizedText = text.toLowerCase();
    const detected = [];

    // Check each known entity
    for (const [key, entity] of Object.entries(this.entities)) {
      // Check entity name and aliases
      const nameMatches = normalizedText.includes(entity.name.toLowerCase());
      
      // Check industry keywords
      const industryMatches = entity.industry.toLowerCase().split('/').some(
        term => normalizedText.includes(term.trim())
      );

      // Check vocabulary matches
      const vocabularyMatches = entity.vocabulary.filter(
        word => normalizedText.includes(word.toLowerCase())
      ).length;

      // Score the detection
      const score = (nameMatches ? 50 : 0) + (industryMatches ? 20 : 0) + (vocabularyMatches * 3);
      
      if (score > 25) {
        detected.push({
          key,
          entity,
          score,
          matchedVocabulary: entity.vocabulary.filter(
            word => normalizedText.includes(word.toLowerCase())
          ),
          confidence: Math.min(score / 80, 1)
        });
      }
    }

    // Sort by score and return top matches
    detected.sort((a, b) => b.score - a.score);
    this.detectedEntities = detected;
    
    return detected;
  }

  /**
   * Get the primary detected entity
   * @returns {Object|null} Primary entity or null
   */
  getPrimaryEntity() {
    return this.detectedEntities[0] || null;
  }

  /**
   * Get context for content generation
   * @param {Object} entity - Detected entity
   * @param {string} hookType - Type of hook (viral, educational, storytelling)
   * @returns {Object} Context object for generation
   */
  getContext(entity, hookType = 'viral') {
    if (!entity) return null;

    const { entity: data } = entity;
    
    return {
      name: data.name,
      industry: data.industry,
      hooks: data.hooks[hookType] || data.hooks.viral,
      vocabulary: data.vocabulary,
      painPoints: data.painPoints,
      benefits: data.benefits,
      misconceptions: data.misconceptions,
      trends: data.trends,
      emotionalTriggers: data.emotionalTriggers,
      useCases: data.useCases,
      faqs: data.faqs,
      competitors: data.competitors,
      audience: data.audience
    };
  }

  /**
   * Generate entity-specific content sections
   * @param {Object} entity - Detected entity
   * @param {string} sectionType - Section type (hook, body, cta)
   * @param {Object} options - Generation options
   * @returns {string} Generated content
   */
  generateSection(entity, sectionType, options = {}) {
    if (!entity) return null;

    const { entity: data } = entity;
    const { hookType = 'viral', personality = 'default' } = options;

    switch (sectionType) {
      case 'hook':
        return this._generateHook(data, hookType, personality);
      case 'pain_point':
        return this._generatePainPoint(data, personality);
      case 'benefit':
        return this._generateBenefit(data, personality);
      case 'misconception':
        return this._generateMisconception(data, personality);
      case 'trend':
        return this._generateTrend(data, personality);
      case 'faq':
        return this._generateFAQ(data, personality);
      default:
        return null;
    }
  }

  _generateHook(entity, hookType, personality) {
    const hooks = entity.hooks[hookType] || entity.hooks.viral;
    return hooks[Math.floor(Math.random() * hooks.length)];
  }

  _generatePainPoint(entity, personality) {
    const painPoint = entity.painPoints[Math.floor(Math.random() * entity.painPoints.length)];
    
    const templates = {
      viral: `Here's the thing about ${entity.name} nobody talks about:`,
      educational: `Common challenge with ${entity.name}:`,
      storytelling: `The moment I realized ${entity.name} wasn't perfect:`,
      default: `The ${entity.name} struggle is real:`
    };

    return `${templates[personality] || templates.default}\n\n${painPoint}`;
  }

  _generateBenefit(entity, personality) {
    const benefit = entity.benefits[Math.floor(Math.random() * entity.benefits.length)];
    return `What ${entity.name} does well:\n\n${benefit}`;
  }

  _generateMisconception(entity, personality) {
    const misconception = entity.misconceptions[Math.floor(Math.random() * entity.misconceptions.length)];
    
    const templates = {
      viral: `Myth: ${misconception}`,
      educational: `The truth about ${entity.name}:`,
      storytelling: `I used to think ${misconception}`,
      default: `Wrong assumption:`
    };

    return `${templates[personality] || templates.default}\n\n${misconception}`;
  }

  _generateTrend(entity, personality) {
    const trend = entity.trends[Math.floor(Math.random() * entity.trends.length)];
    return `What's happening with ${entity.name}:\n\n${trend}`;
  }

  _generateFAQ(entity, personality) {
    const faq = entity.faqs[Math.floor(Math.random() * entity.faqs.length)];
    return `Q: ${faq}`;
  }

  /**
   * Check if any entities are detected
   * @returns {boolean}
   */
  hasEntities() {
    return this.detectedEntities.length > 0;
  }

  /**
   * Get all detected entities
   * @returns {Object[]}
   */
  getAllDetected() {
    return this.detectedEntities;
  }

  /**
   * Add custom entity to database
   * @param {string} key - Entity key
   * @param {Object} entityData - Entity data
   */
  addEntity(key, entityData) {
    this.entities[key] = entityData;
  }
}

export default EntityIntelligenceEngine;
