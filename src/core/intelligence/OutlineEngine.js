/**
 * OutlineEngine
 * Generates structured outlines before writing
 * Ensures every caption has proper structure
 */

export class OutlineEngine {
  constructor() {
    this.outlineTemplates = this._buildTemplates();
  }

  /**
   * Build outline templates
   */
  _buildTemplates() {
    return {
      // Educational: explain → example → advice
      educational: {
        name: 'Educational',
        description: 'Teach something specific',
        sections: ['hook', 'concept', 'explanation', 'example', 'lesson', 'cta'],
        sectionConfigs: {
          hook: { type: 'surprising', length: 'short' },
          concept: { type: 'insight', length: 'medium' },
          explanation: { type: 'educational', length: 'medium' },
          example: { type: 'example', length: 'medium' },
          lesson: { type: 'tip', length: 'short' },
          cta: { type: 'action', length: 'short' }
        }
      },

      // Storytelling: hook → story → lesson
      storytelling: {
        name: 'Storytelling',
        description: 'Share a narrative experience',
        sections: ['hook', 'setup', 'challenge', 'resolution', 'lesson', 'cta'],
        sectionConfigs: {
          hook: { type: 'emotional', length: 'short' },
          setup: { type: 'context', length: 'short' },
          challenge: { type: 'struggle', length: 'medium' },
          resolution: { type: 'breakthrough', length: 'medium' },
          lesson: { type: 'insight', length: 'medium' },
          cta: { type: 'reflection', length: 'short' }
        }
      },

      // Myth-bust: myth → truth → proof
      mythBust: {
        name: 'Myth Bust',
        description: 'Correct a common misconception',
        sections: ['hook', 'myth', 'truth', 'explanation', 'evidence', 'cta'],
        sectionConfigs: {
          hook: { type: 'controversial', length: 'short' },
          myth: { type: 'myth', length: 'short' },
          truth: { type: 'reframe', length: 'medium' },
          explanation: { type: 'educational', length: 'medium' },
          evidence: { type: 'example', length: 'medium' },
          cta: { type: 'share', length: 'short' }
        }
      },

      // How-to: problem → solution → steps
      howTo: {
        name: 'How-To',
        description: 'Guide through a process',
        sections: ['hook', 'problem', 'solution', 'steps', 'example', 'cta'],
        sectionConfigs: {
          hook: { type: 'pain_point', length: 'short' },
          problem: { type: 'struggle', length: 'short' },
          solution: { type: 'insight', length: 'medium' },
          steps: { type: 'practical', length: 'medium' },
          example: { type: 'example', length: 'medium' },
          cta: { type: 'action', length: 'short' }
        }
      },

      // Comparison: compare → contrast → verdict
      comparison: {
        name: 'Comparison',
        description: 'Compare two approaches',
        sections: ['hook', 'optionA', 'optionB', 'comparison', 'verdict', 'cta'],
        sectionConfigs: {
          hook: { type: 'question', length: 'short' },
          optionA: { type: 'fact', length: 'medium' },
          optionB: { type: 'fact', length: 'medium' },
          comparison: { type: 'comparison', length: 'medium' },
          verdict: { type: 'insight', length: 'medium' },
          cta: { type: 'thoughts', length: 'short' }
        }
      },

      // Insight: observation → insight → implication
      insight: {
        name: 'Insight',
        description: 'Share a unique perspective',
        sections: ['hook', 'observation', 'insight', 'implication', 'example', 'cta'],
        sectionConfigs: {
          hook: { type: 'surprising', length: 'short' },
          observation: { type: 'fact', length: 'medium' },
          insight: { type: 'reframe', length: 'medium' },
          implication: { type: 'pattern', length: 'short' },
          example: { type: 'example', length: 'medium' },
          cta: { type: 'reflect', length: 'short' }
        }
      },

      // Problem-solution: pain → cause → fix
      problemSolution: {
        name: 'Problem-Solution',
        description: 'Address a specific problem',
        sections: ['hook', 'pain', 'cause', 'solution', 'result', 'cta'],
        sectionConfigs: {
          hook: { type: 'pain_point', length: 'short' },
          pain: { type: 'emotional', length: 'short' },
          cause: { type: 'mistake', length: 'medium' },
          solution: { type: 'tip', length: 'medium' },
          result: { type: 'transformation', length: 'medium' },
          cta: { type: 'action', length: 'short' }
        }
      },

      // Opinion: stance → reasoning → conclusion
      opinion: {
        name: 'Opinion',
        description: 'Share a viewpoint',
        sections: ['hook', 'stance', 'reasoning', 'example', 'counter', 'cta'],
        sectionConfigs: {
          hook: { type: 'controversial', length: 'short' },
          stance: { type: 'contrarian', length: 'short' },
          reasoning: { type: 'insight', length: 'medium' },
          example: { type: 'example', length: 'medium' },
          counter: { type: 'reframe', length: 'short' },
          cta: { type: 'comment', length: 'short' }
        }
      },

      // Listicle: hook → items → summary
      listicle: {
        name: 'List',
        description: 'Share multiple tips or points',
        sections: ['hook', 'intro', 'items', 'summary', 'cta'],
        sectionConfigs: {
          hook: { type: 'surprising', length: 'short' },
          intro: { type: 'context', length: 'short' },
          items: { type: 'tip', length: 'medium' },
          summary: { type: 'insight', length: 'short' },
          cta: { type: 'save', length: 'short' }
        }
      },

      // Quick tip: tip → why → how
      quickTip: {
        name: 'Quick Tip',
        description: 'Share actionable advice fast',
        sections: ['hook', 'tip', 'why', 'how', 'result'],
        sectionConfigs: {
          hook: { type: 'tip', length: 'short' },
          tip: { type: 'practical', length: 'short' },
          why: { type: 'insight', length: 'short' },
          how: { type: 'example', length: 'medium' },
          result: { type: 'outcome', length: 'short' }
        }
      }
    };
  }

  /**
   * Generate outline based on strategy
   */
  generateOutline(observations, options = {}) {
    const { strategy = 'auto', goal = 'engage', personality = 'default' } = options;

    // Select strategy
    const selectedStrategy = strategy === 'auto' 
      ? this._selectStrategyForGoal(goal, personality)
      : strategy;

    const template = this.outlineTemplates[selectedStrategy] || this.outlineTemplates.insight;

    // Build outline
    const outline = {
      strategy: selectedStrategy,
      name: template.name,
      description: template.description,
      sections: []
    };

    // Assign observations to sections
    const usedObservations = new Set();
    let obsIndex = 0;

    template.sections.forEach(sectionName => {
      const config = template.sectionConfigs[sectionName];
      
      // Find matching observation
      let observation = null;
      
      // Try to find by type preference
      if (config.type && observations.length > 0) {
        observation = observations.find(obs => 
          obs.type === config.type && !usedObservations.has(obs.text)
        );
        
        if (observation) {
          usedObservations.add(observation.text);
        }
      }

      // Fallback to next unused
      if (!observation && obsIndex < observations.length) {
        observation = observations[obsIndex];
        obsIndex++;
        while (observation && usedObservations.has(observation.text) && obsIndex < observations.length) {
          obsIndex++;
          observation = observations[obsIndex];
        }
      }

      outline.sections.push({
        name: sectionName,
        type: config.type,
        length: config.length,
        observation: observation,
        content: null // Will be filled by writer
      });
    });

    return outline;
  }

  /**
   * Select strategy based on goal and personality
   */
  _selectStrategyForGoal(goal, personality) {
    const goalStrategies = {
      educate: ['educational', 'howTo', 'quickTip'],
      entertain: ['storytelling', 'opinion', 'listicle'],
      inspire: ['storytelling', 'insight', 'problemSolution'],
      sell: ['howTo', 'problemSolution', 'quickTip'],
      engage: ['insight', 'opinion', 'storytelling'],
      'generate comments': ['opinion', 'question', 'mythBust'],
      'generate shares': ['surprising', 'insight', 'listicle'],
      'generate saves': ['educational', 'howTo', 'quickTip']
    };

    const strategies = goalStrategies[goal] || goalStrategies.engage;
    return strategies[Math.floor(Math.random() * strategies.length)];
  }

  /**
   * Get available strategies
   */
  getStrategies() {
    return Object.entries(this.outlineTemplates).map(([key, template]) => ({
      key,
      name: template.name,
      description: template.description
    }));
  }

  /**
   * Get strategy info
   */
  getStrategyInfo(strategy) {
    return this.outlineTemplates[strategy] || null;
  }
}

export default OutlineEngine;
