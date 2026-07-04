// Enhanced Caption Generator using StrategistContentGenerator
import { StrategistContentGenerator } from '../core/intelligence/StrategistContentGenerator.js';
import { PERSONALITY_PRESETS, GOALS, AUDIENCES } from '../core/enhanced/Presets.js';

let strategistInstance = null;

async function getStrategist() {
  if (!strategistInstance) {
    strategistInstance = new StrategistContentGenerator();
    await strategistInstance.init();
  }
  return strategistInstance;
}

export class EnhancedCaptionGenerator {
  constructor() {
    this.strategist = null;
  }

  static async generate(options = {}) {
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

    const selectedPersonality = personality === 'default' 
      ? EnhancedCaptionGenerator._selectDefaultPersonality(tone) 
      : personality;

    // Use StrategistContentGenerator for memory-aware generation
    const strategist = await getStrategist();
    
    const result = await strategist.generate({
      topic: topic.trim(),
      personality: selectedPersonality,
      goal,
      audience,
      strategy: pattern,
      versions
    });

    // Format results
    const results = (result.results || []).map((r, i) => ({
      id: `caption-${Date.now()}-${i}`,
      type: 'caption',
      title: `Version ${i + 1}${i === 0 ? ' ⭐ Best' : ''}`,
      content: r.content,
      metadata: {
        tone,
        length,
        personality: result.context?.selectedPersonality || selectedPersonality,
        goal,
        audience,
        pattern: r.strategy,
        score: r.scores?.overall || r.finalScore || 75,
        grade: EnhancedCaptionGenerator._getGrade(r.scores?.overall || r.finalScore || 75),
        category: result.expandedTopic,
        strategy: r.strategy,
        topicExpansion: r.topicExpansion,
        rank: r.rank,
        iteration: r.iteration,
        passedQualityCheck: r.passedQualityCheck,
        passedSimilarityCheck: r.passedSimilarityCheck
      }
    }));

    return results;
  }

  static _getGrade(score) {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 75) return 'C+';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
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
