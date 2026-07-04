/**
 * OpinionEngine
 * Generates viewpoints, opinions, and contrarian angles
 * Captions with opinions generate significantly higher engagement
 */

export class OpinionEngine {
  constructor(topicPacks) {
    this.topicPacks = topicPacks;
  }

  /**
   * Generate opinions for a topic
   */
  generateOpinions(topic, options = {}) {
    const {
      count = 8,
      controversial = true,
      types = ['unpopular', 'misconception', 'underrated', 'overrated', 'mistake', 'lesson', 'surprising', 'contrarian']
    } = options;

    const opinions = [];
    const pack = this.topicPacks?.getPack(topic);

    // Generate based on pack data
    if (pack?.misconceptions) {
      pack.misconceptions.forEach(mis => {
        opinions.push({
          type: 'misconception',
          statement: mis.myth,
          counter: mis.truth,
          angle: 'myth_bust',
          confidence: 0.9,
          engagement: 'high'
        });
      });
    }

    if (pack?.beginnerMistakes) {
      pack.beginnerMistakes.slice(0, 2).forEach(mistake => {
        opinions.push({
          type: 'mistake',
          statement: mistake,
          angle: 'warning',
          confidence: 0.85,
          engagement: 'medium'
        });
      });
    }

    // Generate additional opinions
    types.forEach(type => {
      const opinion = this._generateSingleOpinion(topic, type, pack);
      if (opinion && !this._isDuplicate(opinion, opinions)) {
        opinions.push(opinion);
      }
    });

    // Fill with generic opinions
    while (opinions.length < count) {
      const type = types[opinions.length % types.length];
      const opinion = this._generateSingleOpinion(topic, type, pack);
      if (opinion && !this._isDuplicate(opinion, opinions)) {
        opinions.push(opinion);
      }
    }

    // Rank by engagement potential
    return this._rankOpinions(opinions).slice(0, count);
  }

  /**
   * Generate a single opinion
   */
  _generateSingleOpinion(topic, type, pack) {
    const generators = {
      unpopular: () => this._generateUnpopularOpinion(topic),
      misconception: () => this._generateMisconception(topic, pack),
      underrated: () => this._generateUnderratedOpinion(topic),
      overrated: () => this._generateOverratedOpinion(topic),
      mistake: () => this._generateMistakeOpinion(topic, pack),
      lesson: () => this._generateLessonOpinion(topic, pack),
      surprising: () => this._generateSurprisingOpinion(topic, pack),
      contrarian: () => this._generateContrarianOpinion(topic)
    };

    const generator = generators[type];
    return generator ? generator() : null;
  }

  _generateUnpopularOpinion(topic) {
    const opinions = [
      {
        statement: `${topic} is overrated and here\'s why`,
        angle: 'contrarian',
        supporting: 'Most people focus on the wrong aspects',
        confidence: 0.65,
        engagement: 'very_high'
      },
      {
        statement: `Stop treating ${topic} like it\'s special. It\'s not.`,
        angle: 'controversial',
        supporting: 'The basics matter more than the hype',
        confidence: 0.6,
        engagement: 'very_high'
      },
      {
        statement: `The ${topic} obsession is a distraction`,
        angle: 'reframe',
        supporting: 'Focus on outcomes, not methods',
        confidence: 0.65,
        engagement: 'high'
      },
      {
        statement: `You don\'t need to optimize ${topic}. You need to simplify it.`,
        angle: 'contrarian',
        supporting: 'Complexity is the enemy of progress',
        confidence: 0.7,
        engagement: 'high'
      },
      {
        statement: `Most ${topic} advice is written by people who don\'t actually do it`,
        angle: 'controversial',
        supporting: 'Theory vs practice gap',
        confidence: 0.6,
        engagement: 'very_high'
      }
    ];

    return opinions[Math.floor(Math.random() * opinions.length)];
  }

  _generateMisconception(topic, pack) {
    if (pack?.misconceptions?.[0]) {
      const mis = pack.misconceptions[0];
      return {
        type: 'misconception',
        statement: mis.myth,
        counter: mis.truth,
        angle: 'myth_bust',
        confidence: 0.9,
        engagement: 'high'
      };
    }

    const misconceptions = [
      {
        statement: `${topic} requires natural talent`,
        counter: `${topic} is a skill that can be learned`,
        angle: 'myth_bust',
        confidence: 0.8,
        engagement: 'high'
      },
      {
        statement: `More ${topic} practice is always better`,
        counter: `Quality of practice matters more than quantity`,
        angle: 'myth_bust',
        confidence: 0.75,
        engagement: 'medium'
      }
    ];

    return misconceptions[Math.floor(Math.random() * misconceptions.length)];
  }

  _generateUnderratedOpinion(topic) {
    const opinions = [
      {
        statement: `The most underrated ${topic} strategy nobody talks about`,
        angle: 'insider',
        supporting: 'Simple approaches often work best',
        confidence: 0.7,
        engagement: 'high'
      },
      {
        statement: `What nobody tells you about ${topic}`,
        angle: 'revelation',
        supporting: 'The hidden truth that changes everything',
        confidence: 0.75,
        engagement: 'very_high'
      },
      {
        statement: `The ${topic} aspect no one considers`,
        angle: 'insider',
        supporting: 'A fresh perspective on a familiar topic',
        confidence: 0.7,
        engagement: 'high'
      },
      {
        statement: `Stop overlooking this ${topic} principle`,
        angle: 'correction',
        supporting: 'What the experts miss',
        confidence: 0.7,
        engagement: 'high'
      }
    ];

    return opinions[Math.floor(Math.random() * opinions.length)];
  }

  _generateOverratedOpinion(topic) {
    const opinions = [
      {
        statement: `Why the ${topic} trend is actually harmful`,
        angle: 'contrarian',
        supporting: 'Follow the crowd or think for yourself',
        confidence: 0.55,
        engagement: 'very_high'
      },
      {
        statement: `Stop falling for ${topic} hype`,
        angle: 'debunk',
        supporting: 'What they don\'t want you to know',
        confidence: 0.6,
        engagement: 'very_high'
      },
      {
        statement: `The ${topic} industry is misleading you`,
        angle: 'controversial',
        supporting: 'Follow the money to find the truth',
        confidence: 0.5,
        engagement: 'very_high'
      }
    ];

    return opinions[Math.floor(Math.random() * opinions.length)];
  }

  _generateMistakeOpinion(topic, pack) {
    if (pack?.beginnerMistakes?.[0]) {
      const mistake = pack.beginnerMistakes[0];
      return {
        type: 'mistake',
        statement: `The #1 mistake people make with ${topic}`,
        detail: mistake,
        angle: 'warning',
        confidence: 0.85,
        engagement: 'high'
      };
    }

    const mistakes = [
      {
        statement: `The biggest ${topic} mistake nobody warns you about`,
        angle: 'warning',
        supporting: 'How to avoid it',
        confidence: 0.8,
        engagement: 'high'
      },
      {
        statement: `Why your ${topic} approach is failing`,
        angle: 'diagnostic',
        supporting: 'The root cause no one discusses',
        confidence: 0.75,
        engagement: 'very_high'
      }
    ];

    return mistakes[Math.floor(Math.random() * mistakes.length)];
  }

  _generateLessonOpinion(topic, pack) {
    if (pack?.expertTips?.[0]) {
      const tip = pack.expertTips[0];
      return {
        type: 'lesson',
        statement: `The ${topic} lesson I wish I learned sooner`,
        insight: tip,
        angle: 'story',
        confidence: 0.8,
        engagement: 'high'
      };
    }

    const lessons = [
      {
        statement: `The ${topic} lesson nobody teaches`,
        angle: 'missing',
        supporting: 'What would change everything',
        confidence: 0.7,
        engagement: 'high'
      },
      {
        statement: `The surprising lesson about ${topic}`,
        angle: 'revelation',
        supporting: 'Counterintuitive but true',
        confidence: 0.75,
        engagement: 'high'
      }
    ];

    return lessons[Math.floor(Math.random() * lessons.length)];
  }

  _generateSurprisingOpinion(topic, pack) {
    const opinions = [
      {
        statement: `The truth about ${topic} nobody admits`,
        angle: 'revelation',
        supporting: 'What you\'ve been missing',
        confidence: 0.7,
        engagement: 'very_high'
      },
      {
        statement: `Here\'s what actually works for ${topic}`,
        angle: 'insider',
        supporting: 'Not what you\'d expect',
        confidence: 0.75,
        engagement: 'very_high'
      },
      {
        statement: `The ${topic} secret nobody talks about`,
        angle: 'mystery',
        supporting: 'Finally revealed',
        confidence: 0.65,
        engagement: 'very_high'
      }
    ];

    return opinions[Math.floor(Math.random() * opinions.length)];
  }

  _generateContrarianOpinion(topic) {
    const opinions = [
      {
        statement: `Hot take: Stop focusing on ${topic}`,
        angle: 'contrarian',
        supporting: 'Here\'s what actually matters',
        confidence: 0.6,
        engagement: 'very_high'
      },
      {
        statement: `Unpopular opinion: ${topic} doesn\'t matter as much as you think`,
        angle: 'contrarian',
        supporting: 'The real priority',
        confidence: 0.55,
        engagement: 'very_high'
      },
      {
        statement: `Why I disagree with most ${topic} advice`,
        angle: 'debate',
        supporting: 'And what I do instead',
        confidence: 0.6,
        engagement: 'very_high'
      }
    ];

    return opinions[Math.floor(Math.random() * opinions.length)];
  }

  /**
   * Rank opinions by engagement potential
   */
  _rankOpinions(opinions) {
    const engagementScore = {
      'very_high': 3,
      'high': 2,
      'medium': 1
    };

    return opinions.map(opinion => ({
      ...opinion,
      rankScore: (opinion.confidence || 0.5) + (engagementScore[opinion.engagement] || 0) * 0.3
    })).sort((a, b) => b.rankScore - a.rankScore);
  }

  /**
   * Check for duplicates
   */
  _isDuplicate(opinion, existing) {
    const statement = opinion.statement?.toLowerCase() || '';
    return existing.some(existing => 
      existing.statement?.toLowerCase().includes(statement.substring(0, 30)) ||
      statement.includes(existing.statement?.toLowerCase().substring(0, 30))
    );
  }

  /**
   * Get opinion for caption
   */
  getOpinionForCaption(topic, options = {}) {
    const opinions = this.generateOpinions(topic, { ...options, count: 5 });
    return opinions[0] || this._generateSingleOpinion(topic, 'unpopular');
  }
}

export default OpinionEngine;
