/**
 * QuestionEngine
 * Generates questions readers would naturally ask
 * Guides outline and ensures caption answers something meaningful
 */

export class QuestionEngine {
  constructor(topicPacks) {
    this.topicPacks = topicPacks;
  }

  /**
   * Generate questions for a topic
   */
  generateQuestions(topic, options = {}) {
    const {
      facts = [],
      observations = [],
      count = 10
    } = options;

    const questions = [];

    // Generate from topic understanding
    questions.push(...this._generateTopicQuestions(topic));

    // Generate from facts
    facts.forEach(fact => {
      questions.push(...this._questionsFromFact(fact, topic));
    });

    // Generate from observations
    observations.forEach(obs => {
      questions.push(...this._questionsFromObservation(obs, topic));
    });

    // Generate common question types
    questions.push(...this._generateCommonQuestions(topic));

    // Rank and dedupe
    const ranked = this._rankQuestions(questions);
    return ranked.slice(0, count);
  }

  /**
   * Generate questions about the topic itself
   */
  _generateTopicQuestions(topic) {
    return [
      {
        type: 'what',
        text: `What is ${topic} actually about?`,
        natural: `What is ${topic}?`,
        depth: 'foundational'
      },
      {
        type: 'why',
        text: `Why does ${topic} matter?`,
        natural: `Why should I care about ${topic}?`,
        depth: 'motivational'
      },
      {
        type: 'how',
        text: `How does ${topic} actually work?`,
        natural: `How do I ${topic}?`,
        depth: 'practical'
      },
      {
        type: 'when',
        text: `When should I focus on ${topic}?`,
        natural: `When is the right time for ${topic}?`,
        depth: 'strategic'
      },
      {
        type: 'common_mistake',
        text: `What's the #1 mistake with ${topic}?`,
        natural: `What's going wrong with my ${topic}?`,
        depth: 'corrective'
      }
    ];
  }

  /**
   * Generate questions from a fact
   */
  _questionsFromFact(fact, topic) {
    return [
      {
        type: 'so_what',
        text: `So what does this mean for ${topic}?`,
        natural: `Okay, but what does this actually mean?`,
        depth: 'implication',
        relatedFact: fact
      },
      {
        type: 'why_this',
        text: `Why is this true about ${topic}?`,
        natural: `Why is this the case?`,
        depth: 'understanding',
        relatedFact: fact
      },
      {
        type: 'implication',
        text: `What are the implications for ${topic}?`,
        natural: `How does this change things?`,
        depth: 'analytical',
        relatedFact: fact
      }
    ];
  }

  /**
   * Generate questions from observation
   */
  _questionsFromObservation(observation, topic) {
    const { type, text } = observation;

    const questions = [];

    switch (type) {
      case 'surprising':
        questions.push({
          type: 'curiosity',
          text: `Why is this surprising about ${topic}?`,
          natural: `Wait, why is that?`,
          depth: 'understanding'
        });
        break;

      case 'mistake':
        questions.push({
          type: 'avoidance',
          text: `How do I avoid this mistake in ${topic}?`,
          natural: `How do I not mess this up?`,
          depth: 'practical'
        });
        break;

      case 'example':
        questions.push({
          type: 'application',
          text: `How does this apply to my situation?`,
          natural: `Can I use this? How?`,
          depth: 'application'
        });
        break;

      case 'tip':
        questions.push({
          type: 'how具体',
          text: `How do I implement this ${topic} tip?`,
          natural: `How exactly do I do this?`,
          depth: 'practical'
        });
        break;
    }

    return questions;
  }

  /**
   * Generate common questions for any topic
   */
  _generateCommonQuestions(topic) {
    return [
      {
        type: 'start',
        text: `How do I get started with ${topic}?`,
        natural: `I'm new to this, where do I begin?`,
        depth: 'foundational'
      },
      {
        type: 'mistake',
        text: `What's the biggest mistake beginners make with ${topic}?`,
        natural: `What should I avoid?`,
        depth: 'corrective'
      },
      {
        type: 'success',
        text: `What does success with ${topic} look like?`,
        natural: `How will I know I'm doing it right?`,
        depth: 'clarifying'
      },
      {
        type: 'time',
        text: `How long does it take to see results with ${topic}?`,
        natural: `How long until I see progress?`,
        depth: 'realistic'
      },
      {
        type: 'difference',
        text: `What makes ${topic} different from alternatives?`,
        natural: `Why not just do something else?`,
        depth: 'comparative'
      },
      {
        type: 'next_step',
        text: `What's the one thing to focus on with ${topic}?`,
        natural: `Just tell me what to do!`,
        depth: 'actionable'
      }
    ];
  }

  /**
   * Rank questions by value
   */
  _rankQuestions(questions) {
    return questions
      .map(q => ({
        ...q,
        score: this._calculateQuestionScore(q)
      }))
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate question score
   */
  _calculateQuestionScore(question) {
    let score = 50;

    // Practical questions score higher
    if (question.depth === 'practical' || question.depth === 'actionable') {
      score += 20;
    }

    // Foundational questions are valuable
    if (question.depth === 'foundational') {
      score += 15;
    }

    // Natural phrasing is better
    if (question.natural && question.natural.length < 40) {
      score += 10;
    }

    // Questions with related content are better
    if (question.relatedFact) {
      score += 10;
    }

    // Different question types add variety
    const typeScores = {
      how: 15,
      what: 10,
      why: 10,
      how具体: 20,
      next_step: 25,
      mistake: 15,
      start: 15
    };
    score += typeScores[question.type] || 0;

    return score;
  }

  /**
   * Select question that best guides outline
   */
  selectGuidingQuestion(questions) {
    if (!questions || questions.length === 0) return null;

    // Prefer practical or how questions
    const preferred = questions.find(q => 
      q.type === 'how' || q.type === 'how具体' || q.type === 'next_step'
    );

    return preferred || questions[0];
  }

  /**
   * Ensure outline answers questions
   */
  ensureQuestionsAnswered(outline, questions) {
    const guidingQuestion = this.selectGuidingQuestion(questions);
    if (!guidingQuestion) return outline;

    // Add a section to answer the question if not present
    const questionText = guidingQuestion.natural || guidingQuestion.text;

    // Check if outline already addresses it
    const outlineText = outline.sections.map(s => s.name).join(' ');

    if (!outlineText.includes('explanation') && !outlineText.includes('answer')) {
      // Could add an 'answer' section, but for now just ensure CTA relates
      // This is handled in outline generation
    }

    return {
      ...outline,
      guidingQuestion
    };
  }
}

export default QuestionEngine;
