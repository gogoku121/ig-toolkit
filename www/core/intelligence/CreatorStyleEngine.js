/**
 * CreatorStyleEngine
 * Models high-level writing characteristics from successful creators
 * Allows users to choose or blend styles
 */

export class CreatorStyleEngine {
  constructor() {
    this.styles = this._buildStyles();
  }

  /**
   * Build creator styles
   */
  _buildStyles() {
    return {
      'teacher': {
        name: 'The Teacher',
        description: 'Explains complex topics clearly',
        characteristics: {
          teachingStyle: 'step-by-step',
          pacing: 'methodical',
          structure: 'logical',
          voice: 'authoritative but friendly',
          sentenceLength: 'medium',
          paragraphStyle: 'one idea per paragraph',
          engagementStyle: 'questions to check understanding',
          ctaStyle: 'apply this'
        },
        traits: [
          'Starts with why',
          'Uses analogies to explain',
          'Includes practical examples',
          'Checks understanding',
          'Summarizes key points',
          'Encourages practice'
        ]
      },

      'storyteller': {
        name: 'The Storyteller',
        description: 'Uses narrative to connect',
        characteristics: {
          teachingStyle: 'story-driven',
          pacing: 'varied rhythm',
          structure: 'narrative arc',
          voice: 'personal, vulnerable',
          sentenceLength: 'varied',
          paragraphStyle: 'scene-based',
          engagementStyle: 'emotional connection',
          ctaStyle: 'share your story'
        },
        traits: [
          'Opens with a hook scene',
          'Creates tension before resolution',
          'Uses sensory details',
          'Relates personal experience',
          'Ends with reflection',
          'Invites reader into narrative'
        ]
      },

      'simplifier': {
        name: 'The Simplifier',
        description: 'Makes complex things accessible',
        characteristics: {
          teachingStyle: 'distillation',
          pacing: 'quick hits',
          structure: 'bullet-friendly',
          voice: 'direct, no fluff',
          sentenceLength: 'short to medium',
          paragraphStyle: 'one insight per block',
          engagementStyle: 'efficiency',
          ctaStyle: 'try this now'
        },
        traits: [
          'Gets to the point fast',
          'Uses simple language',
          'Breaks down complexity',
          'Provides frameworks',
          'Avoids unnecessary details',
          'Values reader time'
        ]
      },

      'debater': {
        name: 'The Debater',
        description: 'Takes strong positions',
        characteristics: {
          teachingStyle: 'argument-driven',
          pacing: 'energetic',
          structure: 'thesis + support',
          voice: 'confident, sometimes controversial',
          sentenceLength: 'medium to long',
          paragraphStyle: 'argument paragraph',
          engagementStyle: 'provokes thought',
          ctaStyle: 'agree or disagree'
        },
        traits: [
          'Takes clear stance',
          'Addresses counterarguments',
          'Uses evidence',
          'Creates intellectual tension',
          'Challenges assumptions',
          'Invites debate'
        ]
      },

      'coach': {
        name: 'The Coach',
        description: 'Motivates and guides',
        characteristics: {
          teachingStyle: 'encouraging',
          pacing: 'upbeat',
          structure: 'challenge + support',
          voice: 'energetic, supportive',
          sentenceLength: 'short punchy',
          paragraphStyle: 'motivational',
          engagementStyle: 'action-oriented',
          ctaStyle: 'you got this'
        },
        traits: [
          'Challenges the reader',
          'Uses motivational language',
          'Provides actionable steps',
          'Normalizes struggle',
          'Celebrates small wins',
          'Ends on encouragement'
        ]
      },

      'analyst': {
        name: 'The Analyst',
        description: 'Digs into the data',
        characteristics: {
          teachingStyle: 'evidence-based',
          pacing: 'measured',
          structure: 'observation + analysis',
          voice: 'objective, curious',
          sentenceLength: 'medium',
          paragraphStyle: 'data-driven',
          engagementStyle: 'intellectual',
          ctaStyle: 'what do you think'
        },
        traits: [
          'Cites specific data',
          'Looks at patterns',
          'Avoids speculation',
          'Acknowledges uncertainty',
          'Connects dots',
          'Asks questions'
        ]
      },

      'trendspotter': {
        name: 'The Trendspotter',
        description: 'Identifies emerging patterns',
        characteristics: {
          teachingStyle: 'observation-based',
          pacing: 'fast',
          structure: 'observation + implication',
          voice: 'forward-looking',
          sentenceLength: 'varied',
          paragraphStyle: 'trend-focused',
          engagementStyle: 'fomo-inducing',
          ctaStyle: 'get ahead of this'
        },
        traits: [
          'Notices patterns others miss',
          'Connects seemingly unrelated things',
          'Looks ahead',
          'Provides context',
          'Shows implications',
          'Positions reader to act'
        ]
      },

      'contrarian': {
        name: 'The Contrarian',
        description: 'Challenges conventional wisdom',
        characteristics: {
          teachingStyle: 'questioning',
          pacing: 'deliberate',
          structure: 'myth + truth',
          voice: 'bold, confident',
          sentenceLength: 'short to medium',
          paragraphStyle: 'thesis-driven',
          engagementStyle: 'provocative',
          ctaStyle: 'think differently'
        },
        traits: [
          'Challenges common beliefs',
          'Provides alternative view',
          'Uses evidence against consensus',
          'Creates tension',
          'Surprises reader',
          'Opens minds'
        ]
      }
    };
  }

  /**
   * Get available styles
   */
  getStyles() {
    return Object.entries(this.styles).map(([key, style]) => ({
      key,
      name: style.name,
      description: style.description
    }));
  }

  /**
   * Get style by key
   */
  getStyle(key) {
    return this.styles[key] || this.styles['teacher'];
  }

  /**
   * Get style characteristics for writing
   */
  getCharacteristics(styleKey) {
    const style = this.getStyle(styleKey);
    return style.characteristics;
  }

  /**
   * Get traits for outline
   */
  getTraits(styleKey) {
    const style = this.getStyle(styleKey);
    return style.traits;
  }

  /**
   * Blend multiple styles
   */
  blendStyles(styleKeys, weights = null) {
    if (styleKeys.length === 1) {
      return this.getStyle(styleKeys[0]);
    }

    // Normalize weights
    const w = weights || styleKeys.map(() => 1 / styleKeys.length);
    const total = w.reduce((sum, val) => sum + val, 0);
    const normalized = w.map(val => val / total);

    // Blend characteristics
    const blended = {
      name: styleKeys.join(' + '),
      description: 'Blended style',
      characteristics: {},
      traits: []
    };

    // Average characteristics
    const chars = ['teachingStyle', 'pacing', 'structure', 'voice', 'sentenceLength', 'paragraphStyle', 'engagementStyle', 'ctaStyle'];
    
    chars.forEach(char => {
      const values = styleKeys.map((key, i) => this.styles[key]?.characteristics[char] || '');
      // Pick most common or weighted random
      blended.characteristics[char] = values[0];
    });

    // Combine traits
    styleKeys.forEach((key, i) => {
      if (this.styles[key]?.traits) {
        blended.traits.push(...this.styles[key].traits.slice(0, 3));
      }
    });

    return blended;
  }

  /**
   * Generate writing guidance for style
   */
  getWritingGuidance(styleKey) {
    const style = this.getStyle(styleKey);
    const chars = style.characteristics;

    return {
      voice: this._getVoiceGuidance(chars.voice),
      structure: this._getStructureGuidance(chars.structure),
      pacing: this._getPacingGuidance(chars.pacing),
      engagement: this._getEngagementGuidance(chars.engagementStyle),
      cta: this._getCTAGuidance(chars.ctaStyle)
    };
  }

  _getVoiceGuidance(voice) {
    const voices = {
      'authoritative but friendly': 'Confident but approachable. You know your stuff but you\'re not intimidating.',
      'personal, vulnerable': 'Share your real experience. Include doubts and failures.',
      'direct, no fluff': 'Short sentences. Active voice. Get to the point.',
      'confident, sometimes controversial': 'Strong opinions. Back them up. Don\'t apologize.',
      'energetic, supportive': 'Short punchy sentences. Encouraging. Action-oriented.',
      'objective, curious': 'Facts first. Acknowledge uncertainty. Ask questions.',
      'forward-looking': 'What\'s next? What\'s changing? Position the reader ahead.',
      'bold, confident': 'Take a stance. Challenge norms. Be willing to be wrong.'
    };
    return voices[voice] || voice;
  }

  _getStructureGuidance(structure) {
    const structures = {
      'logical': '1. Why it matters 2. How it works 3. Example 4. Apply it',
      'narrative arc': '1. Scene/Hook 2. Challenge 3. Breakthrough 4. Resolution 5. Takeaway',
      'bullet-friendly': '1. Hook 2. Main point 3. Sub-points 4. Action',
      'thesis + support': '1. Hot take 2. Evidence 3. Counter 4. Conclusion',
      'challenge + support': '1. Challenge accepted 2. Why it\'s hard 3. How 4. You can do it',
      'observation + analysis': '1. What I noticed 2. What it means 3. Questions it raises',
      'observation + implication': '1. Pattern spotted 2. Why it matters 3. What to do',
      'myth + truth': '1. Wrong belief 2. Right belief 3. Why 4. Apply'
    };
    return structures[structure] || structure;
  }

  _getPacingGuidance(pacing) {
    const pacings = {
      'methodical': 'Slow and thorough. Each point gets full treatment.',
      'varied rhythm': 'Long and short sentences alternate. Builds like music.',
      'quick hits': 'Fast-paced. Short paragraphs. High energy.',
      'energetic': 'Rhythmic. Short sentences create momentum.',
      'measured': 'Deliberate. Let points breathe.',
      'fast': 'Keep moving. Reader\'s time is valuable.'
    };
    return pacings[pacing] || pacing;
  }

  _getEngagementGuidance(engagement) {
    const engagements = {
      'questions to check understanding': 'Ask: "Does this make sense?" "What\'s your experience?"',
      'emotional connection': 'Use "you" and "we". Make it personal.',
      'efficiency': 'Respect the reader\'s time. No fluff.',
      'provokes thought': 'Challenge assumptions. Make them reconsider.',
      'action-oriented': 'Move the reader to act. Urgency without pressure.',
      'intellectual': 'Respect their intelligence. Lead with questions.',
      'fomo-inducing': 'You need to know this before others do.',
      'provocative': 'Push buttons. Challenge beliefs. Be willing to offend slightly.'
    };
    return engagements[engagement] || engagement;
  }

  _getCTAGuidance(cta) {
    const ctas = {
      'apply this': 'Try this and let me know how it goes.',
      'share your story': 'Has this happened to you? Share below.',
      'try this now': 'Go try it. Report back.',
      'agree or disagree': 'Hot take. Let me know your thoughts.',
      'you got this': 'Now go do it. I believe in you.',
      'what do you think': 'Curious to hear your take.',
      'get ahead of this': 'Don\'t sleep on this. Act now.',
      'think differently': 'See it differently now? Good.'
    };
    return ctas[cta] || cta;
  }

  /**
   * Get outline adapted to style
   */
  adaptOutlineToStyle(outline, styleKey) {
    const style = this.getStyle(styleKey);
    const structure = style.characteristics.structure;

    // Adapt based on style
    const adaptations = {
      'teacher': {
        addSection: 'summary',
        modifySection: { 'lesson': 'takeaway' }
      },
      'storyteller': {
        addSection: 'scene',
        modifySection: {}
      },
      'simplifier': {
        addSection: 'framework',
        modifySection: {}
      },
      'debater': {
        addSection: 'counterargument',
        modifySection: {}
      },
      'coach': {
        addSection: 'motivation',
        modifySection: {}
      },
      'analyst': {
        addSection: 'data',
        modifySection: {}
      },
      'trendspotter': {
        addSection: 'prediction',
        modifySection: {}
      },
      'contrarian': {
        addSection: 'myth',
        modifySection: {}
      }
    };

    const adaptation = adaptations[styleKey] || {};

    return {
      ...outline,
      style: styleKey,
      styleName: style.name,
      structure: structure,
      guidance: this.getWritingGuidance(styleKey)
    };
  }
}

export default CreatorStyleEngine;
