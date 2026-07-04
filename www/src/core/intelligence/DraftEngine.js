/**
 * DraftEngine
 * Intentional initial draft producer
 * Produces drafts that intentionally prioritize different aspects
 */

export class DraftEngine {
  constructor() {
    this.draftStyles = this._buildDraftStyles();
  }

  /**
   * Build draft styles
   */
  _buildDraftStyles() {
    return {
      insight_first: {
        name: 'Insight First',
        description: 'Start with the key insight, then explain',
        priority: ['insight', 'explanation', 'example', 'cta'],
        approach: 'lead_with_punch'
      },
      story_first: {
        name: 'Story First',
        description: 'Start with a narrative, then lesson',
        priority: ['story', 'challenge', 'resolution', 'lesson', 'cta'],
        approach: 'narrative_arc'
      },
      question_first: {
        name: 'Question First',
        description: 'Start with a question, then answer',
        priority: ['question', 'answer', 'example', 'cta'],
        approach: 'curiosity_hook'
      },
      contrarian_first: {
        name: 'Contrarian First',
        description: 'Lead with controversial take',
        priority: ['hot_take', 'evidence', 'nuance', 'cta'],
        approach: 'challenge_belief'
      },
      practical_first: {
        name: 'Practical First',
        description: 'Lead with actionable steps',
        priority: ['tip', 'how', 'example', 'cta'],
        approach: 'action_oriented'
      },
      mystery_first: {
        name: 'Mystery First',
        description: 'Create curiosity gap, then reveal',
        priority: ['gap', 'discovery', 'explanation', 'cta'],
        approach: 'information_gap'
      }
    };
  }

  /**
   * Generate initial draft with specific style
   */
  generateDraft(topic, options = {}) {
    const {
      style = 'insight_first',
      data = {}, // insights, evidence, questions, etc.
      personality = 'default'
    } = options;

    const draftConfig = this.draftStyles[style] || this.draftStyles.insight_first;
    
    const draft = {
      style,
      sections: [],
      rawContent: '',
      characteristics: {
        approach: draftConfig.approach,
        personality
      }
    };

    // Generate sections based on priority
    draftConfig.priority.forEach(sectionType => {
      const section = this._generateSection(sectionType, data, personality);
      if (section) {
        draft.sections.push(section);
      }
    });

    // Assemble raw draft
    draft.rawContent = this._assembleDraft(draft.sections, personality);

    return draft;
  }

  /**
   * Generate a single section
   */
  _generateSection(type, data, personality) {
    const generators = {
      insight: () => this._generateInsightSection(data),
      story: () => this._generateStorySection(data),
      challenge: () => this._generateChallengeSection(data),
      resolution: () => this._generateResolutionSection(data),
      question: () => this._generateQuestionSection(data),
      answer: () => this._generateAnswerSection(data),
      hot_take: () => this._generateHotTakeSection(data),
      evidence: () => this._generateEvidenceSection(data),
      nuance: () => this._generateNuanceSection(data),
      gap: () => this._generateGapSection(data),
      discovery: () => this._generateDiscoverySection(data),
      tip: () => this._generateTipSection(data),
      how: () => this._generateHowSection(data),
      example: () => this._generateExampleSection(data),
      lesson: () => this._generateLessonSection(data),
      explanation: () => this._generateExplanationSection(data),
      cta: () => this._generateCTASection(data, personality)
    };

    const generator = generators[type];
    return generator ? generator() : null;
  }

  _generateInsightSection(data) {
    const insights = data.insights || [];
    const best = insights[0];

    if (!best) return null;

    return {
      type: 'insight',
      content: best.text || best.insight || '',
      source: 'insight',
      isHook: true
    };
  }

  _generateStorySection(data) {
    const insights = data.insights || [];
    const storyInsight = insights.find(i => i.type === 'story') || insights[0];

    if (!storyInsight) {
      return {
        type: 'story',
        content: `I used to think ${data.topic || 'this'} was simple. Then I learned the hard way.`,
        source: 'generated'
      };
    }

    return {
      type: 'story',
      content: storyInsight.text || storyInsight.premise || '',
      source: 'insight'
    };
  }

  _generateChallengeSection(data) {
    const painPoints = data.painPoints || [];
    const challenge = painPoints[0];

    return {
      type: 'challenge',
      content: challenge || `The hardest part about ${data.topic} isn't what you think.`,
      source: 'pain_point'
    };
  }

  _generateResolutionSection(data) {
    const insights = data.insights || [];
    const lesson = insights.find(i => i.type === 'lesson') || insights[0];

    return {
      type: 'resolution',
      content: lesson?.text || 'The breakthrough came when I changed my approach.',
      source: 'insight'
    };
  }

  _generateQuestionSection(data) {
    const questions = data.questions || [];
    const best = questions[0];

    return {
      type: 'question',
      content: best?.natural || best?.text || `What if everything you know about ${data.topic} is wrong?`,
      source: 'question',
      isHook: true
    };
  }

  _generateAnswerSection(data) {
    const insights = data.insights || [];
    const best = insights[0];

    return {
      type: 'answer',
      content: best?.text || 'The truth is simpler than you think.',
      source: 'insight'
    };
  }

  _generateHotTakeSection(data) {
    const debate = data.debate || {};
    const contrarian = data.contrarian || debate.contrarian;

    const hotTakes = [
      contrarian?.hotTake,
      `Unpopular opinion: ${data.topic} is overrated.`,
      `Hot take: Stop focusing on ${data.topic}.`,
      `Here's why most ${data.topic} advice is backwards.`
    ].filter(Boolean);

    return {
      type: 'hot_take',
      content: hotTakes[0],
      source: 'contrarian',
      isHook: true
    };
  }

  _generateEvidenceSection(data) {
    const evidence = data.evidence || [];
    const best = evidence[0];

    if (!best) {
      return {
        type: 'evidence',
        content: 'This is backed by research and real-world results.',
        source: 'generic'
      };
    }

    return {
      type: 'evidence',
      content: best.text || best.scenario || '',
      source: 'evidence'
    };
  }

  _generateNuanceSection(data) {
    const debate = data.debate || {};
    const conclusion = debate.conclusion;

    return {
      type: 'nuance',
      content: conclusion || 'The reality is more nuanced than either side suggests.',
      source: 'debate'
    };
  }

  _generateGapSection(data) {
    const hooks = data.hooks || [];
    const gapHook = hooks.find(h => h.type === 'gap') || hooks[0];

    return {
      type: 'gap',
      content: gapHook?.text || `What nobody tells you about ${data.topic}:`,
      source: 'hook',
      isHook: true
    };
  }

  _generateDiscoverySection(data) {
    const insights = data.insights || [];
    const best = insights[0];

    return {
      type: 'discovery',
      content: best?.insight || best?.text || 'The key insight nobody mentions:',
      source: 'insight'
    };
  }

  _generateTipSection(data) {
    const tips = data.insights?.filter(i => i.type === 'lesson' || i.type === 'tip') || [];
    const tip = tips[0];

    return {
      type: 'tip',
      content: tip?.text || 'The key to success with ' + (data.topic || 'this') + ':',
      source: 'insight'
    };
  }

  _generateHowSection(data) {
    const evidence = data.evidence || [];
    const best = evidence[0];

    return {
      type: 'how',
      content: best?.approach || 'Focus on what matters most, ignore the rest.',
      source: 'evidence'
    };
  }

  _generateExampleSection(data) {
    const evidence = data.evidence || [];
    const examples = evidence.filter(e => e.type === 'example' || e.type === 'scenario');
    const best = examples[0] || evidence[0];

    if (!best) {
      return {
        type: 'example',
        content: 'Real example: Someone who applied this saw results in weeks.',
        source: 'generic'
      };
    }

    return {
      type: 'example',
      content: best.text || `Example: ${best.scenario}. ${best.approach || ''}`,
      source: 'evidence'
    };
  }

  _generateLessonSection(data) {
    const insights = data.insights || [];
    const lessons = insights.filter(i => i.type === 'lesson' || i.type === 'practical');
    const lesson = lessons[0] || insights[0];

    return {
      type: 'lesson',
      content: lesson?.text || 'The practical takeaway: focus on fundamentals.',
      source: 'insight'
    };
  }

  _generateExplanationSection(data) {
    const insights = data.insights || [];
    const explanation = insights.find(i => i.type === 'explanation') || insights[0];

    return {
      type: 'explanation',
      content: explanation?.text || 'This works because of a fundamental principle.',
      source: 'insight'
    };
  }

  _generateCTASection(data, personality) {
    const ctas = {
      engage: ['What would you add? Let me know below.', 'Comment your thoughts below.'],
      educate: ['Follow for more insights like this.', 'Save this for later.'],
      inspire: ['Share this with someone who needs it.', 'Save for motivation.'],
      sell: ['Link in bio.', 'Get started today.'],
      default: ['What\'s your take? Comment below.']
    };

    const options = ctas[data.goal] || ctas.default;

    if (personality === 'gen z') {
      return {
        type: 'cta',
        content: 'follow for more ♻️'
      };
    }

    return {
      type: 'cta',
      content: options[Math.floor(Math.random() * options.length)]
    };
  }

  /**
   * Assemble draft from sections
   */
  _assembleDraft(sections, personality) {
    let content = '';

    sections.forEach((section, index) => {
      const sectionText = section.content;
      
      if (!sectionText) return;

      // Handle hook differently based on style
      if (section.isHook && index === 0) {
        content += sectionText;
      } else {
        content += sectionText;
      }

      // Add spacing
      if (index < sections.length - 1) {
        content += '\n\n';
      }
    });

    return content.trim();
  }

  /**
   * Generate multiple drafts with different styles
   */
  generateMultipleDrafts(topic, data, options = {}) {
    const { count = 3, personality = 'default' } = options;
    
    const styles = Object.keys(this.draftStyles);
    const drafts = [];

    // Generate drafts with different styles
    for (let i = 0; i < count; i++) {
      const style = styles[i % styles.length];
      const draft = this.generateDraft(topic, {
        style,
        data,
        personality
      });
      drafts.push(draft);
    }

    return drafts;
  }

  /**
   * Combine best elements from multiple drafts
   */
  combineDrafts(drafts) {
    const combined = {
      sections: [],
      rawContent: '',
      sources: []
    };

    // Collect hooks from different drafts
    const hooks = drafts.map(d => d.sections.find(s => s.isHook)).filter(Boolean);
    
    // Use the most interesting hook
    if (hooks.length > 0) {
      combined.sections.push(hooks[0]);
      combined.sources.push(hooks[0].source);
    }

    // Combine non-hook sections
    drafts.forEach(draft => {
      draft.sections.forEach(section => {
        if (!section.isHook && !combined.sections.find(s => s.type === section.type)) {
          combined.sections.push(section);
          combined.sources.push(section.source);
        }
      });
    });

    // Assemble combined draft
    combined.rawContent = combined.sections.map(s => s.content).join('\n\n');

    return combined;
  }
}

export default DraftEngine;
