/**
 * IdeaGraph
 * Topic relationship graph for expanding concepts and enriching content generation
 * Maps related topics, entities, and concepts
 */

export class IdeaGraph {
  constructor() {
    this.graph = this._buildInitialGraph();
  }

  /**
   * Build the initial topic relationship graph
   */
  _buildInitialGraph() {
    return {
      ai: {
        name: 'AI & Machine Learning',
        nodes: ['chatgpt', 'openai', 'claude', 'gemini', 'cursor', 'github copilot', 'midjourney', 'stable diffusion', 'llm', 'prompt engineering', 'automation', 'artificial intelligence', 'machine learning', 'neural networks', 'gpt'],
        connections: ['technology', 'productivity', 'business'],
        attributes: {
          industry: 'technology',
          audience: ['developers', 'creators', 'professionals', 'businesses'],
          trends: ['multimodal AI', 'AI agents', 'personalized AI', 'AI regulation']
        }
      },
      chatgpt: {
        name: 'ChatGPT',
        nodes: ['openai', 'gpt4', 'conversational ai', 'chatbots', 'prompting'],
        connections: ['ai', 'productivity'],
        attributes: {
          type: 'product',
          parent: 'ai',
          audience: ['everyone', 'creators', 'professionals', 'students'],
          painPoints: ['prompt crafting', 'hallucinations', 'context limits'],
          benefits: ['speed', 'versatility', '24/7 availability']
        }
      },
      openai: {
        name: 'OpenAI',
        nodes: ['chatgpt', 'gpt', 'dall-e', 'whisper', 'api'],
        connections: ['ai', 'business'],
        attributes: {
          type: 'company',
          parent: 'ai'
        }
      },
      technology: {
        name: 'Technology',
        nodes: ['software', 'apps', 'saas', 'startups', 'developers', 'coding', 'apps', 'digital'],
        connections: ['ai', 'productivity', 'business'],
        attributes: {
          industry: 'general tech',
          trends: ['ai integration', 'low-code', 'remote work tools']
        }
      },
      business: {
        name: 'Business & Entrepreneurship',
        nodes: ['startup', 'entrepreneur', 'founder', 'saas', 'marketing', 'sales', 'growth', 'revenue', 'customers'],
        connections: ['marketing', 'finance', 'productivity'],
        attributes: {
          industry: 'business',
          audience: ['founders', 'professionals', 'aspirational'],
          painPoints: ['customer acquisition', 'product market fit', 'scaling']
        }
      },
      marketing: {
        name: 'Marketing',
        nodes: ['social media', 'content marketing', 'seo', 'branding', 'instagram', 'tiktok', 'email marketing', 'influencer'],
        connections: ['business', 'social media'],
        attributes: {
          industry: 'marketing',
          painPoints: ['engagement', 'conversion', 'content creation']
        }
      },
      fitness: {
        name: 'Fitness & Health',
        nodes: ['workout', 'gym', 'health', 'strength training', 'cardio', 'nutrition', 'muscle', 'protein', 'weight loss', 'weightlifting'],
        connections: ['health', 'lifestyle'],
        attributes: {
          industry: 'health',
          audience: ['fitness enthusiasts', 'beginners', 'athletes'],
          painPoints: ['motivation', 'plateaus', 'time management']
        }
      },
      finance: {
        name: 'Finance & Investing',
        nodes: ['investing', 'stocks', 'crypto', 'bitcoin', 'savings', 'budgeting', 'passive income', 'wealth'],
        connections: ['business', 'lifestyle'],
        attributes: {
          industry: 'finance',
          painPoints: ['risk tolerance', 'analysis paralysis', 'starting']
        }
      },
      travel: {
        name: 'Travel',
        nodes: ['vacation', 'adventure', 'destinations', 'backpacking', 'hotels', 'flights', 'itinerary'],
        connections: ['lifestyle', 'photography'],
        attributes: {
          industry: 'travel',
          painPoints: ['planning', 'budget', 'authenticity']
        }
      },
      food: {
        name: 'Food & Cooking',
        nodes: ['recipes', 'cooking', 'restaurants', 'meals', 'healthy eating', 'baking', 'cuisine'],
        connections: ['lifestyle', 'health'],
        attributes: {
          industry: 'food',
          painPoints: ['meal planning', 'time', 'healthy choices']
        }
      },
      productivity: {
        name: 'Productivity',
        nodes: ['time management', 'focus', 'habits', 'routines', 'workflow', 'organization', 'goals', 'efficiency'],
        connections: ['technology', 'business', 'lifestyle'],
        attributes: {
          industry: 'self-improvement',
          painPoints: ['distractions', 'procrastination', 'burnout']
        }
      },
      photography: {
        name: 'Photography',
        nodes: ['photos', 'camera', 'editing', 'lightroom', 'composition', 'portrait', 'landscape'],
        connections: ['travel', 'creative', 'social media'],
        attributes: {
          industry: 'creative',
          painPoints: ['equipment', 'editing', 'creativity']
        }
      },
      social_media: {
        name: 'Social Media',
        nodes: ['instagram', 'tiktok', 'youtube', 'twitter', 'content creation', 'followers', 'engagement'],
        connections: ['marketing', 'photography', 'creative'],
        attributes: {
          industry: 'social',
          painPoints: ['algorithm changes', 'burnout', 'consistency']
        }
      },
      minimalism: {
        name: 'Minimalism',
        nodes: ['declutter', 'organization', 'simplicity', 'essentialism', 'digital minimalism'],
        connections: ['lifestyle', 'productivity'],
        attributes: {
          industry: 'lifestyle',
          painPoints: ['decision fatigue', 'attachment to things']
        }
      },
      lifestyle: {
        name: 'Lifestyle',
        nodes: ['habits', 'routines', 'self-improvement', 'balance', 'wellness'],
        connections: ['fitness', 'productivity', 'minimalism'],
        attributes: {
          industry: 'lifestyle'
        }
      },
      tesla: {
        name: 'Tesla',
        nodes: ['electric vehicles', 'fsd', 'autopilot', 'ev charging', 'elon musk', 'sustainability'],
        connections: ['technology', 'sustainability'],
        attributes: {
          type: 'brand',
          industry: 'automotive',
          painPoints: ['charging anxiety', 'price', 'quality concerns'],
          benefits: ['technology', 'performance', 'low running costs']
        }
      },
      instagram: {
        name: 'Instagram',
        nodes: ['reels', 'stories', 'feed', 'igtv', 'shopping', 'influencers'],
        connections: ['social media', 'marketing', 'photography'],
        attributes: {
          type: 'platform',
          industry: 'social',
          painPoints: ['algorithm', 'competition', 'content saturation']
        }
      },
      sustainability: {
        name: 'Sustainability',
        nodes: ['eco-friendly', 'climate', 'green living', 'renewable energy', 'carbon footprint'],
        connections: ['lifestyle', 'business'],
        attributes: {
          industry: 'environmental',
          trends: ['corporate sustainability', 'consumer preferences']
        }
      }
    };
  }

  /**
   * Find related topics for a given topic
   */
  findRelated(topic, maxResults = 5) {
    const normalized = topic.toLowerCase().trim();
    
    // Direct match
    if (this.graph[normalized]) {
      return this._getRelatedFromNode(normalized, maxResults);
    }
    
    // Partial match - search keys
    for (const [key, node] of Object.entries(this.graph)) {
      if (key.includes(normalized) || normalized.includes(key)) {
        return this._getRelatedFromNode(key, maxResults);
      }
      
      // Search in nodes
      if (node.nodes?.some(n => n.includes(normalized) || normalized.includes(n))) {
        return this._getRelatedFromNode(key, maxResults);
      }
    }
    
    // No match - return generic related
    return this._getGenericRelated(normalized, maxResults);
  }

  /**
   * Get related topics from a node
   */
  _getRelatedFromNode(nodeKey, maxResults) {
    const node = this.graph[nodeKey];
    if (!node) return [];
    
    const related = [];
    
    // Add connections (top-level related topics)
    if (node.connections) {
      node.connections.forEach(conn => {
        if (this.graph[conn]) {
          related.push({
            topic: conn,
            name: this.graph[conn].name,
            relationship: 'related field',
            weight: 0.8
          });
        }
      });
    }
    
    // Add sub-nodes (more specific topics)
    if (node.nodes) {
      node.nodes.slice(0, maxResults).forEach(n => {
        related.push({
          topic: n,
          name: n,
          relationship: 'subtopic',
          weight: 0.6
        });
      });
    }
    
    // Add attributes if available
    if (node.attributes) {
      if (node.attributes.trends) {
        node.attributes.trends.slice(0, 3).forEach(trend => {
          related.push({
            topic: trend,
            name: trend,
            relationship: 'trend',
            weight: 0.5
          });
        });
      }
    }
    
    // Sort by weight and limit
    return related
      .sort((a, b) => b.weight - a.weight)
      .slice(0, maxResults);
  }

  /**
   * Get generic related topics for unknown topics
   */
  _getGenericRelated(topic, maxResults) {
    // Return some generally popular related topics
    const genericRelated = [
      { topic: 'productivity', name: 'Productivity', relationship: 'often combined', weight: 0.5 },
      { topic: 'lifestyle', name: 'Lifestyle', relationship: 'often combined', weight: 0.4 },
      { topic: 'business', name: 'Business', relationship: 'often combined', weight: 0.4 },
      { topic: 'marketing', name: 'Marketing', relationship: 'often combined', weight: 0.3 }
    ];
    
    return genericRelated.slice(0, maxResults);
  }

  /**
   * Expand a topic into related concepts
   */
  expandTopic(topic, maxConcepts = 5) {
    const related = this.findRelated(topic, maxConcepts);
    
    return {
      primary: topic,
      concepts: related.map(r => r.topic),
      graph: related
    };
  }

  /**
   * Check if two topics are related
   */
  areRelated(topic1, topic2) {
    const norm1 = topic1.toLowerCase();
    const norm2 = topic2.toLowerCase();
    
    // Direct keys
    if (this.graph[norm1]?.connections?.includes(norm2)) return true;
    if (this.graph[norm2]?.connections?.includes(norm1)) return true;
    
    // Sub-nodes
    if (this.graph[norm1]?.nodes?.some(n => n.includes(norm2) || norm2.includes(n))) return true;
    if (this.graph[norm2]?.nodes?.some(n => n.includes(norm1) || norm1.includes(n))) return true;
    
    // Shared connections
    const conn1 = this.graph[norm1]?.connections || [];
    const conn2 = this.graph[norm2]?.connections || [];
    if (conn1.some(c => conn2.includes(c))) return true;
    
    return false;
  }

  /**
   * Get topic category
   */
  getCategory(topic) {
    const normalized = topic.toLowerCase();
    
    // Direct match
    if (this.graph[normalized]) {
      return this.graph[normalized].attributes?.industry || 'general';
    }
    
    // Search in nodes
    for (const [key, node] of Object.entries(this.graph)) {
      if (node.nodes?.some(n => n.includes(normalized) || normalized.includes(n))) {
        return node.attributes?.industry || 'general';
      }
    }
    
    return 'general';
  }

  /**
   * Get topic attributes
   */
  getAttributes(topic) {
    const normalized = topic.toLowerCase();
    
    if (this.graph[normalized]) {
      return this.graph[normalized].attributes || {};
    }
    
    return {};
  }

  /**
   * Add a custom topic to the graph
   */
  addTopic(topic, data) {
    const normalized = topic.toLowerCase();
    this.graph[normalized] = {
      name: data.name || topic,
      nodes: data.nodes || [],
      connections: data.connections || [],
      attributes: data.attributes || {}
    };
  }

  /**
   * Get all topics
   */
  getAllTopics() {
    return Object.keys(this.graph).map(key => ({
      key,
      name: this.graph[key].name,
      category: this.graph[key].attributes?.industry || 'general'
    }));
  }

  /**
   * Search topics by query
   */
  search(query, limit = 10) {
    const normalized = query.toLowerCase();
    const results = [];
    
    for (const [key, node] of Object.entries(this.graph)) {
      let score = 0;
      
      // Key match
      if (key === normalized) score += 100;
      else if (key.includes(normalized)) score += 50;
      else if (normalized.includes(key)) score += 30;
      
      // Name match
      if (node.name?.toLowerCase().includes(normalized)) score += 40;
      
      // Node match
      const nodeMatches = node.nodes?.filter(n => 
        n.includes(normalized) || normalized.includes(n)
      ).length || 0;
      score += nodeMatches * 10;
      
      if (score > 0) {
        results.push({
          key,
          name: node.name,
          category: node.attributes?.industry || 'general',
          score
        });
      }
    }
    
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Build concept expansion for content generation
   */
  buildConceptExpansion(topic) {
    const expansion = {
      primary: topic,
      category: this.getCategory(topic),
      attributes: this.getAttributes(topic),
      related: this.findRelated(topic, 5),
      expandedConcepts: []
    };
    
    // Generate expanded concepts based on related topics
    expansion.related.forEach(rel => {
      expansion.expandedConcepts.push({
        concept: rel.topic,
        angle: this._getAngleForRelationship(rel)
      });
    });
    
    return expansion;
  }

  /**
   * Get content angle based on relationship
   */
  _getAngleForRelationship(related) {
    const angles = {
      'related field': 'connects to',
      'subtopic': 'specifically about',
      'trend': 'emerging trend in',
      'often combined': 'complements'
    };
    
    return angles[related.relationship] || 'related to';
  }
}

export default IdeaGraph;
