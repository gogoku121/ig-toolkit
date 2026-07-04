/**
 * Reasoning Engine
 * Internal reasoning system that answers strategic questions before content generation
 * Guides content strategy without exposing reasoning in final output
 */

/**
 * ReasoningEngine
 * Analyzes context and generates strategic guidance for content creation
 */
export class ReasoningEngine {
  constructor() {
    this.reasoningCache = new Map();
    this.reasoningHistory = [];
  }

  /**
   * Perform comprehensive reasoning before generation
   * @param {Object} context - Generation context
   * @returns {Object} Strategic reasoning decisions
   */
  analyze(context = {}) {
    const {
      topic,
      entity,
      category,
      personality,
      goal,
      audience
    } = context;

    const reasoning = {
      whyCare: this._whyWouldSomeoneCare(topic, entity, category),
      problemSolved: this._whatProblemDoesItSolve(topic, entity, category),
      misconception: this._whatMisconceptionExists(topic, entity, category),
      surprisingElement: this._whatIsSurprising(topic, entity, category),
      controversialAngle: this._whatIsControversial(topic, entity, category),
      saveTriggers: this._whatMakesSomeoneSave(topic, entity, category, goal),
      commentTriggers: this._whatMakesSomeoneComment(topic, entity, category),
      desiredEmotion: this._whatEmotionShouldThisCreate(topic, entity, goal),
      action: this._whatActionShouldReadersTake(topic, entity, goal),
      contentAngle: this._selectContentAngle(topic, entity, category, goal),
      hookStrategy: this._selectHookStrategy(topic, entity, category, goal),
      structureRecommendation: this._recommendStructure(topic, entity, goal)
    };

    // Cache and track reasoning
    const cacheKey = `${topic}-${goal}-${audience}`;
    this.reasoningCache.set(cacheKey, reasoning);
    this.reasoningHistory.push({
      topic,
      entity: entity?.name,
      goal,
      timestamp: Date.now()
    });

    return reasoning;
  }

  /**
   * Why would someone care about this topic?
   */
  _whyWouldSomeoneCare(topic, entity, category) {
    if (entity) {
      return {
        primary: `${entity.name} solves a real problem for real people.`,
        angles: [
          `People want to understand how ${entity.name} fits into their lives`,
          `Fear of missing out on something valuable`,
          `Practical value: saves time, money, or effort`,
          `Social currency: knowing this makes them interesting`
        ],
        headline: `The ${entity.name} thing you need to understand`
      };
    }

    // Category-based reasoning
    const categoryAngles = {
      travel: 'People crave new experiences, escape from routine, and stories. Travel content offers escapism, practical tips, and inspiration for their next adventure.',
      fitness: 'People want to feel better, look better, and have more energy. Fitness content offers transformation hope, expert guidance, and community belonging.',
      business: 'People want to succeed, earn more, and work less. Business content offers strategies, case studies, and competitive advantages.',
      technology: 'People want to work smarter, stay current, and leverage tools. Tech content offers efficiency gains, competitive edges, and future-proofing.',
      food: 'People eat multiple times daily - food is universal. Food content offers taste, health, culture, and creative expression.',
      marketing: 'People want their message to land. Marketing content offers reach, influence, and business growth.',
      ai: 'AI is transforming every industry. People want to understand, leverage, and not fall behind.',
      finance: 'Money enables freedom. People want to earn more, save more, and stress less about finances.',
      lifestyle: 'People want to live better, feel fulfilled, and maximize their limited time on earth.',
      productivity: 'Time is the great equalizer. People want more done in less time with less stress.'
    };

    const categoryReasoning = categoryAngles[category] || 'Content that entertains, educates, or inspires usually resonates.';

    return {
      primary: categoryReasoning,
      angles: [
        'Saves time or money',
        'Avoids a mistake',
        'Achieves a desired outcome',
        'Belongs to a community',
        'Gains competitive advantage'
      ],
      headline: `Everything you need to know about ${topic}`
    };
  }

  /**
   * What problem does it solve?
   */
  _whatProblemDoesItSolve(topic, entity, category) {
    if (entity) {
      return {
        problem: entity.painPoints[0] || 'Information overload and decision fatigue',
        solution: entity.benefits[0] || 'Clarity and actionable guidance',
        framing: `Here's how ${entity.name} addresses ${entity.painPoints[0] || 'the core challenge'}`
      };
    }

    // Generic category problems
    const categoryProblems = {
      travel: {
        problem: 'Fear of wasting money on bad trips or not knowing where to start',
        solution: 'Confidence in planning and the promise of memorable experiences',
        framing: 'Stop making these travel mistakes'
      },
      fitness: {
        problem: 'Not seeing results despite effort, lack of motivation, confusion about what works',
        solution: 'Proven systems, motivation, and clarity on what actually produces results',
        framing: 'The fitness truth they don\'t want you to know'
      },
      business: {
        problem: 'Leaving money on the table, growth plateaus, operational chaos',
        solution: 'Strategies that move the needle, systems that scale, insights from those who\'ve done it',
        framing: 'The business hack that 10x\'d our revenue'
      },
      technology: {
        problem: 'Overwhelm from options, wasted time on manual processes, falling behind',
        solution: 'The right tools, streamlined workflows, competitive advantages',
        framing: 'The tool that changed everything'
      },
      food: {
        problem: 'Meal boredom, healthy eating confusion, lack of time for cooking',
        solution: 'Delicious recipes, nutrition clarity, time-saving techniques',
        framing: 'This recipe changed how I eat'
      },
      ai: {
        problem: 'Not knowing how to leverage AI effectively, fear of being left behind',
        solution: 'Practical AI applications, prompt mastery, workflow integration',
        framing: 'How to actually use AI (not just what it is)'
      },
      default: {
        problem: 'Information overwhelm and decision paralysis',
        solution: 'Clarity, proven approaches, and actionable steps',
        framing: `The truth about ${topic}`
      }
    };

    const problemData = categoryProblems[category] || categoryProblems.default;
    return {
      problem: problemData.problem,
      solution: problemData.solution,
      framing: problemData.framing
    };
  }

  /**
   * What misconception exists about this topic?
   */
  _whatMisconceptionExists(topic, entity, category) {
    if (entity) {
      return {
        misconception: entity.misconceptions[0] || 'Most people get this completely wrong',
        truth: `The reality is more nuanced: ${entity.benefits[0] || 'context matters'}`
      };
    }

    // Generic misconceptions by category
    const misconceptions = {
      travel: [
        { misconception: 'Travel is always expensive', truth: 'With proper planning, you can travel on any budget' },
        { misconception: 'You need weeks off to travel', truth: 'A 3-day trip can be transformative' }
      ],
      fitness: [
        { misconception: 'No pain, no gain', truth: 'Progress without pain is possible and more sustainable' },
        { misconception: 'You need a gym', truth: 'Bodyweight training can get you incredibly fit' }
      ],
      business: [
        { misconception: 'You need to work 80 hours', truth: 'Working smarter and systems beats brute force' },
        { misconception: 'You need a big budget to market', truth: 'Content marketing can compete with big budgets' }
      ],
      technology: [
        { misconception: 'Newer is always better', truth: 'Mastering what you have beats constantly switching' },
        { misconception: 'You need every tool', truth: 'Integration and consistency beat having 50 half-used tools' }
      ],
      ai: [
        { misconception: 'AI will replace your job', truth: 'AI amplifies skills; those who use it replace those who don\'t' },
        { misconception: 'You need to be technical', truth: 'Natural language is the new coding' }
      ],
      default: [
        { misconception: 'There\'s a secret shortcut', truth: 'Consistency beats perfection every time' },
        { misconception: 'One size fits all', truth: 'Your context matters; find what works for you' }
      ]
    };

    const categoryMisconceptions = misconceptions[category] || misconceptions.default;
    const selected = categoryMisconceptions[Math.floor(Math.random() * categoryMisconceptions.length)];

    return {
      misconception: selected.misconception,
      truth: selected.truth
    };
  }

  /**
   * What is surprising about this topic?
   */
  _whatIsSurprising(topic, entity, category) {
    if (entity) {
      return {
        surprise: entity.trends[0] || 'The direction the industry is heading might shock you',
        hook: `The ${entity.name} trend nobody sees coming`
      };
    }

    const surprises = [
      'What the data actually shows vs. what everyone thinks',
      'The unexpected group that\'s adopting this fastest',
      'Why the old advice might be wrong in 2024',
      'The compound effect nobody calculates',
      'The counterintuitive approach that actually works'
    ];

    return {
      surprise: surprises[Math.floor(Math.random() * surprises.length)],
      hook: `The surprising truth about ${topic}`
    };
  }

  /**
   * What could be controversial?
   */
  _whatIsControversial(topic, entity, category) {
    if (entity) {
      return {
        hotTake: `Controversial opinion: ${entity.name} ${entity.misconceptions[2] || 'is misunderstood'}`,
        why: 'Different perspectives create engagement and discussion'
      };
    }

    const hotTakes = {
      travel: 'The best trips are the ones that go completely wrong',
      fitness: 'Gym culture is dying; home workouts are the future',
      business: 'Social media marketing is mostly a waste for most businesses',
      technology: 'Most productivity apps make you less productive',
      ai: 'ChatGPT won\'t replace writers, but writers who use ChatGPT will replace those who don\'t',
      food: 'Restaurant food is often worse for you than home cooking',
      finance: 'Cutting expenses is more powerful than increasing income',
      default: `The popular opinion about ${topic} might be completely wrong`
    };

    return {
      hotTake: hotTakes[category] || hotTakes.default,
      why: 'Contrarian viewpoints generate engagement and sharing'
    };
  }

  /**
   * What makes someone save this post?
   */
  _whatMakesSomeoneSave(topic, entity, category, goal) {
    if (goal === 'generate saves') {
      return {
        triggers: [
          'Comprehensive checklist or guide',
          'Resource they\'ll need later',
          'Step-by-step process they\'ll use',
          'Practical template they can apply',
          'Stats or data worth referencing'
        ],
        priority: 'HIGH - Optimize for future utility'
      };
    }

    return {
      triggers: [
        'Actionable steps they can implement immediately',
        'Comprehensive resource they\'ll reference again',
        'Template or framework they\'ll use repeatedly',
        'Statistical data worth citing',
        'Curated collection of tips'
      ],
      priority: 'MEDIUM - Include save-worthy elements'
    };
  }

  /**
   * What makes someone comment?
   */
  _whatMakesSomeoneComment(topic, entity, category, goal) {
    if (goal === 'generate comments') {
      return {
        triggers: [
          'Direct question at the end',
          'Polarizing statement to agree/disagree',
          'Request for their experience',
          'Either/or scenario',
          'Completing a sentence starter'
        ],
        priority: 'HIGH - Build in engagement hooks'
      };
    }

    return {
      triggers: [
        'Relatable struggle mentioned',
        'Asking for agreement or disagreement',
        'Request for personal experience',
        'Hot take others might debate',
        'Question that invites expertise sharing'
      ],
      priority: 'LOW - Natural comment bait is sufficient'
    };
  }

  /**
   * What emotion should this post create?
   */
  _whatEmotionShouldThisCreate(topic, entity, goal) {
    const goalEmotions = {
      educate: { primary: 'curiosity', secondary: 'satisfaction', description: 'Eureka moments and practical value' },
      entertain: { primary: 'amusement', secondary: 'surprise', description: 'Delight and entertainment' },
      inspire: { primary: 'motivation', secondary: 'hope', description: 'Fire to take action' },
      sell: { primary: 'desire', secondary: 'trust', description: 'Want and confidence to buy' },
      'build trust': { primary: 'respect', secondary: 'confidence', description: 'Expertise and reliability' },
      'generate comments': { primary: 'engagement', secondary: 'curiosity', description: 'Want to share opinion' },
      'generate shares': { primary: 'pride', secondary: 'usefulness', description: 'Want to help others' },
      'generate saves': { primary: 'anticipation', secondary: 'practicality', description: 'Future value' },
      engage: { primary: 'interest', secondary: 'connection', description: 'Want to read more' }
    };

    return goalEmotions[goal] || goalEmotions.engage;
  }

  /**
   * What action should readers take?
   */
  _whatActionShouldReadersTake(topic, entity, goal) {
    const goalActions = {
      educate: 'Apply what they learned and report back',
      entertain: 'Share with someone who needs this',
      inspire: 'Take the first step today',
      sell: 'Click the link in bio',
      'build trust': 'Follow for more insights',
      'generate comments': 'Share your take below',
      'generate shares': 'Tag someone who needs to see this',
      'generate saves': 'Save this post for later',
      engage: 'Follow for more content like this'
    };

    return goalActions[goal] || goalActions.engage;
  }

  /**
   * Select the best content angle
   */
  _selectContentAngle(topic, entity, category, goal) {
    // Entity-specific angles
    if (entity) {
      return {
        primary: 'product-focus',
        options: [
          'How-to guide using entity',
          'Comparison with alternatives',
          'Myth-busting about entity',
          'Behind-the-scenes or honest review',
          'Success stories or case studies'
        ]
      };
    }

    // Goal-based angles
    const goalAngles = {
      educate: [
        'Step-by-step guide',
        'Comprehensive overview',
        'Beginner\'s breakdown',
        'Expert deep-dive',
        'Common mistakes to avoid'
      ],
      entertain: [
        'Unexpected angle',
        'Story-driven narrative',
        'Surprising statistics',
        'Contrast and comparison',
        'Day-in-the-life format'
      ],
      inspire: [
        'Transformation journey',
        'Overcoming obstacles',
        'Lessons from failure',
        'Secret to success',
        'Why this matters deeply'
      ],
      sell: [
        'Problem-aware solution',
        'Social proof and results',
        'Limited time or exclusivity',
        'Unique value proposition',
        'Risk-reversal guarantee'
      ],
      default: [
        'Practical how-to',
        'Myth vs reality',
        'Top tips countdown',
        'Behind the scenes',
        'Honest review or guide'
      ]
    };

    const angles = goalAngles[goal] || goalAngles.default;
    return {
      primary: 'expert-guide',
      options: angles
    };
  }

  /**
   * Select hook strategy
   */
  _selectHookStrategy(topic, entity, category, goal) {
    const strategies = [
      {
        type: 'curiosity-gap',
        template: 'The thing about {topic} nobody tells you',
        when: 'Best for curious audiences'
      },
      {
        type: 'transformation',
        template: 'How I {achievement} with {topic}',
        when: 'Personal authority'
      },
      {
        type: 'stat-shock',
        template: '{number}% of people get this wrong about {topic}',
        when: 'Data-driven audiences'
      },
      {
        type: 'contrarian',
        template: 'Hot take: {controversial-opinion}',
        when: 'Engagement goals'
      },
      {
        type: 'pov',
        template: 'POV: You finally understand {topic}',
        when: 'Gen Z, relatable'
      },
      {
        type: 'question',
        template: 'What if I told you {topic} could {benefit}?',
        when: 'Problem-aware audiences'
      }
    ];

    return {
      recommended: strategies[Math.floor(Math.random() * strategies.length)],
      alternatives: strategies,
      reasoning: 'Choose based on audience familiarity and goal'
    };
  }

  /**
   * Recommend content structure
   */
  _recommendStructure(topic, entity, goal) {
    const structures = {
      educate: ['Hook', 'Problem statement', 'Key insight 1', 'Key insight 2', 'Key insight 3', 'Actionable takeaways', 'CTA'],
      entertain: ['Hook', 'Setup', 'Build tension', 'Payoff', 'Share trigger', 'CTA'],
      inspire: ['Hook', 'Struggle', 'Turning point', 'Triumph', 'Lesson', 'Inspiration', 'CTA'],
      sell: ['Hook', 'Problem', 'Solution intro', 'Feature benefits', 'Social proof', 'Urgency', 'CTA'],
      default: ['Hook', 'Main content', 'Supporting point', 'Key takeaway', 'CTA']
    };

    return {
      recommended: structures[goal] || structures.default,
      reasoning: 'Structure supports the goal by guiding emotional journey'
    };
  }

  /**
   * Get cached reasoning if available
   */
  getCached(topic, goal, audience) {
    const key = `${topic}-${goal}-${audience}`;
    return this.reasoningCache.get(key) || null;
  }

  /**
   * Clear reasoning history
   */
  clearHistory() {
    this.reasoningHistory = [];
    this.reasoningCache.clear();
  }
}

export default ReasoningEngine;
