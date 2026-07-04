// Topic Classification and Context Extraction
// Auto-detects topic category and extracts context-specific keywords

export const TOPIC_CATEGORIES = {
  travel: {
    name: 'Travel',
    keywords: ['travel', 'trip', 'vacation', 'holiday', 'destination', 'explore', 'adventure', 'flight', 'hotel', 'beach', 'mountain', 'city', 'country', 'tourism', 'backpack', 'itinerary', 'passport', 'wanderlust', 'journey', 'cruise', 'resort', 'airbnb', 'hostel', 'tourist', 'sightseeing', 'guide'],
    context: {
      aspects: ['locations', 'experiences', 'culture', 'food', 'accommodation', 'transportation', 'budget', 'tips'],
      vocabulary: ['wanderlust', 'hidden gem', 'off-the-beaten-path', 'bucket list', 'paradise', 'escape', 'discovery', 'authentic', 'local gems', 'stunning views', 'breathtaking', 'serene', 'adventure awaits', 'culture shock', 'new horizons'],
      emotions: ['wonder', 'wanderlust', 'excitement', 'curiosity', 'relaxation', 'thrill', 'serenity'],
      associations: ['photos', 'memories', 'stories', 'connections', 'perspective']
    }
  },
  food: {
    name: 'Food',
    keywords: ['food', 'recipe', 'cooking', 'eat', 'restaurant', 'meal', 'dish', 'chef', 'delicious', 'tasty', 'flavor', 'ingredient', 'kitchen', 'bake', 'dessert', 'breakfast', 'lunch', 'dinner', 'snack', 'vegan', 'vegetarian', 'cuisine', 'gourmet', 'foodie', 'yum', 'savory', 'sweet', 'spicy', 'homemade', 'fresh'],
    context: {
      aspects: ['taste', 'presentation', 'quality', 'price', 'atmosphere', 'service', 'ingredients', 'technique'],
      vocabulary: ['mouthwatering', 'flavorful', 'indulgent', 'comfort food', 'farm-to-table', 'artisanal', 'gourmet', 'decadent', 'flavor explosion', 'perfect bite', 'heavenly', 'delectable', 'scrumptious', 'appetizing', 'savory'],
      emotions: ['satisfaction', 'comfort', 'excitement', 'nostalgia', 'indulgence', 'curiosity'],
      associations: ['memories', 'traditions', 'gatherings', 'celebrations', 'comfort']
    }
  },
  fitness: {
    name: 'Fitness',
    keywords: ['fitness', 'gym', 'workout', 'exercise', 'health', 'training', 'muscle', 'strength', 'cardio', 'running', 'yoga', 'pilates', 'weights', 'protein', 'supplement', 'muscles', 'body', 'fit', 'athlete', 'workout', 'routine', 'gains', 'burn', 'sweat', 'rep', 'sets', 'calisthenics'],
    context: {
      aspects: ['training', 'nutrition', 'recovery', 'motivation', 'progress', 'results', 'technique'],
      vocabulary: ['gains', 'pump', 'burn', 'beast mode', 'fit fam', 'crush it', 'no excuses', 'level up', 'grind', 'sweat equity', 'earned', 'strong', 'powerful', 'transformed', 'lean'],
      emotions: ['determination', 'pride', 'energy', 'motivation', 'accomplishment', 'discipline'],
      associations: ['progress photos', 'personal records', 'transformation', 'lifestyle', 'community']
    }
  },
  business: {
    name: 'Business',
    keywords: ['business', 'entrepreneur', 'startup', 'company', 'ceo', 'founder', 'leadership', 'management', 'strategy', 'growth', 'revenue', 'profit', 'marketing', 'sales', 'customer', 'client', 'meeting', 'office', 'corporate', 'enterprise', 'venture', 'investment', 'deal', 'negotiate', 'hustle', 'success'],
    context: {
      aspects: ['strategy', 'growth', 'leadership', 'innovation', 'market', 'customers', 'operations', 'finance'],
      vocabulary: ['game-changer', 'scale', 'pivot', 'disrupt', 'innovate', 'leverage', 'ROI', 'KPI', 'metrics', 'bottom line', 'synergy', 'value proposition', 'competitive edge', 'market share', 'growth hacking'],
      emotions: ['ambition', 'confidence', 'determination', 'excitement', 'focus'],
      associations: ['success', 'impact', 'legacy', 'growth', 'opportunity']
    }
  },
  finance: {
    name: 'Finance',
    keywords: ['finance', 'money', 'invest', 'investment', 'stock', 'crypto', 'bitcoin', 'trading', 'portfolio', 'wealth', 'saving', 'budget', 'debt', 'credit', 'banking', 'retirement', 'passive', 'income', 'dividend', 'ETF', 'market', 'financial', 'wealthy', 'rich', 'affluent', 'net worth', 'capital', 'asset'],
    context: {
      aspects: ['returns', 'risk', 'diversification', 'planning', 'goals', 'strategy', 'analysis', 'compounding'],
      vocabulary: ['compound', 'passive income', 'dividend', 'bull market', 'bear market', 'portfolio', 'asset allocation', 'FIRE', 'financial freedom', 'cash flow', 'net worth', 'appreciation', 'passive', 'wealth building', 'smart money'],
      emotions: ['confidence', 'security', 'ambition', 'caution', 'excitement'],
      associations: ['security', 'freedom', 'future', 'peace of mind', 'independence']
    }
  },
  marketing: {
    name: 'Marketing',
    keywords: ['marketing', 'brand', 'content', 'social media', 'instagram', 'facebook', 'twitter', 'tiktok', 'seo', 'advertising', 'campaign', 'engagement', 'followers', 'viral', 'trending', 'strategy', 'digital', 'influencer', 'audience', 'reach', 'impressions', 'conversion', 'funnel', 'copywriting', 'creative'],
    context: {
      aspects: ['audience', 'engagement', 'reach', 'conversion', 'branding', 'content', 'platform', 'strategy'],
      vocabulary: ['viral', 'go viral', 'engagement', 'organic reach', 'brand awareness', 'content calendar', 'community building', 'storytelling', 'authentic', 'relatable', 'scroll-stopping', 'share-worthy', 'trend-jacking', 'leveraged', 'amplified'],
      emotions: ['excitement', 'inspiration', 'curiosity', 'connection', 'urgency'],
      associations: ['audience growth', 'community', 'brand loyalty', 'conversions', 'impact']
    }
  },
  technology: {
    name: 'Technology',
    keywords: ['tech', 'software', 'app', 'developer', 'code', 'programming', 'computer', 'digital', 'data', 'cloud', 'cybersecurity', 'smartphone', 'laptop', 'gadget', 'innovation', 'startup', 'saas', 'api', 'algorithm', 'machine learning', 'automation', 'robot', 'iot', 'blockchain', 'web3'],
    context: {
      aspects: ['features', 'usability', 'performance', 'innovation', 'design', 'integration', 'scalability', 'security'],
      vocabulary: ['cutting-edge', 'disruptive', 'game-changer', 'seamless', 'intuitive', 'powerful', 'efficient', 'scalable', 'innovative', 'next-gen', 'smart', 'intelligent', 'revolutionary', 'breakthrough', 'state-of-the-art'],
      emotions: ['curiosity', 'excitement', 'wonder', 'confidence', 'amazement'],
      associations: ['efficiency', 'progress', 'future', 'possibilities', 'solutions']
    }
  },
  ai: {
    name: 'AI',
    keywords: ['ai', 'artificial intelligence', 'chatgpt', 'openai', 'gpt', 'llm', 'machine learning', 'ml', 'neural', 'deep learning', 'prompt', 'prompting', 'automation', 'bot', 'algorithm', 'model', 'training', 'data science', 'predictive', 'generative', 'nlp', 'computer vision', 'automation', 'intelligent'],
    context: {
      aspects: ['capabilities', 'use cases', 'efficiency', 'accuracy', 'limitations', 'ethics', 'future', 'applications'],
      vocabulary: ['game-changer', 'transformative', 'revolutionary', 'mind-blowing', 'powerful', 'intelligent', 'smart assistant', 'productivity', 'efficiency', 'automation', 'human-AI collaboration', 'prompt engineering', 'workflow', 'leverage AI', 'cutting-edge'],
      emotions: ['curiosity', 'wonder', 'excitement', 'caution', 'awe', 'inspiration'],
      associations: ['productivity', 'innovation', 'future', 'possibilities', 'efficiency']
    }
  },
  fashion: {
    name: 'Fashion',
    keywords: ['fashion', 'style', 'outfit', 'clothing', 'dress', 'wear', 'trend', 'wardrobe', 'designer', 'luxury', 'brand', 'streetwear', 'vintage', 'aesthetic', 'ootd', 'fashionista', 'chic', 'elegant', 'runway', 'collection', 'fabrics', 'textile', 'accessories', 'jewelry', 'shoes', 'bags'],
    context: {
      aspects: ['aesthetics', 'quality', 'versatility', 'expression', 'trends', 'value', 'sustainability', 'style'],
      vocabulary: ['effortless', 'chic', 'elevated', 'stunning', 'on-trend', 'must-have', 'wardrobe staple', 'show-stopping', 'head-turning', 'aesthetic goals', 'clean', 'minimalist', 'bold', 'statement piece', 'timeless'],
      emotions: ['confidence', 'creativity', 'expression', 'joy', 'inspiration'],
      associations: ['self-expression', 'identity', 'creativity', 'confidence', 'community']
    }
  },
  beauty: {
    name: 'Beauty',
    keywords: ['beauty', 'skincare', 'makeup', 'cosmetics', 'skin', 'hair', 'nails', 'wellness', 'glow', 'routine', 'product', 'serum', 'moisturizer', 'foundation', 'lipstick', 'mascara', 'eyeliner', 'aesthetic', 'self-care', 'spa', 'treatments', 'dermatologist', 'clean beauty', 'cruelty-free'],
    context: {
      aspects: ['ingredients', 'results', 'routine', 'skin type', 'application', 'quality', 'value', 'safety'],
      vocabulary: ['glow', 'radiant', 'flawless', 'luminous', 'glass skin', 'dewy', 'smooth', 'hydrated', 'buzzing', 'viral', 'holy grail', 'game-changer', 'must-try', 'dupes', 'clean beauty'],
      emotions: ['confidence', 'self-care', 'indulgence', 'joy', 'empowerment'],
      associations: ['self-expression', 'self-care', 'confidence', 'rituals', 'transformation']
    }
  },
  lifestyle: {
    name: 'Lifestyle',
    keywords: ['lifestyle', 'life', 'daily', 'routine', 'morning', 'evening', 'habits', 'productivity', 'minimalism', 'mindfulness', 'balance', 'wellness', 'self-care', 'home', 'decor', 'interior', 'organization', 'homes', 'goals', 'personal', 'development', 'growth', 'inspiration', 'motivation'],
    context: {
      aspects: ['balance', 'fulfillment', 'habits', 'relationships', 'environment', 'health', 'growth', 'purpose'],
      vocabulary: ['best life', 'vibes', 'aesthetic', 'curated', 'intentional', 'mindful', 'balanced', 'fulfilled', 'thriving', 'abundant', 'joyful', 'purposeful', 'meaningful', 'authentic', 'aligned'],
      emotions: ['peace', 'joy', 'fulfillment', 'gratitude', 'balance', 'serenity'],
      associations: ['growth', 'experiences', 'relationships', 'purpose', 'joy']
    }
  },
  pets: {
    name: 'Pets',
    keywords: ['pet', 'dog', 'cat', 'puppy', 'kitten', 'animal', 'fur', 'paw', 'cute', 'adorable', 'love', 'paws', 'doggo', 'fluffy', 'pupper', 'furbaby', 'pet parent', 'vet', 'training', 'adoption', 'rescue', 'shelter', 'breed', 'playful', 'loyal', 'companion'],
    context: {
      aspects: ['personality', 'care', 'training', 'nutrition', 'health', 'play', 'bonding', 'adventure'],
      vocabulary: ['good boy', 'good girl', 'pawsome', 'furball', 'furbaby', 'pawrent', 'doggo', 'pupper', 'fluffy', 'cuddle', 'belly rubs', 'treats', 'tail wags', 'zoomies', 'puppy eyes'],
      emotions: ['love', 'joy', 'companionship', 'warmth', 'loyalty', 'amusement'],
      associations: ['unconditional love', 'companionship', 'laughter', 'loyalty', 'memories']
    }
  },
  gaming: {
    name: 'Gaming',
    keywords: ['gaming', 'game', 'play', 'video game', 'xbox', 'playstation', 'nintendo', 'pc gaming', 'steam', 'esports', 'streamer', 'twitch', 'gamer', 'controller', 'graphics', 'rpg', 'fps', 'multiplayer', 'leaderboard', 'pro gamer', 'gaming setup', 'gaming chair', 'rig', 'graphics card'],
    context: {
      aspects: ['gameplay', 'graphics', 'story', 'community', 'competition', 'entertainment', 'skill', 'strategy'],
      vocabulary: ['gg', 'ezpz', 'clutch', 'no scope', 'headshot', 'level up', 'grind', 'OP', 'nerf', 'buff', 'respawn', 'checkpoint', 'boss fight', 'speedrun', 'god tier'],
      emotions: ['excitement', 'thrill', 'competition', 'frustration', 'triumph', 'community'],
      associations: ['friendships', 'competition', 'escapism', 'skill', 'creativity']
    }
  },
  photography: {
    name: 'Photography',
    keywords: ['photography', 'photo', 'camera', 'shot', 'portrait', 'landscape', 'editing', 'lightroom', 'photoshop', 'filter', 'lens', 'aperture', 'exposure', 'composition', 'golden hour', 'composition', 'aesthetic', 'visuals', 'capture', 'moment', 'sensor', 'dslr', 'mirrorless', 'prime lens'],
    context: {
      aspects: ['composition', 'lighting', 'color grading', 'subject', 'timing', 'equipment', 'editing', 'creativity'],
      vocabulary: ['frame', 'captured', 'moment', 'light chaser', 'golden hour', 'mood', 'vibe', 'cinematic', 'visual story', 'raw', 'candid', 'composition', 'depth of field', 'bokeh', 'perspective'],
      emotions: ['nostalgia', 'wonder', 'creativity', 'beauty', 'appreciation', 'inspiration'],
      associations: ['memories', 'stories', 'beauty', 'creativity', 'moments']
    }
  },
  education: {
    name: 'Education',
    keywords: ['education', 'learn', 'study', 'course', 'student', 'teacher', 'school', 'university', 'degree', 'online course', 'tutorial', 'lesson', 'knowledge', 'skill', 'teaching', 'classroom', 'homework', 'exam', 'graduate', 'scholarship', 'academic', 'scholar', 'learning', 'education'],
    context: {
      aspects: ['knowledge', 'skills', 'career', 'growth', 'learning methods', 'resources', 'outcomes', 'accessibility'],
      vocabulary: ['game-changer', 'breakthrough', 'mindset', 'growth mindset', 'lifelong learning', 'upskill', 'reskill', 'knowledge is power', 'wisdom', 'enlightenment', 'curriculum', 'pedagogy', 'mastery', 'expertise', 'foundational'],
      emotions: ['curiosity', 'accomplishment', 'pride', 'determination', 'excitement', 'hope'],
      associations: ['opportunity', 'growth', 'future', 'empowerment', 'possibilities']
    }
  },
  movies: {
    name: 'Movies',
    keywords: ['movie', 'film', 'cinema', 'netflix', 'hbo', 'hollywood', 'actor', 'actress', 'director', 'trailer', 'watch', 'binge', 'series', 'episode', 'plot', 'scene', 'review', 'rating', 'genre', 'thriller', 'comedy', 'drama', 'action', 'horror', 'romance', 'blockbuster', 'oscar'],
    context: {
      aspects: ['storytelling', 'acting', 'visuals', 'direction', 'soundtrack', 'emotional impact', 'entertainment', 'cultural relevance'],
      vocabulary: ['binge-worthy', 'edge-of-seat', 'plot twist', 'showstopper', 'scene-stealing', 'award-worthy', 'captivating', 'riveting', 'unforgettable', 'iconic', 'masterpiece', 'emotional rollercoaster', 'must-watch', 'cult classic', 'vibe'],
      emotions: ['excitement', 'suspense', 'laughter', 'tears', 'wonder', 'nostalgia', 'thrill'],
      associations: ['escapism', 'emotions', 'conversations', 'memories', 'culture']
    }
  },
  music: {
    name: 'Music',
    keywords: ['music', 'song', 'artist', 'album', 'playlist', 'spotify', 'playlist', 'concert', 'tour', 'live', 'band', 'singer', 'rapper', 'producer', 'beats', 'lyrics', 'melody', 'rhythm', 'hip hop', 'pop', 'rock', 'jazz', 'electronic', 'podcast', 'audio', 'sound'],
    context: {
      aspects: ['melody', 'lyrics', 'production', 'emotion', 'rhythm', 'cultural impact', 'artist vision', 'live performance'],
      vocabulary: ['banger', 'fire', 'goat', 'dope', 'vibe', 'anthem', 'chart-topper', 'earworm', 'soulful', 'melodic', 'rhythmic', 'catchy', 'hypnotic', 'haunting', 'soul-stirring'],
      emotions: ['energy', 'nostalgia', 'passion', 'excitement', 'melancholy', 'euphoria', 'connection'],
      associations: ['memories', 'identity', 'community', 'expression', 'culture']
    }
  },
  sports: {
    name: 'Sports',
    keywords: ['sports', 'football', 'basketball', 'soccer', 'baseball', 'tennis', 'golf', 'nba', 'nfl', 'mlb', 'player', 'team', 'championship', 'game', 'match', 'score', 'win', 'lose', 'athlete', 'training', 'coach', 'league', 'draft', 'playoffs', 'tournament', 'stadium'],
    context: {
      aspects: ['skill', 'strategy', 'teamwork', 'competition', 'fitness', 'sportsmanship', 'entertainment', 'legacy'],
      vocabulary: ['goat', 'legend', 'champion', 'MVP', 'clutch', 'swoosh', 'powerhouse', 'dynasty', 'underdog', 'comeback', 'dominant', 'elite', 'pro-level', 'game-winning', 'first place'],
      emotions: ['excitement', 'pride', 'passion', 'tension', 'triumph', 'community', 'belonging'],
      associations: ['team spirit', 'loyalty', 'tradition', 'excellence', 'memories']
    }
  },
  motivation: {
    name: 'Motivation',
    keywords: ['motivation', 'inspire', 'success', 'mindset', 'positive', 'growth', 'believe', 'achieve', 'dream', 'goal', 'hustle', 'grind', 'never give up', 'persist', 'dedication', 'hard work', 'ambition', 'focus', 'discipline', 'courage', 'strength', 'power', 'fearless', 'unstoppable', 'champion', 'warrior'],
    context: {
      aspects: ['mindset', 'action', 'perseverance', 'belief', 'growth', 'purpose', 'resilience', 'vision'],
      vocabulary: ['unstoppable', 'fearless', 'relentless', 'warrior', 'champion', 'go-getter', 'dream chaser', 'level up', 'no limits', 'all in', 'locked in', 'grind never stops', 'built different', '不一样', 'savage'],
      emotions: ['determination', 'fire', 'passion', 'confidence', 'drive', 'resilience', 'hope'],
      associations: ['success', 'transformation', 'achievement', 'breakthrough', 'triumph']
    }
  },
  productivity: {
    name: 'Productivity',
    keywords: ['productivity', 'efficiency', 'time management', 'focus', 'deep work', 'flow state', 'habits', 'routines', 'organization', 'planning', 'goals', 'deadline', 'workflow', 'schedule', 'calendar', 'todo', 'task', 'priorities', 'procrastination', 'discipline', 'energy', 'clarity', 'momentum', 'systems'],
    context: {
      aspects: ['time', 'energy', 'focus', 'systems', 'habits', 'automation', 'delegation', 'prioritization'],
      vocabulary: ['game-changer', 'level up', 'flow state', 'deep work', 'time-block', 'audit', 'system', 'framework', 'stack', 'stack your wins', 'productive', 'laser-focused', 'high-performance', 'optimized', 'maximum output'],
      emotions: ['accomplishment', 'control', 'clarity', 'energy', 'satisfaction', 'confidence'],
      associations: ['results', 'growth', 'freedom', 'balance', 'sustainability']
    }
  }
};

export class TopicClassifier {
  constructor() {
    this.categories = TOPIC_CATEGORIES;
    this.recentlyUsed = {
      hooks: [],
      patterns: [],
      ctas: []
    };
  }

  // Classify topic and return category with confidence
  classify(text) {
    const normalizedText = text.toLowerCase();
    
    // Score each category
    const scores = {};
    let highestScore = 0;
    let bestCategory = 'lifestyle'; // default
    
    for (const [key, category] of Object.entries(this.categories)) {
      let score = 0;
      
      // Check keywords
      for (const keyword of category.keywords) {
        if (normalizedText.includes(keyword)) {
          score += 2;
        }
      }
      
      // Check for partial matches in compound words
      const words = normalizedText.split(/\s+/);
      for (const word of words) {
        if (word.length > 3) {
          for (const keyword of category.keywords) {
            if (keyword.includes(word) || word.includes(keyword)) {
              score += 1;
            }
          }
        }
      }
      
      scores[key] = score;
      
      if (score > highestScore) {
        highestScore = score;
        bestCategory = key;
      }
    }
    
    // If no good match, create dynamic category
    if (highestScore < 3) {
      // Extract unique words that might form a custom category
      const uniqueWords = words.filter(w => 
        w.length > 4 && 
        !['about', 'which', 'where', 'there', 'their', 'would', 'could', 'should'].includes(w)
      );
      
      return {
        category: 'custom',
        name: this._capitalizeFirst(uniqueWords.slice(0, 2).join(' ')) || 'General',
        confidence: 0.3,
        customKeywords: uniqueWords.slice(0, 10),
        context: this._buildDefaultContext()
      };
    }
    
    return {
      category: bestCategory,
      name: this.categories[bestCategory].name,
      confidence: Math.min(highestScore / 10, 1),
      context: this.categories[bestCategory].context
    };
  }
  
  _capitalizeFirst(str) {
    return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  
  _buildDefaultContext() {
    return {
      aspects: ['quality', 'benefits', 'features', 'value', 'experience', 'results', 'impact', 'outcomes'],
      vocabulary: ['quality', 'value', 'experience', 'transformative', 'essential', 'remarkable', 'outstanding', 'impressive', 'exceptional', 'remarkable'],
      emotions: ['curiosity', 'interest', 'confidence', 'excitement', 'satisfaction'],
      associations: ['benefits', 'results', 'outcomes', 'value', 'impact']
    };
  }
  
  // Track used items to reduce repetition
  trackUsed(type, item) {
    if (!this.recentlyUsed[type]) {
      this.recentlyUsed[type] = [];
    }
    
    // Keep last 20 items
    this.recentlyUsed[type].unshift(item);
    if (this.recentlyUsed[type].length > 20) {
      this.recentlyUsed[type].pop();
    }
  }
  
  // Get item that hasn't been used recently
  getUnused(type, items) {
    const available = items.filter(item => !this.recentlyUsed[type].includes(item));
    
    // If all items used, return random
    if (available.length === 0) {
      return items[Math.floor(Math.random() * items.length)];
    }
    
    return available[Math.floor(Math.random() * available.length)];
  }
}

export default TopicClassifier;
