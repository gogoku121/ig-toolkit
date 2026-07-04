/**
 * DebateEngine
 * Generates two opposing viewpoints
 * Decides whether to present one side, both sides, or balanced conclusion
 */

export class DebateEngine {
  constructor(topicPacks) {
    this.topicPacks = topicPacks;
  }

  /**
   * Generate debate for topic
   */
  generateDebate(topic, options = {}) {
    const {
      stance = 'auto', // 'pro', 'con', 'balanced', 'auto'
      count = 2
    } = options;

    const debates = [];

    // Generate topic-specific debates
    debates.push(...this._generateTopicDebates(topic));

    // Generate common debates
    debates.push(...this._generateCommonDebates(topic));

    // Select stance
    const selectedStance = stance === 'auto' 
      ? this._selectStance(debates)
      : stance;

    // Format debate based on stance
    const formatted = this._formatDebate(debates, selectedStance);

    return {
      topic,
      stance: selectedStance,
      debates: formatted.debates,
      conclusion: formatted.conclusion,
      recommendation: formatted.recommendation
    };
  }

  /**
   * Generate topic-specific debates
   */
  _generateTopicDebates(topic) {
    const pack = this.topicPacks?.getPack(topic);
    const debates = [];

    // From misconceptions
    if (pack?.misconceptions) {
      pack.misconceptions.forEach(mis => {
        debates.push({
          topic,
          pro: mis.truth,
          con: mis.myth,
          proScore: 85,
          conScore: 40,
          hasEvidence: true
        });
      });
    }

    // From comparisons
    if (pack?.comparisons) {
      pack.comparisons.forEach(comp => {
        debates.push({
          topic,
          pro: comp.betterFor,
          con: comp.versus,
          proScore: 70,
          conScore: 65,
          nuance: comp.nuance,
          hasEvidence: true
        });
      });
    }

    return debates;
  }

  /**
   * Generate common debates for any topic
   */
  _generateCommonDebates(topic) {
    const commonDebates = [
      {
        topic,
        pro: `More ${topic} is better - focus and intensity pay off`,
        con: `Less ${topic} is more - quality over quantity always wins`,
        proScore: 60,
        conScore: 70,
        nuance: 'Depends on skill level and goals'
      },
      {
        topic,
        pro: `${topic} requires natural talent to succeed`,
        con: `${topic} can be learned by anyone with dedication`,
        proScore: 30,
        conScore: 85,
        nuance: 'Both matter at different stages'
      },
      {
        topic,
        pro: `Traditional methods work best for ${topic}`,
        con: `Innovation and new approaches outperform tradition`,
        proScore: 55,
        conScore: 60,
        nuance: 'Best approach combines both'
      },
      {
        topic,
        pro: `${topic} should be done daily for best results`,
        con: `${topic} requires rest and recovery between sessions`,
        proScore: 65,
        conScore: 75,
        nuance: 'Balance depends on intensity'
      },
      {
        topic,
        pro: `Solo work produces better ${topic} results`,
        con: `Community and collaboration accelerate ${topic}`,
        proScore: 55,
        conScore: 70,
        nuance: 'Hybrid approaches often work best'
      }
    ];

    return commonDebates;
  }

  /**
   * Select appropriate stance
   */
  _selectStance(debates) {
    // Pick the debate with strongest evidence
    const strongest = debates.reduce((best, current) => {
      const currentEvidence = current.hasEvidence ? 100 : 0;
      const bestEvidence = best.hasEvidence ? 100 : 0;
      return currentEvidence > bestEvidence ? current : best;
    });

    // For high-evidence debates, go balanced
    if (strongest.hasEvidence && Math.abs(strongest.proScore - strongest.conScore) < 20) {
      return 'balanced';
    }

    // For clear winner, pick that side
    if (strongest.proScore > strongest.conScore + 15) {
      return 'pro';
    }
    if (strongest.conScore > strongest.proScore + 15) {
      return 'con';
    }

    // Default to balanced
    return 'balanced';
  }

  /**
   * Format debate based on stance
   */
  _formatDebate(debates, stance) {
    const selected = debates[0];
    let formattedDebates = [];
    let conclusion = '';
    let recommendation = '';

    switch (stance) {
      case 'pro':
        formattedDebates = [
          {
            side: 'pro',
            viewpoint: selected.pro,
            score: selected.proScore
          }
        ];
        conclusion = `After considering both sides, ${selected.pro.toLowerCase()}`;
        recommendation = selected.pro;
        break;

      case 'con':
        formattedDebates = [
          {
            side: 'con',
            viewpoint: selected.con,
            score: selected.conScore
          }
        ];
        conclusion = `Despite the appeal of ${selected.pro.toLowerCase()}, ${selected.con.toLowerCase()}`;
        recommendation = selected.con;
        break;

      case 'balanced':
      default:
        formattedDebates = [
          {
            side: 'pro',
            viewpoint: selected.pro,
            score: selected.proScore
          },
          {
            side: 'con',
            viewpoint: selected.con,
            score: selected.conScore
          }
        ];
        
        // Generate balanced conclusion
        if (selected.nuance) {
          conclusion = selected.nuance;
        } else if (Math.abs(selected.proScore - selected.conScore) < 15) {
          conclusion = `Both approaches have merit. The best choice depends on your specific situation.`;
        } else {
          const winner = selected.proScore > selected.conScore ? selected.pro : selected.con;
          conclusion = `While both sides have points, ${winner.toLowerCase()} tends to work better in most cases.`;
        }
        
        recommendation = selected.proScore > selected.conScore ? selected.pro : selected.con;
        break;
    }

    return {
      debates: formattedDebates,
      conclusion,
      recommendation,
      originalDebate: selected
    };
  }

  /**
   * Get contrarian angle
   */
  getContrarianAngle(topic) {
    const debates = this._generateTopicDebates(topic).concat(this._generateCommonDebates(topic));
    
    // Find debate where conventional wisdom is wrong
    const contrarian = debates.find(d => d.conScore > d.proScore + 10);
    
    if (contrarian) {
      return {
        hotTake: `Unpopular opinion: ${contrarian.con}`,
        reasoning: `While most say ${contrarian.pro.toLowerCase()}, the truth is ${contrarian.con.toLowerCase()}.`,
        topic
      };
    }

    // Generic contrarian
    return {
      hotTake: `Hot take on ${topic}`,
      reasoning: `The conventional wisdom might be missing something important.`,
      topic
    };
  }

  /**
   * Generate debate for outline
   */
  generateForOutline(topic, options = {}) {
    const debate = this.generateDebate(topic, options);

    return {
      // For pro side outline
      pro: {
        hook: debate.debates[0]?.viewpoint,
        mainPoint: debate.recommendation,
        evidence: debate.originalDebate?.nuance
      },
      // For balanced outline
      balanced: {
        hook: `The ${topic} debate: both sides`,
        proPoint: debate.debates[0]?.viewpoint,
        conPoint: debate.debates[1]?.viewpoint,
        conclusion: debate.conclusion
      },
      // For contrarian outline
      contrarian: {
        hook: debate.debates.find(d => d.side === 'con')?.viewpoint || debate.debates[0]?.viewpoint,
        counter: debate.debates.find(d => d.side === 'pro')?.viewpoint,
        conclusion: debate.conclusion
      }
    };
  }
}

export default DebateEngine;
