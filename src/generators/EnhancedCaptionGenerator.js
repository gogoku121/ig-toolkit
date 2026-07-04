// Enhanced Caption Generator using SupremeGenerator
import { SupremeGenerator } from '../core/intelligence/SupremeGenerator.js';
import { PERSONALITY_PRESETS, GOALS, AUDIENCES } from '../core/enhanced/Presets.js';

let generatorInstance = null;

function getGenerator() {
  if (!generatorInstance) {
    generatorInstance = new SupremeGenerator();
  }
  return generatorInstance;
}

export class EnhancedCaptionGenerator {
  constructor() {
    this.generator = getGenerator();
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

    const selectedPersonality = personality === 'default' 
      ? EnhancedCaptionGenerator._selectDefaultPersonality(tone) 
      : personality;

    const generator = getGenerator();
    const results = [];

    // Generate multiple versions using supreme approach
    for (let i = 0; i < versions; i++) {
      const result = generator.generate({
        topic: topic.trim(),
        personality: selectedPersonality,
        goal,
        audience
      });

      results.push({
        id: `caption-${Date.now()}-${i}`,
        type: 'caption',
        title: `Version ${i + 1}${i === 0 ? ' ⭐ Best' : ''}`,
        content: result.content,
        metadata: {
          tone,
          length,
          personality: selectedPersonality,
          goal,
          audience,
          pattern: result.ideaMix?.primary,
          score: result.scores?.overall || result.grade === 'A+' ? 95 : result.grade === 'A' ? 90 : 75,
          grade: result.grade || EnhancedCaptionGenerator._getGrade(result.scores?.overall || 75),
          originality: result.scores?.originality,
          draftsGenerated: result.pipeline?.draftsGenerated,
          originalityChecks: result.pipeline?.originalityChecks,
          editsApplied: result.pipeline?.editsApplied,
          checks: {
            hasInsight: result.checks?.hasInsight,
            hasExample: result.checks?.hasExample,
            hasTakeaway: result.checks?.hasTakeaway,
            hasEmotional: result.checks?.hasEmotional,
            isOriginal: result.checks?.isOriginal,
            wouldSave: result.checks?.wouldSave,
            hasStopScroll: result.checks?.hasStopScroll
          },
          rank: i === 0 ? 1 : i + 1
        }
      });
    }

    // Sort by score
    results.sort((a, b) => b.metadata.score - a.metadata.score);
    
    // Re-rank
    results.forEach((result, index) => {
      result.metadata.rank = index + 1;
      result.title = `Version ${index + 1}${index === 0 ? ' ⭐ Best' : ''}`;
    });

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
