/**
 * InsightFirstGenerator
 * Complete insight-first generation pipeline:
 * Topic → Entity Detection → Knowledge Retrieval → Question Generation →
 * Insight Generation → Counterargument Generation → Example/Evidence Generation →
 * Outline Creation → Human Writing → Critique → Rewrite → Final Score
 */

import { TopicPackManager } from './TopicPacks.js';
import { EntityIntelligenceEngine } from './EntityIntelligenceEngine.js';
import { InsightEngine } from './InsightEngine.js';
import { QuestionEngine } from './QuestionEngine.js';
import { AnalogyEngine } from './AnalogyEngine.js';
import { DebateEngine } from './DebateEngine.js';
import { EvidenceEngine } from './EvidenceEngine.js';
import { CuriosityEngine } from './CuriosityEngine.js';
import { CreatorStyleEngine } from './CreatorStyleEngine.js';
import { WriterEngine } from './WriterEngine.js';
import { ReflectionEngine } from './ReflectionEngine.js';

export class InsightFirstGenerator {
  constructor() {
    this.topicPacks = new TopicPackManager();
    this.entityEngine = new EntityIntelligenceEngine();
    this.insightEngine = new InsightEngine(this.topicPacks);
    this.questionEngine = new QuestionEngine(this.topicPacks);
    this.analogyEngine = new AnalogyEngine(this.topicPacks);
    this.debateEngine = new DebateEngine(this.topicPacks);
    this.evidenceEngine = new EvidenceEngine(this.topicPacks);
    this.curiosityEngine = new CuriosityEngine();
    this.styleEngine = new CreatorStyleEngine();
    this.writerEngine = new WriterEngine();
    this.reflectionEngine = new ReflectionEngine();

    this.maxIterations = 3;
  }

  /**
   * Generate content using insight-first approach
   */
  generate(options = {}) {
    const {
      topic,
      personality = 'default',
      style = 'auto', // 'teacher', 'storyteller', 'simplifier', etc.
      goal = 'engage',
      audience = 'general'
    } = options;

    // Phase 1: Entity Detection
    const entities = this.entityEngine.detect(topic);
    const primaryEntity = this.entityEngine.getPrimaryEntity();

    // Phase 2: Knowledge Retrieval
    const pack = this.topicPacks.getPack(topic) || this._createGenericPack(topic);
    const facts = pack.facts || [];
    const painPoints = pack.painPoints || [];
    const misconceptions = pack.misconceptions || [];

    // Phase 3: Question Generation
    const questions = this.questionEngine.generateQuestions(topic, {
      facts,
      observations: []
    });

    // Phase 4: Insight Generation (transform facts into insights)
    const insights = this.insightEngine.generateInsights(topic, {
      facts,
      observations: []
    });

    // Phase 5: Counterargument Generation (debate)
    const debate = this.debateEngine.generateDebate(topic, { stance: 'auto' });
    const contrarian = this.debateEngine.getContrarianAngle(topic);

    // Phase 6: Example/Evidence Generation
    const evidence = this.evidenceEngine.generateEvidence(insights, { topic });

    // Phase 7: Analogies
    const analogies = this.analogyEngine.generateAnalogies(topic, { count: 3 });

    // Phase 8: Hook Generation (curiosity)
    const hooks = this.curiosityEngine.generateHooks(topic, { 
      personality: style,
      recentHooks: []
    });

    // Phase 9: Select Creator Style
    const selectedStyle = style === 'auto' ? this._selectStyleForGoal(goal) : style;
    const styleGuidance = this.styleEngine.getWritingGuidance(selectedStyle);

    // Phase 10: Build Dynamic Outline
    const outline = this._buildInsightOutline(topic, {
      insights,
      questions,
      debate,
      evidence,
      analogies,
      hooks,
      style: selectedStyle,
      goal
    });

    // Phase 11: Human Writing
    let content = this._writeFromOutline(outline, {
      personality,
      style: selectedStyle,
      topic,
      styleGuidance
    });

    // Phase 12: Self-Critique
    let reflection = this.reflectionEngine.reflect(content, { topic, goal });

    // Phase 13: Automatic Improvement Loop
    let iterations = 0;
    while (!this._passesChecks(reflection) && iterations < this.maxIterations) {
      content = this._improveContent(content, reflection, {
        insights,
        evidence,
        topic,
        personality,
        style
      });
      reflection = this.reflectionEngine.reflect(content, { topic, goal });
      iterations++;
    }

    // Phase 14: Final Polish
    content = this.writerEngine.polish(content, 
      this.writerEngine.personalityStyles[personality] || 
      this.writerEngine.personalityStyles.default
    );

    // Calculate final score
    const finalScore = this.reflectionEngine.getQualityScore(reflection);

    // Record hook usage
    if (hooks[0]) {
      this.curiosityEngine.recordHook(hooks[0].text);
    }

    return {
      content,
      
      // Pipeline stages for transparency
      pipeline: {
        entity: primaryEntity,
        insights: insights.slice(0, 5),
        questions: questions.slice(0, 5),
        debate,
        contrarian,
        evidence: evidence.slice(0, 3),
        analogies: analogies.slice(0, 2),
        hook: hooks[0],
        style: selectedStyle,
        outline,
        iterations
      },

      // Quality metrics
      reflection,
      scores: reflection.scores,
      qualityScore: finalScore,
      grade: this.reflectionEngine.getGrade(finalScore),
      
      // Check results
      checks: {
        hasInsight: reflection.checks.hasInsight,
        hasExample: reflection.checks.hasExample,
        hasTakeaway: reflection.checks.hasTakeaway,
        hasEmotional: reflection.checks.soundsHuman,
        isOriginal: reflection.checks.hasOriginalIdea
      }
    };
  }

  /**
   * Build dynamic outline based on insights
   */
  _buildInsightOutline(topic, options) {
    const {
      insights,
      questions,
      debate,
      evidence,
      analogies,
      hooks,
      style,
      goal
    } = options;

    // Select best elements
    const bestInsight = insights[0];
    const bestQuestion = questions[0];
    const bestEvidence = evidence[0];
    const bestAnalogy = analogies[0];
    const bestHook = hooks[0];
    const debateInsight = debate.debates[0];

    // Build sections dynamically
    const sections = [];

    // Hook section
    sections.push({
      name: 'hook',
      type: 'gap',
      content: bestHook?.text || bestInsight?.text || `What nobody tells you about ${topic}`,
      source: bestHook ? 'curiosity' : 'insight'
    });

    // Core insight section (MUST have)
    if (bestInsight) {
      sections.push({
        name: 'insight',
        type: bestInsight.type,
        content: bestInsight.text,
        insight: bestInsight.insight,
        source: 'insightEngine'
      });
    }

    // Question-driven explanation
    if (bestQuestion) {
      sections.push({
        name: 'explanation',
        type: 'question-driven',
        content: bestQuestion.natural || bestQuestion.text,
        question: bestQuestion,
        source: 'questionEngine'
      });
    }

    // Evidence section (MUST have)
    if (bestEvidence) {
      sections.push({
        name: 'evidence',
        type: bestEvidence.type,
        content: bestEvidence.text,
        scenario: bestEvidence.scenario,
        outcome: bestEvidence.outcome,
        source: 'evidenceEngine'
      });
    }

    // Analogy section (adds clarity)
    if (bestAnalogy && bestAnalogy.explanation) {
      sections.push({
        name: 'analogy',
        type: 'extended',
        content: `${topic} is like ${bestAnalogy.analogy}.\n\n${bestAnalogy.explanation}`,
        source: 'analogyEngine'
      });
    }

    // Debate/counternarrative (adds originality)
    if (debate.conclusion) {
      sections.push({
        name: 'perspective',
        type: debate.stance,
        content: debate.conclusion,
        source: 'debateEngine'
      });
    }

    // Practical lesson (MUST have for takeaways)
    const practicalInsights = insights.filter(i => i.type === 'lesson' || i.type === 'practical');
    if (practicalInsights[0]) {
      sections.push({
        name: 'lesson',
        type: 'actionable',
        content: practicalInsights[0].text,
        source: 'insightEngine'
      });
    }

    // CTA section
    sections.push({
      name: 'cta',
      type: goal,
      content: this._getCTABasedOnGoal(goal),
      source: 'generator'
    });

    return {
      topic,
      style,
      sections,
      structure: sections.map(s => s.name)
    };
  }

  /**
   * Write content from outline
   */
  _writeFromOutline(outline, options) {
    const { personality, style, topic, styleGuidance } = options;
    let content = '';

    outline.sections.forEach((section, index) => {
      const sectionText = this._writeSection(section, {
        personality,
        style,
        topic,
        styleGuidance
      });
      content += sectionText;

      if (index < outline.sections.length - 1) {
        content += '\n\n';
      }
    });

    return content.trim();
  }

  /**
   * Write individual section
   */
  _writeSection(section, options) {
    const { personality, style, styleGuidance } = options;
    const writerStyle = this.writerEngine.personalityStyles[personality] || 
                       this.writerEngine.personalityStyles.default;

    switch (section.name) {
      case 'hook':
        return this._writeHook(section, writerStyle);
      case 'insight':
        return this._writeInsight(section, writerStyle);
      case 'explanation':
        return this._writeExplanation(section, writerStyle);
      case 'evidence':
        return this._writeEvidence(section, writerStyle);
      case 'analogy':
        return this._writeAnalogy(section, writerStyle);
      case 'perspective':
        return this._writePerspective(section, writerStyle);
      case 'lesson':
        return this._writeLesson(section, writerStyle);
      case 'cta':
        return this._writeCTA(section, writerStyle);
      default:
        return section.content || '';
    }
  }

  _writeHook(section, style) {
    let text = section.content;
    
    if (style.voice === 'gen z') {
      if (text.toLowerCase().startsWith('what nobody')) {
        text = `not me finding out ${text.toLowerCase().replace('what nobody tells you about', '')}...`;
      }
    } else if (style.voice === 'viral creator') {
      if (!text.includes(':') && !text.includes('\n')) {
        text = `Here's the thing about this:\n\n${text}`;
      }
    }

    return text;
  }

  _writeInsight(section, style) {
    let text = section.content;
    
    // Add formatting based on insight type
    if (section.type === 'implication' || section.type === 'tradeoff') {
      text = `The key insight:\n\n${text}`;
    } else if (section.type === 'unexpected') {
      text = `What this reveals:\n\n${text}`;
    }

    return text;
  }

  _writeExplanation(section, style) {
    if (section.question) {
      return `${section.content}\n\nHere's why this matters:\n\nThis is a common challenge with ${section.question.text.includes('topic') ? '' : section.content.toLowerCase()}. Understanding the root cause helps find the solution.`;
    }
    return section.content;
  }

  _writeEvidence(section, style) {
    let text = section.content;

    if (section.type === 'example' || section.type === 'scenario') {
      text = `In practice:\n\n${text}`;
    } else if (section.type === 'case_study') {
      text = `Case study:\n\n${text}`;
    }

    return text;
  }

  _writeAnalogy(section, style) {
    return section.content;
  }

  _writePerspective(section, style) {
    if (section.type === 'balanced') {
      return `Different perspectives:\n\n${section.content}`;
    }
    return `Another way to look at it:\n\n${section.content}`;
  }

  _writeLesson(section, style) {
    let text = section.content;

    if (style.voice === 'gen z') {
      return `the takeaway:\n${text.toLowerCase()}`;
    }

    return `The practical lesson:\n\n${text}`;
  }

  _writeCTA(section, style) {
    const ctas = {
      engage: 'What would you add? Let me know below.',
      educate: 'Follow for more insights like this.',
      inspire: 'Save this for when you need it.',
      sell: 'Link in bio for more.',
      'generate comments': 'Comment your thoughts below.',
      'generate shares': 'Share this with someone who needs it.',
      'generate saves': 'Save this post.'
    };

    const cta = ctas[section.type] || ctas.engage;

    if (style.voice === 'gen z') {
      return `follow for more ♻️`;
    }

    return cta;
  }

  /**
   * Check if content passes all quality gates
   */
  _passesChecks(reflection) {
    return (
      reflection.checks.hasInsight &&
      reflection.checks.hasExample &&
      reflection.checks.hasTakeaway &&
      reflection.checks.soundsHuman &&
      reflection.checks.hasOriginalIdea
    );
  }

  /**
   * Improve content based on failed checks
   */
  _improveContent(content, reflection, options) {
    const { insights, evidence, topic, personality, style } = options;
    let improved = content;

    // Missing insight - add one
    if (!reflection.checks.hasInsight && insights[0]) {
      const insightText = `\n\nKey insight:\n\n${insights[0].text}`;
      improved += insightText;
    }

    // Missing example - add one
    if (!reflection.checks.hasExample && evidence[0]) {
      const exampleText = `\n\nExample:\n\n${evidence[0].text}`;
      improved += exampleText;
    }

    // Missing takeaway - add one
    if (!reflection.checks.hasTakeaway) {
      const takeaways = insights.filter(i => i.type === 'lesson' || i.type === 'practical');
      if (takeaways[0]) {
        improved += `\n\nTakeaway:\n\n${takeaways[0].text}`;
      }
    }

    // Not original - add contrarian angle
    if (!reflection.checks.hasOriginalIdea) {
      improved = `Here's a different perspective:\n\n` + improved;
    }

    return improved;
  }

  /**
   * Select style based on goal
   */
  _selectStyleForGoal(goal) {
    const goalStyles = {
      educate: 'teacher',
      entertain: 'storyteller',
      inspire: 'coach',
      sell: 'simplifier',
      engage: 'trendspotter',
      'generate comments': 'debater',
      'generate shares': 'trendspotter',
      'generate saves': 'simplifier'
    };

    return goalStyles[goal] || 'teacher';
  }

  /**
   * Get CTA based on goal
   */
  _getCTABasedOnGoal(goal) {
    const ctas = {
      engage: 'What would you add? Let me know below.',
      educate: 'Follow for more insights like this.',
      inspire: 'Save this for when you need it.',
      sell: 'Link in bio for more.',
      'generate comments': 'Comment your thoughts below.',
      'generate shares': 'Share this with someone who needs it.',
      'generate saves': 'Save this post.'
    };

    return ctas[goal] || ctas.engage;
  }

  /**
   * Create generic pack for unknown topics
   */
  _createGenericPack(topic) {
    return {
      name: topic,
      facts: [
        `Most people encounter ${topic} regularly without understanding it fully`,
        `The fundamentals of ${topic} are often overlooked`,
        `Expert approaches to ${topic} differ significantly from beginner approaches`
      ],
      painPoints: [
        `Confusion about where to start with ${topic}`,
        `Overwhelm from conflicting information about ${topic}`
      ],
      misconceptions: [
        {
          myth: `${topic} requires special talent`,
          truth: `Most people can learn ${topic} with proper approach`
        }
      ],
      expertTips: [
        `Focus on fundamentals before advanced techniques`,
        `Consistent practice beats sporadic intensity`
      ],
      beginnerMistakes: [
        `Trying to learn everything at once`,
        `Skipping basic fundamentals`
      ],
      practicalExamples: [
        {
          scenario: `Starting with ${topic}`,
          approach: `Begin with the simplest version, build from there`,
          outcome: `Solid foundation for growth`
        }
      ]
    };
  }

  /**
   * Generate multiple versions
   */
  generateMultiple(options = {}) {
    const { versions = 3, ...genOptions } = options;
    const results = [];

    for (let i = 0; i < versions; i++) {
      const result = this.generate(genOptions);
      results.push(result);
    }

    // Sort by quality score
    results.sort((a, b) => b.qualityScore - a.qualityScore);

    return results;
  }
}

export default InsightFirstGenerator;
