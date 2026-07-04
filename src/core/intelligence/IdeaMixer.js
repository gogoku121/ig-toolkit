/**
 * IdeaMixer
 * Combines related concepts to produce more original content
 * Examples: AI + productivity, fitness + psychology, travel + minimalism
 */

export class IdeaMixer {
  constructor() {
    this.connections = this._buildConnections();
  }

  /**
   * Build concept connections
   */
  _buildConnections() {
    return {
      ai: {
        connects: ['productivity', 'creativity', 'learning', 'work', 'automation', 'writing', 'business'],
        insights: [
          'AI amplifies what you already do well',
          'The best AI use is invisible',
          'AI doesn\'t replace creativity, it enables it'
        ]
      },
      productivity: {
        connects: ['ai', 'fitness', 'minimalism', 'psychology', 'time', 'habits', 'focus'],
        insights: [
          'Energy management is more important than time management',
          'What you don\'t do defines your productivity more than what you do'
        ]
      },
      fitness: {
        connects: ['psychology', 'habits', 'health', 'productivity', 'mindset', 'discipline', 'wellness'],
        insights: [
          'Fitness is 20% physical, 80% mental',
          'The workout you want to skip is the one you need most'
        ]
      },
      psychology: {
        connects: ['fitness', 'productivity', 'habits', 'mindset', 'motivation', 'emotions', 'relationships'],
        insights: [
          'Your environment shapes your behavior more than your willpower',
          'The stories you tell yourself create your reality'
        ]
      },
      marketing: {
        connects: ['business', 'branding', 'content', 'social media', 'storytelling', 'psychology', 'advertising'],
        insights: [
          'People don\'t buy products, they buy stories',
          'Authenticity is the last marketing advantage'
        ]
      },
      business: {
        connects: ['marketing', 'productivity', 'strategy', 'leadership', 'growth', 'customers', 'sales'],
        insights: [
          'Revenue solves most business problems',
          'Your first 10 customers define your trajectory'
        ]
      },
      travel: {
        connects: ['minimalism', 'culture', 'photography', 'adventure', 'lifestyle', 'experience', 'creativity'],
        insights: [
          'Travel makes you realize how small your problems are',
          'The best travel happens outside the itinerary'
        ]
      },
      minimalism: {
        connects: ['productivity', 'travel', 'finance', 'focus', 'declutter', 'intentional', 'lifestyle'],
        insights: [
          'Less stuff, more life',
          'The best organizing system is owning less'
        ]
      },
      creativity: {
        connects: ['ai', 'productivity', 'art', 'writing', 'innovation', 'mindset', 'habits'],
        insights: [
          'Creativity is not about talent, it\'s about process',
          'The best creative work comes from constraints'
        ]
      },
      habits: {
        connects: ['psychology', 'fitness', 'productivity', 'discipline', 'routine', 'identity', 'growth'],
        insights: [
          'You are your habits',
          'Motivation gets you started, identity keeps you going'
        ]
      },
      mindset: {
        connects: ['psychology', 'fitness', 'productivity', 'success', 'resilience', 'growth', 'beliefs'],
        insights: [
          'Your mindset determines your reality',
          'Growth mindset vs fixed mindset changes everything'
        ]
      },
      learning: {
        connects: ['ai', 'education', 'skills', 'growth', 'knowledge', 'practice', 'mastery'],
        insights: [
          'Learning how to learn is the most important skill',
          'The best learners fail the most'
        ]
      },
      finance: {
        connects: ['minimalism', 'business', 'investing', 'money', 'wealth', 'budget', 'freedom'],
        insights: [
          'Financial freedom is about options, not just money',
          'The relationship with money starts with the relationship with self'
        ]
      },
      leadership: {
        connects: ['business', 'psychology', 'communication', 'team', 'vision', 'influence', 'management'],
        insights: [
          'Leadership is about making others better',
          'The best leaders are servants first'
        ]
      },
      relationships: {
        connects: ['psychology', 'communication', 'emotions', 'connection', 'social', 'dating', 'family'],
        insights: [
          'Relationships are the ultimate leverage',
          'The quality of your relationships determines the quality of your life'
        ]
      }
    };
  }

  /**
   * Mix two or more concepts
   */
  mix(concepts, options = {}) {
    const { count = 3 } = options;
    
    // Normalize concepts
    const normalized = concepts.map(c => c.toLowerCase().trim());
    
    // Get unique concepts
    const unique = [...new Set(normalized)];
    
    // Build mix
    const mix = {
      primary: unique[0],
      secondary: unique.slice(1),
      insights: [],
      angles: [],
      connections: [],
      hook: null
    };
    
    // Generate insights from combination
    mix.insights = this._generateMixInsights(unique);
    
    // Generate angles from connections
    mix.angles = this._generateMixAngles(unique);
    
    // Find shared connections
    mix.connections = this._findSharedConnections(unique);
    
    // Generate hook
    mix.hook = this._generateMixHook(unique, mix);
    
    return mix;
  }

  /**
   * Generate insights from mixing concepts
   */
  _generateMixInsights(concepts) {
    const insights = [];
    
    // Generate cross-concept insights
    if (concepts.length >= 2) {
      const [a, b] = concepts;
      
      // Pattern: Amplification
      insights.push({
        insight: `${this._capitalize(a)} amplifies ${this._capitalize(b)}`,
        type: 'amplification'
      });
      
      // Pattern: Replacement
      insights.push({
        insight: `What if ${a} replaced ${b}?`,
        type: 'replacement'
      });
      
      // Pattern: Intersection
      insights.push({
        insight: `The intersection of ${a} and ${b} is where the magic happens`,
        type: 'intersection'
      });
      
      // Pattern: Transfer
      insights.push({
        insight: `What ${a} teaches about ${b}`,
        type: 'transfer'
      });
      
      // Pattern: Contrast
      insights.push({
        insight: `${this._capitalize(a)} vs ${this._capitalize(b)}: what winning looks like`,
        type: 'contrast'
      });
    }
    
    // Generate insights from connections
    concepts.forEach(concept => {
      const conn = this.connections[concept];
      if (conn?.insights) {
        insights.push({
          insight: conn.insights[0],
          type: 'from_concept',
          source: concept
        });
      }
    });
    
    return insights.slice(0, 5);
  }

  /**
   * Generate angles from connections
   */
  _generateMixAngles(concepts) {
    const angles = [];
    
    // Find concepts that both connect to
    const shared = this._findSharedConnections(concepts);
    
    shared.forEach(common => {
      angles.push({
        angle: `Both ${concepts.join(' and ')} connect through ${common}`,
        type: 'connection'
      });
    });
    
    // Generate chain angles
    if (concepts.length >= 2) {
      angles.push({
        angle: `${concepts[0]} → ${concepts[1]} → ${concepts[2] || 'transformation'}`,
        type: 'chain'
      });
    }
    
    // Generate contrast angles
    if (concepts.length >= 2) {
      angles.push({
        angle: `Why ${concepts[0]} without ${concepts[1]} is incomplete`,
        type: 'contrast'
      });
    }
    
    return angles;
  }

  /**
   * Find shared connections between concepts
   */
  _findSharedConnections(concepts) {
    const connections = concepts.map(c => {
      const conn = this.connections[c];
      return conn?.connects || [];
    });
    
    if (connections.length < 2) return [];
    
    // Find intersection
    const [first, ...rest] = connections;
    return first.filter(c => rest.some(r => r.includes(c)));
  }

  /**
   * Generate hook from mix
   */
  _generateMixHook(concepts, mix) {
    const hooks = [
      `What happens when ${concepts[0]} meets ${concepts[1]}?`,
      `The ${concepts[0]}-${concepts[1]} connection nobody talks about`,
      `How ${concepts[0]} and ${concepts[1]} compound each other`,
      `Why you need ${concepts[0]} AND ${concepts[1]}`,
      `The ${concepts[0]} lesson for ${concepts[1]}`
    ];
    
    return hooks[Math.floor(Math.random() * hooks.length)];
  }

  /**
   * Find related concepts for a topic
   */
  findRelated(topic, limit = 5) {
    const normalized = topic.toLowerCase().trim();
    const conn = this.connections[normalized];
    
    if (!conn) {
      // Try partial match
      for (const [key, value] of Object.entries(this.connections)) {
        if (key.includes(normalized) || normalized.includes(key)) {
          return {
            topic,
            related: value.connects.slice(0, limit),
            insights: value.insights
          };
        }
      }
      return null;
    }
    
    return {
      topic,
      related: conn.connects.slice(0, limit),
      insights: conn.insights
    };
  }

  /**
   * Suggest concept combinations
   */
  suggestCombinations(topic, count = 3) {
    const related = this.findRelated(topic, 10);
    if (!related || !related.related) return [];
    
    const suggestions = [];
    
    // Suggest pairs
    for (let i = 0; i < Math.min(count, related.related.length); i++) {
      suggestions.push({
        mix: [topic, related.related[i]],
        insight: related.insights[i] || this._generateMixInsights([topic, related.related[i]])[0]
      });
    }
    
    return suggestions;
  }

  /**
   * Generate content angle from mix
   */
  generateAngle(mix) {
    const { primary, secondary, insights } = mix;
    
    return {
      title: `${this._capitalize(primary)} + ${this._capitalize(secondary)}`,
      hook: mix.hook,
      premise: `What happens when ${primary} and ${secondary} collide?`,
      body: insights.map(i => i.insight).join('\n\n'),
      cta: 'What would you add to this combination?'
    };
  }

  /**
   * Expand topic using related concepts
   */
  expandTopic(topic) {
    const related = this.findRelated(topic, 5);
    if (!related) return { original: topic, expanded: [topic] };
    
    return {
      original: topic,
      expanded: [topic, ...related.related],
      insights: related.insights
    };
  }

  /**
   * Get random connection insight
   */
  getRandomInsight() {
    const keys = Object.keys(this.connections);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const conn = this.connections[randomKey];
    
    if (!conn || !conn.insights) return null;
    
    return {
      concept: randomKey,
      insight: conn.insights[Math.floor(Math.random() * conn.insights.length)]
    };
  }

  _capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export default IdeaMixer;
