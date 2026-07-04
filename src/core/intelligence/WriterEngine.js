/**
 * WriterEngine
 * Generates human-like text from structured outlines
 * Participates in sentence construction, not just editing
 */

export class WriterEngine {
  constructor() {
    this.personalityStyles = this._buildPersonalityStyles();
  }

  /**
   * Build personality writing styles
   */
  _buildPersonalityStyles() {
    return {
      'viral creator': {
        voice: 'conversational',
        sentenceLength: 'varied', // Mix of short and medium
        emoji: true,
        contractions: true,
        lowercase: false,
        patterns: ['hook_start', 'direct_address', 'short_paragraphs'],
        avoid: ['formal', 'passive', 'long_intros']
      },
      'gen z': {
        voice: 'casual',
        sentenceLength: 'short',
        emoji: true,
        contractions: true,
        lowercase: true,
        patterns: ['fragment_ok', 'ellipsis', 'lowercase_start'],
        avoid: ['formal', 'corporate', 'long_sentences']
      },
      storytelling: {
        voice: 'narrative',
        sentenceLength: 'varied',
        emoji: false,
        contractions: true,
        lowercase: false,
        patterns: ['story_flow', 'sensory', 'pacing'],
        avoid: ['fragment', 'bullet_points']
      },
      educational: {
        voice: 'clear',
        sentenceLength: 'medium',
        emoji: false,
        contractions: true,
        lowercase: false,
        patterns: ['logical_flow', 'examples', 'summary'],
        avoid: ['jargon', 'vague', 'rambling']
      },
      funny: {
        voice: 'humorous',
        sentenceLength: 'varied',
        emoji: true,
        contractions: true,
        lowercase: true,
        patterns: ['punchline', 'hyperbole', 'self_deprecating'],
        avoid: ['serious', 'over_explain']
      },
      corporate: {
        voice: 'professional',
        sentenceLength: 'medium',
        emoji: false,
        contractions: false,
        lowercase: false,
        patterns: ['clear_structure', 'action_oriented'],
        avoid: ['slang', 'informal', 'overly_personal']
      },
      minimalist: {
        voice: 'minimal',
        sentenceLength: 'short',
        emoji: false,
        contractions: true,
        lowercase: true,
        patterns: ['short_sentences', 'white_space'],
        avoid: ['fluff', 'redundancy', 'adjectives']
      },
      influencer: {
        voice: 'personal',
        sentenceLength: 'varied',
        emoji: true,
        contractions: true,
        lowercase: true,
        patterns: ['relatable', 'personal_anecdote', 'direct'],
        avoid: ['impersonal', 'textbook', 'cold']
      },
      default: {
        voice: 'natural',
        sentenceLength: 'varied',
        emoji: false,
        contractions: true,
        lowercase: false,
        patterns: ['natural_flow'],
        avoid: ['robotic', 'template']
      }
    };
  }

  /**
   * Write content from outline
   */
  writeFromOutline(outline, options = {}) {
    const { personality = 'default', topic = '' } = options;
    const style = this.personalityStyles[personality] || this.personalityStyles.default;

    let content = '';
    const sections = outline.sections || [];

    sections.forEach((section, index) => {
      const sectionText = this._writeSection(section, style, topic);
      content += sectionText;

      // Add spacing between sections (vary by personality)
      if (index < sections.length - 1) {
        content += this._getSectionBreak(style);
      }
    });

    return content.trim();
  }

  /**
   * Write a single section
   */
  _writeSection(section, style, topic) {
    const { name, observation } = section;

    if (!observation && name !== 'cta') {
      return '';
    }

    const writers = {
      hook: () => this._writeHook(observation, style),
      concept: () => this._writeConcept(observation, style),
      explanation: () => this._writeExplanation(observation, style),
      example: () => this._writeExample(observation, style, topic),
      lesson: () => this._writeLesson(observation, style),
      cta: () => this._writeCTA(name, style),
      setup: () => this._writeSetup(observation, style),
      challenge: () => this._writeChallenge(observation, style),
      resolution: () => this._writeResolution(observation, style),
      myth: () => this._writeMyth(observation, style),
      truth: () => this._writeTruth(observation, style),
      evidence: () => this._writeEvidence(observation, style),
      problem: () => this._writeProblem(observation, style),
      solution: () => this._writeSolution(observation, style),
      steps: () => this._writeSteps(observation, style),
      optionA: () => this._writeOption(observation, style, 'A'),
      optionB: () => this._writeOption(observation, style, 'B'),
      comparison: () => this._writeComparison(observation, style),
      verdict: () => this._writeVerdict(observation, style),
      observation: () => this._writeObservation(observation, style),
      implication: () => this._writeImplication(observation, style),
      stance: () => this._writeStance(observation, style),
      reasoning: () => this._writeReasoning(observation, style),
      counter: () => this._writeCounter(observation, style),
      intro: () => this._writeIntro(observation, style),
      items: () => this._writeItems(observation, style),
      summary: () => this._writeSummary(observation, style),
      tip: () => this._writeTip(observation, style),
      why: () => this._writeWhy(observation, style),
      how: () => this._writeHow(observation, style),
      result: () => this._writeResult(observation, style),
      pain: () => this._writePain(observation, style),
      cause: () => this._writeCause(observation, style)
    };

    const writer = writers[name];
    return writer ? writer() : '';
  }

  /**
   * Write hook section
   */
  _writeHook(observation, style) {
    if (!observation) return '';

    const { type, text, myth } = observation;

    // Start with pattern interrupt based on style
    const patterns = {
      'viral creator': () => {
        if (type === 'question') return `${text}\n\n`;
        if (type === 'surprising') return `Here's the thing about this:\n\n${text}\n\n`;
        if (type === 'controversial') return `Hot take:\n\n${text}\n\n`;
        if (type === 'myth') return `${myth || text}\n\n`;
        return `${text}\n\n`;
      },
      'gen z': () => {
        if (type === 'question') return `okay but why does ${text.toLowerCase().replace('?', '')}\n\n`;
        if (type === 'surprising') return `not me finding out ${text.toLowerCase()}\n\n`;
        if (type === 'myth') return `the myth about this:\n${myth || text}\n\n`;
        return `${text}\n\n`;
      },
      storytelling: () => {
        return `${text}\n\n`;
      },
      educational: () => {
        return `${text}\n\n`;
      },
      funny: () => {
        if (type === 'surprising') return `Plot twist:\n\n${text}\n\n`;
        return `${text}\n\n`;
      },
      default: () => {
        return `${text}\n\n`;
      }
    };

    const writer = patterns[style.voice] || patterns.default;
    return writer();
  }

  /**
   * Write concept section
   */
  _writeConcept(observation, style) {
    const text = observation?.text || '';
    return `${text}\n\n`;
  }

  /**
   * Write explanation section
   */
  _writeExplanation(observation, style) {
    const text = observation?.text || '';
    
    if (style.voice === 'gen z') {
      return `basically ${text.toLowerCase()}\n\n`;
    }
    
    return `${text}\n\n`;
  }

  /**
   * Write example section
   */
  _writeExample(observation, style, topic) {
    if (!observation) return '';

    const { scenario, approach, outcome, text } = observation;

    // Always include concrete example
    if (scenario && approach) {
      let example = '';
      
      if (style.voice === 'gen z') {
        example = `real talk:\n${scenario}\n${approach}\n\n`;
      } else if (style.voice === 'viral creator') {
        example = `Here's how this works:\n\n${scenario}\n\n${approach}\n\n`;
      } else {
        example = `Example:\n\n${scenario}\n\n${approach}\n\n`;
      }

      if (outcome) {
        example += `The result: ${outcome}\n\n`;
      }

      return example;
    }

    return `${text}\n\n`;
  }

  /**
   * Write lesson section
   */
  _writeLesson(observation, style) {
    const text = observation?.text || '';

    if (style.voice === 'gen z') {
      return `the lesson:\n${text.toLowerCase()}\n\n`;
    }

    if (style.voice === 'viral creator') {
      return `What I learned:\n\n${text}\n\n`;
    }

    return `Lesson: ${text}\n\n`;
  }

  /**
   * Write CTA section
   */
  _writeCTA(sectionName, style) {
    const ctas = {
      action: 'Try this and let me know how it goes.',
      share: 'Share this with someone who needs it.',
      comment: 'Comment below - what\'s your take?',
      save: 'Save this post for later.',
      reflect: 'Think about this one.',
      thoughts: 'What would you do? Let me know.'
    };

    const cta = ctas[sectionName] || ctas.action;

    if (style.voice === 'gen z') {
      return `follow for more ♻️`;
    }

    if (style.voice === 'viral creator') {
      return `Follow for more like this 👆`;
    }

    return cta;
  }

  /**
   * Write setup for storytelling
   */
  _writeSetup(observation, style) {
    const text = observation?.text || '';
    return `${text}\n\n`;
  }

  /**
   * Write challenge for storytelling
   */
  _writeChallenge(observation, style) {
    const text = observation?.text || '';
    return `${text}\n\n`;
  }

  /**
   * Write resolution for storytelling
   */
  _writeResolution(observation, style) {
    const text = observation?.text || '';
    return `${text}\n\n`;
  }

  /**
   * Write myth section
   */
  _writeMyth(observation, style) {
    const myth = observation?.myth || observation?.text || '';
    
    if (style.voice === 'viral creator') {
      return `Wrong assumption:\n\n${myth}\n\n`;
    }
    
    if (style.voice === 'gen z') {
      return `the myth:\n${myth}\n\n`;
    }

    return `Myth: ${myth}\n\n`;
  }

  /**
   * Write truth section
   */
  _writeTruth(observation, style) {
    const truth = observation?.truth || observation?.text || '';
    
    if (style.voice === 'viral creator') {
      return `Reality:\n\n${truth}\n\n`;
    }
    
    if (style.voice === 'gen z') {
      return `but actually:\n${truth}\n\n`;
    }

    return `Truth: ${truth}\n\n`;
  }

  /**
   * Write evidence section
   */
  _writeEvidence(observation, style) {
    return this._writeExample(observation, style);
  }

  /**
   * Write problem section
   */
  _writeProblem(observation, style) {
    const text = observation?.text || '';
    return `${text}\n\n`;
  }

  /**
   * Write solution section
   */
  _writeSolution(observation, style) {
    const text = observation?.text || '';
    
    if (style.voice === 'gen z') {
      return `the fix:\n${text.toLowerCase()}\n\n`;
    }

    return `Solution: ${text}\n\n`;
  }

  /**
   * Write steps section
   */
  _writeSteps(observation, style) {
    const text = observation?.text || '';
    return `${text}\n\n`;
  }

  /**
   * Write option section
   */
  _writeOption(observation, style, label) {
    const subject = observation?.subject || observation?.text || '';
    const versus = observation?.versus || '';

    if (label === 'A') {
      return `Option A: ${subject}\n\n`;
    }
    return `Option B: ${versus}\n\n`;
  }

  /**
   * Write comparison section
   */
  _writeComparison(observation, style) {
    const betterFor = observation?.betterFor || observation?.text || '';
    return `${betterFor}\n\n`;
  }

  /**
   * Write verdict section
   */
  _writeVerdict(observation, style) {
    const text = observation?.text || '';
    
    if (style.voice === 'viral creator') {
      return `The verdict:\n\n${text}\n\n`;
    }

    return `Bottom line: ${text}\n\n`;
  }

  /**
   * Write observation section
   */
  _writeObservation(observation, style) {
    const text = observation?.text || '';
    return `${text}\n\n`;
  }

  /**
   * Write implication section
   */
  _writeImplication(observation, style) {
    const text = observation?.text || '';
    return `What this means: ${text}\n\n`;
  }

  /**
   * Write stance section
   */
  _writeStance(observation, style) {
    const text = observation?.statement || observation?.text || '';
    return `${text}\n\n`;
  }

  /**
   * Write reasoning section
   */
  _writeReasoning(observation, style) {
    const supporting = observation?.supporting || observation?.text || '';
    return `${supporting}\n\n`;
  }

  /**
   * Write counter section
   */
  _writeCounter(observation, style) {
    const text = observation?.text || '';
    return `That said: ${text}\n\n`;
  }

  /**
   * Write intro section
   */
  _writeIntro(observation, style) {
    const text = observation?.text || '';
    return `${text}\n\n`;
  }

  /**
   * Write items section
   */
  _writeItems(observation, style) {
    const text = observation?.text || '';
    return `${text}\n\n`;
  }

  /**
   * Write summary section
   */
  _writeSummary(observation, style) {
    const text = observation?.text || '';
    return `The takeaway: ${text}\n\n`;
  }

  /**
   * Write tip section
   */
  _writeTip(observation, style) {
    const text = observation?.text || '';
    return `Tip: ${text}\n\n`;
  }

  /**
   * Write why section
   */
  _writeWhy(observation, style) {
    const text = observation?.text || '';
    return `Why it works: ${text}\n\n`;
  }

  /**
   * Write how section
   */
  _writeHow(observation, style) {
    return this._writeExample(observation, style);
  }

  /**
   * Write result section
   */
  _writeResult(observation, style) {
    const outcome = observation?.outcome || observation?.text || '';
    return `${outcome}\n\n`;
  }

  /**
   * Write pain section
   */
  _writePain(observation, style) {
    const text = observation?.text || '';
    return `Sound familiar? ${text}\n\n`;
  }

  /**
   * Write cause section
   */
  _writeCause(observation, style) {
    const text = observation?.text || '';
    return `The real issue: ${text}\n\n`;
  }

  /**
   * Get section break based on personality
   */
  _getSectionBreak(style) {
    if (style.voice === 'gen z') {
      return '\n\n';
    }
    if (style.voice === 'minimalist') {
      return '\n\n';
    }
    if (style.voice === 'viral creator') {
      return '\n\n';
    }
    return '\n\n';
  }

  /**
   * Apply final polish to text
   */
  polish(text, style) {
    let polished = text;

    // Remove multiple newlines
    polished = polished.replace(/\n{3,}/g, '\n\n');

    // Ensure single space after periods
    polished = polished.replace(/\.\s{2,}/g, '. ');

    // Remove trailing whitespace
    polished = polished.split('\n').map(line => line.trimEnd()).join('\n');

    return polished;
  }
}

export default WriterEngine;
