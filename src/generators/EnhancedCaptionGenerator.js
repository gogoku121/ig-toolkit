// Enhanced Caption Generator using structured content engine
import { StructuredContentEngine } from '../core/enhanced/ContentEngine.js';
import { PERSONALITY_PRESETS, GOALS, AUDIENCES } from '../core/enhanced/Presets.js';
import { shuffle } from '../core/contentData.js';

export class EnhancedCaptionGenerator {
  constructor() {
    this.engine = new StructuredContentEngine();
  }

  static generate(options = {}) {
    const {
      topic,
      tone = 'casual',
      length = 'medium',
      personality = 'default',
      goal = 'engage',
      audience = 'general',
      pattern = 'auto'
    } = options;

    if (!topic || !topic.trim()) {
      throw new Error('Topic is required');
    }

    const generator = new EnhancedCaptionGenerator();
    const results = [];

    // Generate multiple unique captions
    for (let i = 0; i < 3; i++) {
      const result = generator._generateSingle({
        topic: topic.trim(),
        tone,
        length,
        personality: personality === 'default' ? generator._selectDefaultPersonality(tone) : personality,
        goal,
        audience,
        pattern
      });

      // Only include if score is above threshold (85)
      if (result.score.percentage >= 85 || i === 2) {
        results.push(result);
      }
    }

    return results.map((result, index) => ({
      id: `caption-${Date.now()}-${index}`,
      type: 'caption',
      title: `Caption ${index + 1} ${result.pattern ? `(${result.pattern})` : ''}`,
      content: result.content,
      metadata: {
        tone,
        length,
        personality: result.personality,
        goal,
        audience,
        pattern: result.pattern,
        score: result.score
      }
    }));
  }

  _generateSingle(options) {
    const {
      topic,
      tone,
      length,
      personality,
      goal,
      audience,
      pattern
    } = options;

    // Use the structured content engine
    const result = this.engine.generate({
      topic,
      personality,
      goal,
      audience,
      tone,
      pattern
    });

    // Adjust length
    let content = result.content;
    if (length === 'short' && content.length > 300) {
      content = this._truncateToLength(content, 200);
    } else if (length === 'long' && content.length < 200) {
      content = this._expandContent(content, topic);
    }

    return {
      ...result,
      content
    };
  }

  _selectDefaultPersonality(tone) {
    const toneToPersonality = {
      professional: 'corporate',
      casual: 'viral creator',
      funny: 'funny',
      inspirational: 'storyteller',
      promotional: 'startup founder'
    };
    return toneToPersonality[tone] || 'viral creator';
  }

  _truncateToLength(content, maxLength) {
    // Find a good break point
    if (content.length <= maxLength) return content;
    
    const truncated = content.substring(0, maxLength);
    const lastNewline = truncated.lastIndexOf('\n');
    const lastPeriod = truncated.lastIndexOf('.');
    
    const breakPoint = lastNewline > maxLength - 100 
      ? lastNewline 
      : lastPeriod > maxLength - 50 
        ? lastPeriod + 1 
        : maxLength;
    
    return truncated.substring(0, breakPoint).trim() + '...';
  }

  _expandContent(content, topic) {
    const expanders = [
      `\n\nP.S. ${topic} is a journey, not a destination. Enjoy every step of the way.`,
      `\n\nRemember: Progress over perfection. Every day is a chance to grow.`,
      `\n\nWhat's your experience with ${topic}? I'd love to hear your thoughts below.`,
      `\n\nThis is just the beginning. There's so much more to explore with ${topic}.`,
      `\n\nThe best time to start was yesterday. The second best time is now.`
    ];
    
    return content + shuffle(expanders)[0];
  }

  static getPersonalities() {
    return Object.entries(PERSONALITY_PRESETS).map(([key, value]) => ({
      value: key,
      label: value.name,
      description: value.description
    }));
  }

  static getGoals() {
    return Object.entries(GOALS).map(([key, value]) => ({
      value: key,
      label: `${value.icon} ${value.name}`,
      description: value.description
    }));
  }

  static getAudiences() {
    return Object.entries(AUDIENCES).map(([key, value]) => ({
      value: key,
      label: value.name,
      description: value.description
    }));
  }

  static getPatterns() {
    return [
      { value: 'auto', label: 'Auto-select' },
      { value: 'storytelling', label: 'Storytelling' },
      { value: 'before after', label: 'Before/After' },
      { value: 'problem solution', label: 'Problem/Solution' },
      { value: 'listicle', label: 'Listicle' },
      { value: 'case study', label: 'Case Study' },
      { value: 'comparison', label: 'Comparison' },
      { value: 'question answer', label: 'Q&A' },
      { value: 'behind scenes', label: 'Behind the Scenes' },
      { value: 'myth truth', label: 'Myth/Truth' }
    ];
  }

  static getTones() {
    return [
      { value: 'professional', label: 'Professional' },
      { value: 'casual', label: 'Casual' },
      { value: 'funny', label: 'Funny' },
      { value: 'inspirational', label: 'Inspirational' },
      { value: 'promotional', label: 'Promotional' }
    ];
  }

  static getLengths() {
    return [
      { value: 'short', label: 'Short' },
      { value: 'medium', label: 'Medium' },
      { value: 'long', label: 'Long' }
    ];
  }
}

export default EnhancedCaptionGenerator;
