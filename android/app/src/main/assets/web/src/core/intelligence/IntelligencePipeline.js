/**
 * Intelligence Pipeline
 * Orchestrates all intelligence modules into a unified content generation pipeline
 * 
 * Pipeline: User Input → Topic Classification → Entity Detection → 
 *          Knowledge Expansion → Reasoning → Strategy Selection →
 *          Content Generation → Humanization → Self-Critique →
 *          Multi-Version Output
 */

import { EntityIntelligenceEngine } from './EntityIntelligenceEngine.js';
import { KnowledgeLayer } from './KnowledgeLayer.js';
import { ReasoningEngine } from './ReasoningEngine.js';
import { HumanWritingEngine } from './HumanWritingEngine.js';
import { MemoryManager } from './MemoryManager.js';
import { CritiqueEngine } from './CritiqueEngine.js';
import { shuffle, random, capitalizeFirst } from '../contentData.js';

/**
 * IntelligencePipeline
 * Main orchestration class for intelligent content generation
 */
export class IntelligencePipeline {
  constructor() {
    this.entityEngine = new EntityIntelligenceEngine();
    this.knowledgeLayer = new KnowledgeLayer();
    this.reasoningEngine = new ReasoningEngine();
    this.humanWritingEngine = new HumanWritingEngine();
    this.memoryManager = new MemoryManager();
    this.critiqueEngine = new CritiqueEngine();
    
    this.generationHistory = [];
    this.maxHistory = 100;
  }

  /**
   * Generate content using the full intelligence pipeline
   * @param {Object} options - Generation options
   * @returns {Object} Generated content with metadata
   */
  generate(options = {}) {
    const {
      topic,
      personality = 'default',
      goal = 'engage',
      audience = 'general',
      tone = 'casual',
      pattern = 'auto',
      versions = 3
    } = options;

    // Stage 1: Entity Detection
    const entities = this.entityEngine.detect(topic);
    const primaryEntity = this.entityEngine.getPrimaryEntity();
    const entityContext = primaryEntity 
      ? this.entityEngine.getContext(primaryEntity, this._getHookType(personality))
      : null;

    // Stage 2: Topic Classification
    const category = this._classifyTopic(topic, primaryEntity);
    
    // Stage 3: Internal Reasoning
    const reasoning = this.reasoningEngine.analyze({
      topic,
      entity: primaryEntity,
      category: category.key,
      personality,
      goal,
      audience
    });

    // Stage 4: Knowledge Expansion
    const knowledge = this._expandKnowledge(category.key, primaryEntity);

    // Stage 5: Strategy Selection
    const strategy = this._selectStrategy(goal, personality, reasoning);

    // Stage 6: Generate Multiple Versions
    const versions_output = [];
    for (let i = 0; i < versions; i++) {
      const version = this._generateVersion({
        topic,
        personality,
        goal,
        audience,
        tone,
        pattern,
        entityContext,
        category,
        reasoning,
        knowledge,
        strategy,
        versionNumber: i + 1
      });
      
      // Stage 7: Humanize
      version.humanizedContent = this.humanWritingEngine.humanize(version.rawContent, {
        personality,
        topic
      });

      // Stage 8: Self-Critique & Rewrite (up to 3 iterations)
      const critiqueResult = this.critiqueEngine.critique(version.humanizedContent, {
        goal,
        personality
      });
      
      // Use the best version after critique
      version.humanizedContent = critiqueResult.content;
      version.critique = {
        iterations: critiqueResult.iterations,
        issues: critiqueResult.issues,
        grade: critiqueResult.grade
      };

      // Stage 9: Final Scoring
      const scores = this._scoreContent(version.humanizedContent, goal);
      version.scores = scores;
      version.finalScore = scores.total;

      // Stage 10: Track in Memory for uniqueness
      this.memoryManager.analyzeAndTrack(version.humanizedContent, {
        topic,
        personality,
        goal,
        pattern: version.strategy
      });

      versions_output.push(version);
    }

    // Sort by score
    versions_output.sort((a, b) => b.finalScore - a.finalScore);

    // Mark best version
    versions_output.forEach((v, i) => {
      v.rank = i + 1;
      v.isBest = i === 0;
    });

    // Track generation in history
    this._trackGeneration({
      topic,
      personality,
      goal,
      bestScore: versions_output[0]?.finalScore,
      timestamp: Date.now()
    });

    return {
      topic,
      personality,
      goal,
      audience,
      primaryEntity: primaryEntity?.entity?.name || null,
      category: category.name,
      reasoning,
      versions: versions_output,
      bestVersion: versions_output[0],
      recommendedStrategy: strategy
    };
  }

  /**
   * Generate a single version
   */
  _generateVersion(options) {
    const {
      topic,
      personality,
      goal,
      audience,
      tone,
      pattern,
      entityContext,
      category,
      reasoning,
      knowledge,
      strategy,
      versionNumber
    } = options;

    // Generate hook
    const hook = this._generateHook(topic, personality, entityContext, category, reasoning);
    
    // Generate main content based on strategy
    const mainContent = this._generateMainContent({
      topic,
      personality,
      goal,
      audience,
      entityContext,
      category,
      reasoning,
      knowledge,
      strategy
    });

    // Generate CTA
    const cta = this._generateCTA(goal, personality, entityContext);

    // Assemble
    const rawContent = this._assembleContent(hook, mainContent, cta, strategy);

    return {
      versionNumber,
      hook,
      mainContent,
      cta,
      rawContent,
      strategy,
      metadata: {
        topic,
        personality,
        goal,
        reasoning,
        category: category.name
      }
    };
  }

  /**
   * Generate hook based on context
   */
  _generateHook(topic, personality, entityContext, category, reasoning) {
    // Entity-specific hooks take priority
    if (entityContext?.hooks) {
      const hooks = entityContext.hooks;
      const selected = hooks[Math.floor(Math.random() * hooks.length)];
      return selected;
    }

    // Reasoning-based hooks
    const reasoningHook = reasoning?.hookStrategy?.recommended?.template
      ?.replace('{topic}', topic)
      ?.replace('{controversial-opinion}', reasoning?.controversialAngle?.hotTake || '');

    if (reasoningHook && Math.random() > 0.3) {
      return reasoningHook;
    }

    // Personality-based hooks
    const personalityHooks = this._getPersonalityHooks(personality);
    const selectedHook = personalityHooks[Math.floor(Math.random() * personalityHooks.length)];
    
    return typeof selectedHook === 'function' 
      ? selectedHook(topic) 
      : selectedHook.replace('{topic}', topic);
  }

  /**
   * Get personality-specific hooks
   */
  _getPersonalityHooks(personality) {
    const hooks = {
      'viral creator': [
        `POV: You just discovered the {topic} secret nobody talks about`,
        `Nobody is talking about this {topic} thing and it's driving me crazy`,
        `I tried the {topic} thing for 30 days and...`,
        `The {topic} mistake that cost me YEARS`,
        `{topic} changed forever`
      ],
      'gen z': [
        `no bc someone explained {topic} to me finally`,
        `the way i wish someone told me about {topic} sooner`,
        `rating {topic} on a scale of big yikes to no thoughts head empty`,
        `main character energy: {topic} edition`,
        `{topic} but make it a plot twist`
      ],
      'storyteller': [
        () => `Three years ago, I almost gave up on {topic}. Here's what changed.`,
        `The {topic} story that still gives me chills`,
        `What nobody tells you about the {topic} journey`,
        `A moment that redefined how I see {topic}`
      ],
      'educational': [
        `{topic} 101: What you need to know`,
        `The complete guide to understanding {topic}`,
        `Everything you've got wrong about {topic}`,
        `The {topic} blueprint for beginners`
      ],
      'funny': [
        `{topic} explained like you're a 5 year old (you're not)`,
        `POV: {topic} hits different after age 30`,
        `When {topic} goes wrong but make it a rom-com`,
        `I asked about {topic} and honestly? Same vibes`
      ],
      default: [
        `Everything you need to know about {topic}`,
        `Let's talk {topic}`,
        `The {topic} guide you've been waiting for`,
        `Why {topic} deserves your attention`
      ]
    };

    return hooks[personality] || hooks.default;
  }

  /**
   * Generate main content based on strategy
   */
  _generateMainContent(options) {
    const { personality, goal, entityContext, category, reasoning, knowledge, strategy } = options;

    switch (strategy) {
      case 'educational':
        return this._generateEducational(options);
      case 'storytelling':
        return this._generateStorytelling(options);
      case 'problem-solution':
        return this._generateProblemSolution(options);
      case 'myth-bust':
        return this._generateMythBust(options);
      case 'how-to':
        return this._generateHowTo(options);
      case 'comparison':
        return this._generateComparison(options);
      default:
        return this._generateEngagement(options);
    }
  }

  _generateEducational({ topic, entityContext, knowledge }) {
    const sections = [];
    
    // Key insight from knowledge
    if (entityContext?.vocabulary) {
      sections.push({
        type: 'insight',
        content: `Here's what most people miss about ${topic}:\n\n${entityContext.vocabulary.slice(0, 3).join(', ')}.`
      });
    } else if (knowledge?.insights) {
      const insightKeys = Object.keys(knowledge.insights);
      const randomKey = insightKeys[Math.floor(Math.random() * insightKeys.length)];
      const insights = knowledge.insights[randomKey];
      sections.push({
        type: 'insight',
        content: `${capitalizeFirst(randomKey.replace(/([A-Z])/g, ' $1').toLowerCase())} about ${topic}:\n\n${insights[Math.floor(Math.random() * insights.length)]}`
      });
    }

    // Value section
    sections.push({
      type: 'value',
      content: `What ${topic} does well:\n\n• Solves real problems\n• Delivers measurable results\n• Hasstood the test of time`
    });

    return sections;
  }

  _generateStorytelling({ topic, reasoning, knowledge }) {
    const storyPrompt = knowledge?.storyPrompts?.turningPoints?.[0] 
      || `My ${topic} journey started with one decision.`;

    return [
      {
        type: 'story',
        content: `${storyPrompt}\n\nThe transformation wasn't immediate. But looking back, I can pinpoint the exact moment everything shifted.`
      },
      {
        type: 'lesson',
        content: `The biggest lesson? ${reasoning?.problemSolved?.solution || 'Consistency beats perfection.'}`
      }
    ];
  }

  _generateProblemSolution({ topic, entityContext, reasoning }) {
    const problem = entityContext?.painPoints?.[0] || reasoning?.problemSolved?.problem || `The ${topic} struggle is real.`;
    const solution = entityContext?.benefits?.[0] || reasoning?.problemSolved?.solution || `Here's what actually works.`;

    return [
      {
        type: 'problem',
        content: `THE PROBLEM:\n${problem}`
      },
      {
        type: 'solution',
        content: `THE SOLUTION:\n${solution}`
      },
      {
        type: 'how',
        content: `HOW IT WORKS:\n• Start with the basics\n• Build from there\n• Measure what matters`
      }
    ];
  }

  _generateMythBust({ topic, entityContext, reasoning }) {
    const myth = entityContext?.misconceptions?.[0] || reasoning?.misconception?.misconception || `Myth: ${topic} is one-size-fits-all`;
    const truth = entityContext?.benefits?.[0] || reasoning?.misconception?.truth || `Truth: Context matters everything.`;

    return [
      {
        type: 'myth',
        content: `MYTH:\n${myth}`
      },
      {
        type: 'truth',
        content: `TRUTH:\n${truth}`
      }
    ];
  }

  _generateHowTo({ topic, entityContext }) {
    const steps = entityContext?.useCases?.slice(0, 4) || ['Understand basics', 'Start simple', 'Build momentum', 'Iterate and improve'];

    return [
      {
        type: 'intro',
        content: `How to actually approach ${topic}:`
      },
      {
        type: 'steps',
        content: steps.map((step, i) => `${i + 1}. ${capitalizeFirst(step)}`).join('\n')
      }
    ];
  }

  _generateComparison({ topic, entityContext }) {
    const competitors = entityContext?.competitors?.slice(0, 2) || ['traditional approach'];
    const alternative = competitors[0] || 'the old way';

    return [
      {
        type: 'comparison',
        content: `${topic} vs ${alternative}:\n\nWhich actually wins?\n\nThe answer might surprise you.`
      }
    ];
  }

  _generateEngagement({ topic, reasoning }) {
    return [
      {
        type: 'hook',
        content: `${reasoning?.whyCare?.primary || `Here's the thing about ${topic}.`}\n\nMost advice ignores this.`
      },
      {
        type: 'insight',
        content: `${reasoning?.surprisingElement?.surprise || 'The real insight takes time to understand.'}`
      }
    ];
  }

  /**
   * Generate CTA
   */
  _generateCTA(goal, personality, entityContext) {
    const ctas = {
      'generate comments': ['Drop your thoughts below 👇', 'Comment your take', 'What would you add?', 'Tell me I\'m wrong'],
      'generate shares': ['Share this with someone who needs to see this 🔄', 'Tag a friend', 'Send it to your bestie'],
      'generate saves': ['Save this for later 🔖', 'Bookmark this', 'Pin it for reference'],
      sell: ['Link in bio', 'Shop now', 'Get started today'],
      educate: ['Follow for more insights', 'Save this post', 'Share with someone learning'],
      inspire: ['Save this for motivation', 'Share with someone who needs this', 'Follow for daily inspiration'],
      engage: ['Follow for more', 'Drop a ❤️', 'Comment below'],
      default: ['Follow for more like this!', 'Save this post', 'Share your thoughts']
    };

    const goalCTAs = ctas[goal] || ctas.default;
    return goalCTAs[Math.floor(Math.random() * goalCTAs.length)];
  }

  /**
   * Assemble content sections
   */
  _assembleContent(hook, mainContent, cta, strategy) {
    let content = `${hook}\n\n`;

    mainContent.forEach(section => {
      content += `${section.content}\n\n`;
    });

    content += `${cta}`;
    return content.trim();
  }

  /**
   * Score content across multiple dimensions
   */
  _scoreContent(content, goal) {
    const scores = {
      hook: this._scoreHook(content),
      readability: this._scoreReadability(content),
      engagement: this._scoreEngagement(content),
      uniqueness: this._scoreUniqueness(content),
      goalAlignment: this._scoreGoalAlignment(content, goal),
      cta: this._scoreCTA(content)
    };

    // Calculate total
    const weights = {
      hook: 0.15,
      readability: 0.2,
      engagement: 0.2,
      uniqueness: 0.15,
      goalAlignment: 0.15,
      cta: 0.15
    };

    let total = 0;
    Object.entries(weights).forEach(([key, weight]) => {
      total += scores[key].score * weight;
    });

    return {
      hook: scores.hook,
      readability: scores.readability,
      engagement: scores.engagement,
      uniqueness: scores.uniqueness,
      goalAlignment: scores.goalAlignment,
      cta: scores.cta,
      total: Math.round(total),
      grade: this._getGrade(total)
    };
  }

  _scoreHook(content) {
    const hook = content.split('\n')[0] || '';
    let score = 70;
    
    // Bonus for strong openers
    if (/^(POV|I tried|Nobody|The|Breaking)/.test(hook)) score += 15;
    if (/^no bc|, honestly|\(you're not\)/.test(hook)) score += 10;
    if (hook.length > 20 && hook.length < 150) score += 10;
    if (hook.length > 200) score -= 20;
    
    // Penalty for weak openers
    if (/^(Here\'s|How to|What is|The best)/.test(hook)) score -= 10;

    return { score: Math.max(50, Math.min(100, score)), details: 'Hook strength assessment' };
  }

  _scoreReadability(content) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.split(/\s+/);
    const avgSentenceLength = words.length / sentences.length;
    
    let score = 70;
    
    // Perfect range: 12-20 words per sentence
    if (avgSentenceLength >= 12 && avgSentenceLength <= 20) score += 20;
    else if (avgSentenceLength > 8 && avgSentenceLength < 30) score += 10;
    else if (avgSentenceLength > 30) score -= 15;
    else if (avgSentenceLength < 8) score += 5;

    // Variety bonus
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const varietyRatio = uniqueWords.size / words.length;
    if (varietyRatio > 0.6) score += 10;

    return { score: Math.max(50, Math.min(100, score)), details: `Avg sentence: ${avgSentenceLength.toFixed(1)} words` };
  }

  _scoreEngagement(content) {
    let score = 70;
    
    // Questions for engagement
    const questionCount = (content.match(/\?/g) || []).length;
    if (questionCount >= 1 && questionCount <= 3) score += 15;
    
    // Emotional words
    const emotionalWords = /honestly|actually|really|truly|basically|literally|seriously/g;
    const emotionalMatches = (content.match(emotionalWords) || []).length;
    if (emotionalMatches <= 3) score += 10;
    else if (emotionalMatches > 5) score -= 10;

    // Direct address
    const directAddress = /you|your|we|us/g;
    const directMatches = (content.match(directAddress) || []).length;
    if (directMatches >= 3 && directMatches <= 10) score += 10;

    return { score: Math.max(50, Math.min(100, score)), details: `${questionCount} questions` };
  }

  _scoreUniqueness(content) {
    // Check against history
    const words = content.toLowerCase().split(/\s+/);
    let maxSimilarity = 0;
    
    this.generationHistory.forEach(item => {
      if (item.topic) {
        // Simple similarity check
        const overlap = words.filter(w => item.content?.includes(w)).length;
        const similarity = overlap / words.length;
        maxSimilarity = Math.max(maxSimilarity, similarity);
      }
    });

    let score = 70;
    if (maxSimilarity < 0.3) score += 20;
    else if (maxSimilarity < 0.5) score += 10;
    else if (maxSimilarity > 0.7) score -= 20;

    // Template detection penalty
    if (/Here\'s the thing|at the end of the day|the truth is/g.test(content)) score -= 10;

    return { score: Math.max(40, Math.min(100, score)), details: 'Uniqueness vs history' };
  }

  _scoreGoalAlignment(content, goal) {
    let score = 70;
    
    const goalIndicators = {
      'generate comments': [/\?|comment|tell me|your thoughts/i],
      'generate shares': [/share|tag|send this|forward/i],
      'generate saves': [/save|bookmark|pin|reference/i],
      sell: [/link in bio|shop|get it|buy now/i],
      educate: [/here\'s what|understanding|learn|know/i],
      inspire: [/never give|keep going|you can|motivation/i]
    };

    const indicators = goalIndicators[goal] || [];
    const matches = indicators.filter(regex => regex.test(content)).length;
    if (matches >= 1) score += 20;
    else score -= 10;

    return { score: Math.max(50, Math.min(100, score)), details: 'Goal alignment check' };
  }

  _scoreCTA(content) {
    const ctaPatterns = [
      /follow|share|comment|save|tag|dm|link in bio|shop|buy/i
    ];
    
    const hasCTA = ctaPatterns.some(p => p.test(content));
    const lastLine = content.split('\n').pop() || '';
    const ctaInLastLine = ctaPatterns.some(p => p.test(lastLine));

    let score = 60;
    if (hasCTA) score += 20;
    if (ctaInLastLine) score += 15;
    if (!hasCTA) score -= 30;

    return { score: Math.max(40, Math.min(100, score)), details: hasCTA ? 'CTA present' : 'No CTA detected' };
  }

  _getGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  _getHookType(personality) {
    const hookTypes = {
      'viral creator': 'viral',
      'gen z': 'viral',
      'educational': 'educational',
      'storyteller': 'storytelling',
      default: 'viral'
    };
    return hookTypes[personality] || 'viral';
  }

  _classifyTopic(topic, entity) {
    if (entity) {
      return { key: entity.category, name: entity.entity.name };
    }

    // Simple topic detection
    const lowerTopic = topic.toLowerCase();
    const categoryMap = {
      travel: ['travel', 'trip', 'vacation', 'destination'],
      fitness: ['fitness', 'workout', 'gym', 'exercise', 'health'],
      business: ['business', 'entrepreneur', 'startup', 'marketing'],
      technology: ['tech', 'software', 'app', 'digital'],
      ai: ['ai', 'chatgpt', 'openai', 'gpt', 'artificial intelligence'],
      food: ['food', 'recipe', 'cooking', 'restaurant'],
      finance: ['finance', 'invest', 'money', 'crypto', 'bitcoin'],
      lifestyle: ['lifestyle', 'life', 'habits', 'routine'],
      productivity: ['productivity', 'productivity', 'time management', 'focus'],
      marketing: ['marketing', 'social media', 'content', 'brand']
    };

    for (const [category, keywords] of Object.entries(categoryMap)) {
      if (keywords.some(kw => lowerTopic.includes(kw))) {
        return { key: category, name: category.charAt(0).toUpperCase() + category.slice(1) };
      }
    }

    return { key: 'lifestyle', name: 'Lifestyle' };
  }

  _expandKnowledge(category, entity) {
    if (entity) {
      return {
        insights: {
          painPoints: entity.painPoints,
          benefits: entity.benefits,
          trends: entity.trends
        },
        storyPrompts: {
          turningPoints: entity.useCases?.slice(0, 3) || []
        }
      };
    }

    return this.knowledgeLayer.getAllInsights(category);
  }

  _selectStrategy(goal, personality, reasoning) {
    const strategies = {
      educate: ['educational', 'how-to', 'comparison'],
      entertain: ['storytelling', 'comparison', 'myth-bust'],
      inspire: ['storytelling', 'problem-solution'],
      sell: ['problem-solution', 'comparison'],
      'build trust': ['educational', 'how-to'],
      'generate comments': ['myth-bust', 'problem-solution', 'comparison'],
      'generate shares': ['storytelling', 'myth-bust'],
      'generate saves': ['educational', 'how-to'],
      engage: ['problem-solution', 'educational', 'storytelling']
    };

    const availableStrategies = strategies[goal] || strategies.engage;
    return availableStrategies[Math.floor(Math.random() * availableStrategies.length)];
  }

  _trackGeneration(data) {
    this.generationHistory.push(data);
    if (this.generationHistory.length > this.maxHistory) {
      this.generationHistory.shift();
    }
  }

  /**
   * Get generation statistics
   */
  getStats() {
    return {
      totalGenerations: this.generationHistory.length,
      averageScore: this.generationHistory.length > 0
        ? this.generationHistory.reduce((a, b) => a + (b.bestScore || 0), 0) / this.generationHistory.length
        : 0,
      recentGenerations: this.generationHistory.slice(-10)
    };
  }

  /**
   * Reset generation history
   */
  resetHistory() {
    this.generationHistory = [];
  }
}

export default IntelligencePipeline;
