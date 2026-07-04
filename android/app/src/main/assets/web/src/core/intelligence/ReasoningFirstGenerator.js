/**
 * ReasoningFirstGenerator
 * Main generator that uses reasoning-first approach
 * 1. Generate observations
 * 2. Build outline
 * 3. Write from outline
 * 4. Reflect and rewrite weak sections
 */

import { TopicPackManager } from './TopicPacks.js';
import { ObservationEngine } from './ObservationEngine.js';
import { OpinionEngine } from './OpinionEngine.js';
import { OutlineEngine } from './OutlineEngine.js';
import { WriterEngine } from './WriterEngine.js';
import { ReflectionEngine } from './ReflectionEngine.js';
import { SessionManager } from './SessionManager.js';
import { SimilarityEngine } from './SimilarityEngine.js';

export class ReasoningFirstGenerator {
  constructor() {
    this.topicPacks = new TopicPackManager();
    this.observationEngine = new ObservationEngine(this.topicPacks);
    this.opinionEngine = new OpinionEngine(this.topicPacks);
    this.outlineEngine = new OutlineEngine();
    this.writerEngine = new WriterEngine();
    this.reflectionEngine = new ReflectionEngine();
    this.session = new SessionManager();
    this.similarity = new SimilarityEngine();
    
    this.maxIterations = 3;
    this.observationCount = 25;
  }

  /**
   * Generate content using reasoning-first approach
   */
  generate(options = {}) {
    const {
      topic,
      personality = 'default',
      goal = 'engage',
      audience = 'general',
      strategy = 'auto'
    } = options;

    // Track in session
    this.session.recordGeneration({ topic, personality, goal });

    // Phase 1: Generate Observations (at least 20)
    const observations = this.observationEngine.generateObservations(topic, {
      count: this.observationCount,
      goal,
      personality
    });

    // Phase 2: Generate Opinions
    const opinions = this.opinionEngine.generateOpinions(topic, {
      count: 5,
      goal
    });

    // Phase 3: Build Outline (select best strategy)
    const outline = this.outlineEngine.generateOutline(observations, {
      strategy,
      goal,
      personality
    });

    // Phase 4: Write from Outline (with humanization during)
    let content = this.writerEngine.writeFromOutline(outline, {
      personality,
      topic
    });

    // Phase 5: Reflect on Content
    let reflection = this.reflectionEngine.reflect(content, { topic, goal });

    // Phase 6: If issues, rewrite weak sections
    let iterations = 0;
    while (!reflection.passed && iterations < this.maxIterations) {
      content = this._rewriteWeakSections(content, reflection, observations, outline, {
        personality,
        topic
      });
      
      reflection = this.reflectionEngine.reflect(content, { topic, goal });
      iterations++;
    }

    // Phase 7: Check Similarity
    const similarityResult = this.similarity.checkAgainstRecent(content);
    if (similarityResult.isDuplicate && iterations < this.maxIterations) {
      content = this._regenerateForUniqueness(content, observations, outline, {
        personality,
        topic
      });
      reflection = this.reflectionEngine.reflect(content, { topic, goal });
    }

    // Phase 8: Polish
    content = this.writerEngine.polish(content, 
      this.writerEngine.personalityStyles[personality] || 
      this.writerEngine.personalityStyles.default
    );

    // Track in memory
    this.similarity.addToRecent(content, { topic, personality });
    this.session.recordGeneration({ topic, personality, goal, content });

    return {
      content,
      observations,
      opinions,
      outline,
      reflection,
      iterations: iterations + 1,
      similarity: similarityResult,
      scores: {
        overall: this.reflectionEngine.getQualityScore(reflection),
        ...reflection.scores
      },
      grade: this.reflectionEngine.getGrade(this.reflectionEngine.getQualityScore(reflection)),
      passedChecks: {
        insight: reflection.checks.hasInsight,
        example: reflection.checks.hasExample,
        original: reflection.checks.hasOriginalIdea,
        takeaway: reflection.checks.hasTakeaway,
        human: reflection.checks.soundsHuman
      }
    };
  }

  /**
   * Rewrite weak sections based on reflection
   */
  _rewriteWeakSections(content, reflection, observations, outline, options) {
    const { personality, topic } = options;
    let rewritten = content;

    const issueHandlers = {
      hasInsight: () => this._addInsight(observations),
      hasExample: () => this._addExample(observations, topic),
      hasOriginalIdea: () => this._freshenContent(observations),
      hasTakeaway: () => this._addTakeaway(observations),
      soundsHuman: () => this._humanizeContent(observations),
      wouldStartDiscussion: () => this._addDiscussionPrompt(),
      hasConcreteDetail: () => this._addConcreteDetail(observations)
    };

    // Get the first section that needs improvement
    for (const issue of reflection.issues) {
      const handler = issueHandlers[issue];
      if (handler) {
        const improvement = handler();
        if (improvement) {
          // Find a good place to insert
          rewritten = this._insertImprovement(rewritten, improvement, issue);
          break;
        }
      }
    }

    return rewritten;
  }

  /**
   * Add insight to content
   */
  _addInsight(observations) {
    const insightObs = observations.find(o => 
      ['insight', 'reframe', 'pattern', 'surprising'].includes(o.type)
    );
    
    if (insightObs) {
      return {
        type: 'insight',
        text: insightObs.text,
        prefix: 'The key insight:\n\n'
      };
    }
    return null;
  }

  /**
   * Add example to content
   */
  _addExample(observations, topic) {
    const exampleObs = observations.find(o => o.type === 'example');
    
    if (exampleObs) {
      const example = exampleObs.scenario && exampleObs.approach
        ? `Example:\n\n${exampleObs.scenario}\n\n${exampleObs.approach}${exampleObs.outcome ? '\n\nResult: ' + exampleObs.outcome : ''}`
        : exampleObs.text;

      return {
        type: 'example',
        text: example,
        position: 'middle'
      };
    }
    return null;
  }

  /**
   * Freshen content by adding unique angle
   */
  _freshenContent(observations) {
    const uniqueObs = observations.find(o => 
      !['tip', 'practical'].includes(o.type) && o.text.length > 50
    );
    
    if (uniqueObs) {
      return {
        type: 'angle',
        text: uniqueObs.text,
        prefix: 'Here\'s what nobody talks about:\n\n'
      };
    }
    return null;
  }

  /**
   * Add takeaway
   */
  _addTakeaway(observations) {
    const tipObs = observations.find(o => 
      ['practical', 'tip', 'warning'].includes(o.type)
    );
    
    if (tipObs) {
      return {
        type: 'takeaway',
        text: tipObs.text,
        prefix: 'The takeaway:\n\n'
      };
    }
    return null;
  }

  /**
   * Humanize content
   */
  _humanizeContent(observations) {
    const observations_text = 'actually, honestly, here\'s the thing'.split(', ');
    
    return {
      type: 'humanize',
      text: 'the approach that actually works',
      prefix: ''
    };
  }

  /**
   * Add discussion prompt
   */
  _addDiscussionPrompt() {
    const prompts = [
      '\n\nWhat\'s your take? Comment below.',
      '\n\nAgree or disagree? Let me know.',
      '\n\nWhat would you add? Drop it below.'
    ];

    return {
      type: 'discussion',
      text: prompts[Math.floor(Math.random() * prompts.length)],
      position: 'end'
    };
  }

  /**
   * Add concrete detail
   */
  _addConcreteDetail(observations) {
    const statObs = observations.find(o => o.type === 'statistic' || o.type === 'fact');
    
    if (statObs) {
      return {
        type: 'detail',
        text: statObs.text,
        prefix: 'The data:\n\n'
      };
    }
    return null;
  }

  /**
   * Insert improvement into content
   */
  _insertImprovement(content, improvement, issue) {
    if (!improvement || !improvement.text) return content;

    const { prefix, text, position } = improvement;

    if (position === 'end' || improvement.type === 'discussion') {
      return content + text;
    }

    if (position === 'middle') {
      const paragraphs = content.split('\n\n');
      const insertIndex = Math.floor(paragraphs.length / 2);
      paragraphs.splice(insertIndex, 0, prefix + text);
      return paragraphs.join('\n\n');
    }

    // Default: add after first paragraph
    const firstBreak = content.indexOf('\n\n');
    if (firstBreak > 0 && firstBreak < content.length / 2) {
      return content.substring(0, firstBreak + 2) + 
             prefix + text + '\n\n' + 
             content.substring(firstBreak + 2);
    }

    return prefix + text + '\n\n' + content;
  }

  /**
   * Regenerate for uniqueness
   */
  _regenerateForUniqueness(content, observations, outline, options) {
    // Try different observations
    const freshObs = observations.slice(10, 20);
    
    if (freshObs.length > 0) {
      const newOutline = this.outlineEngine.generateOutline(freshObs, {
        strategy: outline.strategy,
        goal: 'engage',
        personality: options.personality
      });
      
      return this.writerEngine.writeFromOutline(newOutline, options);
    }

    // Fallback: vary the writing style
    return 'Fresh perspective:\n\n' + content;
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
    results.sort((a, b) => b.scores.overall - a.scores.overall);

    return results;
  }
}

export default ReasoningFirstGenerator;
