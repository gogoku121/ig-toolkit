// Enhanced Caption Generator using intelligent pipeline
import { IntelligencePipeline } from '../core/intelligence/IntelligencePipeline.js';
import { PERSONALITY_PRESETS, GOALS, AUDIENCES } from '../core/enhanced/Presets.js';
import { shuffle } from '../core/contentData.js';

export class EnhancedCaptionGenerator {
  constructor() {
    this.pipeline = new IntelligencePipeline();
  }

  static generate(options = {}) {
    const {
      topic,
      tone = 'casual',
      length = 'medium',
      personality = 'default',
      goal = 'engage',
      audience = 'general',
      pattern = 'auto',
      versions = 3
    } = options;

    if (!topic || !topic.trim()) {
      throw new Error('Topic is required');
    }

    // Use the new intelligence pipeline
    const result = new EnhancedCaptionGenerator().pipeline.generate({
      topic: topic.trim(),
      personality: personality === 'default' ? EnhancedCaptionGenerator._selectDefaultPersonality(tone) : personality,
      goal,
      audience,
      tone,
      pattern,
      versions
    });

    // Format output to match expected format
    return result.versions.map((version, index) => ({
      id: `caption-${Date.now()}-${index}`,
      type: 'caption',
      title: `Version ${index + 1}${version.isBest ? ' ⭐ Best' : ''}`,
      content: version.humanizedContent || version.rawContent,
      metadata: {
        tone,
        length,
        personality: result.personality,
        goal,
        audience,
        pattern: version.strategy,
        score: version.finalScore,
        grade: version.scores?.grade,
        category: result.category,
        entity: result.primaryEntity,
        rank: version.rank
      }
    }));
  }

  static _selectDefaultPersonality(tone) {
    const toneToPersonality = {
      professional: 'corporate',
      casual: 'viral creator',
      funny: 'funny',
      inspirational: 'storyteller',
      promotional: 'startup founder'
    };
    return toneToPersonality[tone] || 'viral creator';
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
