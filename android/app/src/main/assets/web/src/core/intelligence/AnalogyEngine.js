/**
 * AnalogyEngine
 * Creates simple analogies, metaphors, and comparisons
 * Makes complex topics easier to understand
 */

export class AnalogyEngine {
  constructor(topicPacks) {
    this.topicPacks = topicPacks;
    
    // Analogy templates by topic
    this.analogyTemplates = this._buildTemplates();
  }

  /**
   * Build analogy templates
   */
  _buildTemplates() {
    return {
      ai: [
        {
          analogy: 'learning to drive',
          explanation: 'Just like learning to drive, you don\'t need to understand the engine to drive well. But understanding the basics helps you avoid crashes.',
          applicability: 0.9
        },
        {
          analogy: 'learning a language',
          explanation: 'Like learning a language, AI learns patterns. You don\'t memorize every sentence - you learn grammar and vocabulary that let you create new sentences.',
          applicability: 0.85
        },
        {
          analogy: 'muscle memory',
          explanation: 'Once you\'ve practiced something enough, your brain creates shortcuts. AI works similarly - it builds neural pathways through repetition.',
          applicability: 0.8
        },
        {
          analogy: 'a very eager intern',
          explanation: 'AI is like an eager intern who\'s read everything but hasn\'t experienced anything. Smart answers, no real-world judgment.',
          applicability: 0.9
        }
      ],
      business: [
        {
          analogy: 'gardening',
          explanation: 'Building a business is like gardening. You can\'t force growth - you create the right conditions and nurture consistently.',
          applicability: 0.85
        },
        {
          analogy: 'cooking',
          explanation: 'A good business plan is like a recipe - it guides you, but you adjust based on ingredients and taste as you go.',
          applicability: 0.8
        },
        {
          analogy: 'building blocks',
          explanation: 'Business growth is like building with blocks. You need a solid foundation before adding height.',
          applicability: 0.75
        }
      ],
      fitness: [
        {
          analogy: 'building a house',
          explanation: 'Fitness is like building a house. You need a solid foundation (form), quality materials (nutrition), and consistent work.',
          applicability: 0.9
        },
        {
          analogy: 'compound interest',
          explanation: 'Small consistent improvements in fitness are like compound interest. Each workout deposits tiny gains that accumulate dramatically.',
          applicability: 0.85
        },
        {
          analogy: 'language learning',
          explanation: 'Getting fit is like learning a language. Daily practice beats cramming. You won\'t notice daily progress, but you\'ll see it over months.',
          applicability: 0.8
        }
      ],
      marketing: [
        {
          analogy: 'dating',
          explanation: 'Marketing is like dating. You can\'t just pitch yourself - you need to build genuine interest and connection first.',
          applicability: 0.9
        },
        {
          analogy: 'storytelling',
          explanation: 'Your brand is a story. Just like any good story, it needs conflict, resolution, and characters people care about.',
          applicability: 0.85
        },
        {
          analogy: 'radio signals',
          explanation: 'Good marketing cuts through noise like a strong radio signal. Your message needs to be clear and persistent to be received.',
          applicability: 0.7
        }
      ],
      productivity: [
        {
          analogy: 'energy management',
          explanation: 'Think of energy like money. You have a daily budget. You can\'t borrow from tomorrow without consequences.',
          applicability: 0.9
        },
        {
          analogy: 'water flow',
          explanation: 'Focus is like water - it flows where you direct it. Try to split it and you get sprinkles everywhere instead of pressure.',
          applicability: 0.85
        },
        {
          analogy: 'tides',
          explanation: 'Productivity comes in waves. Work with the tide when it\'s high, rest when it\'s low. Fighting it exhausts you.',
          applicability: 0.75
        }
      ],
      default: [
        {
          analogy: 'icebergs',
          explanation: 'What you see is just 10%. The real work, learning, and growth happens beneath the surface.',
          applicability: 0.85
        },
        {
          analogy: 'climbing a mountain',
          explanation: 'Progress feels slow when you\'re in the valley looking up. But each step matters, even when you can\'t see the peak yet.',
          applicability: 0.8
        },
        {
          analogy: 'learning to ride a bike',
          explanation: 'You can\'t learn by watching. You have to get on, fall a few times, and eventually it becomes natural.',
          applicability: 0.85
        }
      ]
    };
  }

  /**
   * Generate analogies for a topic
   */
  generateAnalogies(topic, options = {}) {
    const {
      count = 3,
      type = 'all' // 'simple', 'extended', 'metaphor'
    } = options;

    const analogies = [];

    // Get topic-specific analogies
    const topicKey = topic.toLowerCase();
    const templates = this.analogyTemplates[topicKey] || this.analogyTemplates.default;

    templates.forEach(template => {
      analogies.push({
        ...template,
        topic,
        type: 'extended'
      });
    });

    // Generate simple comparisons
    if (type === 'simple' || type === 'all') {
      analogies.push(...this._generateSimpleAnalogies(topic));
    }

    // Generate metaphors
    if (type === 'metaphor' || type === 'all') {
      analogies.push(...this._generateMetaphors(topic));
    }

    // Rank by applicability
    const ranked = analogies
      .sort((a, b) => (b.applicability || 0.5) - (a.applicability || 0.5))
      .slice(0, count);

    return ranked;
  }

  /**
   * Generate simple analogies
   */
  _generateSimpleAnalogies(topic) {
    const simpleFormats = [
      { subject: `${topic}`, comparison: 'learning to swim', connector: 'is like' },
      { subject: `${topic}`, comparison: 'building muscle', connector: 'is like' },
      { subject: `${topic}`, comparison: 'a muscle', connector: 'is like' },
      { subject: `${topic}`, comparison: 'cooking', connector: 'is like' },
      { subject: `${topic}`, comparison: 'a journey', connector: 'is a' }
    ];

    return simpleFormats.slice(0, 3).map(format => ({
      type: 'simple',
      text: `${format.subject} ${format.connector} ${format.comparison}`,
      analogy: format.comparison,
      topic,
      applicability: 0.7
    }));
  }

  /**
   * Generate metaphors
   */
  _generateMetaphors(topic) {
    const metaphors = [
      { text: `${topic} is a double-edged sword`, applicable: 'both benefits and risks' },
      { text: `${topic} is a marathon, not a sprint`, applicable: 'long-term perspective needed' },
      { text: `${topic} is the foundation of success`, applicable: 'fundamental importance' },
      { text: `${topic} is the bridge between goals and results`, applicable: 'connecting action to outcomes' },
      { text: `${topic} is the secret ingredient`, applicable: 'often overlooked factor' }
    ];

    return metaphors.slice(0, 2).map(m => ({
      type: 'metaphor',
      text: m.text,
      explanation: m.applicable,
      analogy: m.text,
      topic,
      applicability: 0.65
    }));
  }

  /**
   * Create extended analogy
   */
  createExtendedAnalogy(topic, analogy, explanation) {
    return {
      type: 'extended',
      text: `${topic} is like ${analogy}.\n\n${explanation}`,
      analogy,
      explanation,
      topic,
      applicability: 0.85
    };
  }

  /**
   * Get best analogy for topic
   */
  getBestAnalogy(topic) {
    const analogies = this.generateAnalogies(topic, { count: 1 });
    return analogies[0] || null;
  }
}

export default AnalogyEngine;
