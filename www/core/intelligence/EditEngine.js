/**
 * EditEngine
 * Active editor that rewrites weak sections instead of just scoring
 * Takes the role of a human editor reviewing and improving drafts
 */

export class EditEngine {
  constructor() {
    this.editStrategies = this._buildEditStrategies();
  }

  /**
   * Build edit strategies
   */
  _buildEditStrategies() {
    return {
      hook: {
        diagnose: (content) => {
          const firstLine = content.split('\n')[0] || '';
          if (!firstLine) return { issue: 'missing', severity: 'high' };
          
          const weakStarters = ['here\'s', 'in this', 'today we', 'let me', 'here are'];
          if (weakStarters.some(s => firstLine.toLowerCase().startsWith(s))) {
            return { issue: 'weak_opener', severity: 'high' };
          }
          
          if (firstLine.length < 20) {
            return { issue: 'too_short', severity: 'medium' };
          }
          
          return { issue: null, severity: 'none' };
        },
        rewrite: (content, data = {}) => {
          const paragraphs = content.split('\n\n');
          let hook = paragraphs[0] || '';
          
          // Generate stronger hook
          const strongHooks = [
            'What nobody tells you about ' + (data.topic || 'this') + ':',
            'Here\'s the thing nobody talks about:',
            'The truth nobody mentions about ' + (data.topic || 'this') + ':',
            'Hot take:',
            'Plot twist:',
            'The ' + (data.topic || 'this') + ' secret nobody shares:',
            'POV: You finally understand this:'
          ];
          
          const newHook = strongHooks[Math.floor(Math.random() * strongHooks.length)];
          
          // If current hook is weak, replace
          if (hook.length < 30 || /^(here'?s|this|in today)/i.test(hook)) {
            paragraphs[0] = newHook + ' ' + hook;
          } else {
            // Prepend strong opener
            paragraphs.unshift(newHook);
          }
          
          return paragraphs.join('\n\n');
        }
      },
      
      insight: {
        diagnose: (content) => {
          const insightPatterns = [
            /the (real|actual|key|main|important) (insight|truth|lesson|takeaway)/i,
            /what nobody (tells|shares|mentions|explains)/i,
            /here's (what|the) (nobody|secret|truth)/i
          ];
          
          if (!insightPatterns.some(p => p.test(content))) {
            return { issue: 'missing_insight', severity: 'high' };
          }
          
          return { issue: null, severity: 'none' };
        },
        rewrite: (content, data = {}) => {
          const insights = data.insights || [];
          const bestInsight = insights[0];
          
          if (!bestInsight) return content;
          
          const insightSection = '\n\nKey insight:\n\n' + (bestInsight.text || bestInsight.insight || '');
          return content + insightSection;
        }
      },
      
      example: {
        diagnose: (content) => {
          const examplePatterns = [
            /for example/i,
            /for instance/i,
            /scenario:/i,
            /case study/i,
            /when (i|we|you|someone)/i
          ];
          
          if (!examplePatterns.some(p => p.test(content))) {
            return { issue: 'missing_example', severity: 'high' };
          }
          
          return { issue: null, severity: 'none' };
        },
        rewrite: (content, data = {}) => {
          const evidence = data.evidence || [];
          const bestExample = evidence.find(e => e.type === 'example' || e.type === 'scenario') || evidence[0];
          
          if (!bestExample) {
            // Generate a generic but useful example
            const exampleSection = '\n\nReal example:\n\nWhen someone applies this approach, the results typically come within weeks. The key is consistency over intensity.';
            return content + exampleSection;
          }
          
          const exampleText = bestExample.text || bestExample.scenario || '';
          const exampleSection = '\n\nIn practice:\n\n' + exampleText;
          return content + exampleSection;
        }
      },
      
      takeaway: {
        diagnose: (content) => {
          const takeawayPatterns = [
            /takeaway:/i,
            /lesson:/i,
            /the key (to|is)/i,
            /try this/i,
            /action item/i
          ];
          
          if (!takeawayPatterns.some(p => p.test(content))) {
            return { issue: 'missing_takeaway', severity: 'high' };
          }
          
          return { issue: null, severity: 'none' };
        },
        rewrite: (content, data = {}) => {
          const takeaways = [
            'The takeaway: Focus on what matters most. Ignore the rest.',
            'Key lesson: Consistency beats intensity.',
            'Try this: Start small, iterate, improve.',
            'Action step: Pick one thing and commit to it for 30 days.',
            'Remember: Progress, not perfection.'
          ];
          
          const takeaway = takeaways[Math.floor(Math.random() * takeaways.length)];
          return content + '\n\n' + takeaway;
        }
      },
      
      emotional: {
        diagnose: (content) => {
          const emotionalPatterns = [
            /i (remember|realized|learned|was|feel)/i,
            /honestly/i,
            /actually/i,
            /sound familiar/i,
            /if you're like/i
          ];
          
          if (!emotionalPatterns.some(p => p.test(content))) {
            return { issue: 'missing_emotion', severity: 'medium' };
          }
          
          return { issue: null, severity: 'none' };
        },
        rewrite: (content, data = {}) => {
          const emotionalAdds = [
            'Honestly, this hit different once it clicked.',
            'If you\'re struggling with this, you\'re not alone.',
            'I remember when this took me way longer than it should have.',
            'Sound familiar? You\'re not the only one.',
            'This changed how I thought about the whole thing.'
          ];
          
          const add = emotionalAdds[Math.floor(Math.random() * emotionalAdds.length)];
          
          // Insert after hook
          const paragraphs = content.split('\n\n');
          if (paragraphs.length > 1) {
            paragraphs.splice(1, 0, add);
          } else {
            paragraphs.push(add);
          }
          
          return paragraphs.join('\n\n');
        }
      },
      
      cta: {
        diagnose: (content) => {
          const ctaPatterns = [
            /follow|share|comment|save|tag|dm|click/i
          ];
          
          if (!ctaPatterns.some(p => p.test(content))) {
            return { issue: 'missing_cta', severity: 'medium' };
          }
          
          return { issue: null, severity: 'none' };
        },
        rewrite: (content, data = {}) => {
          const ctas = [
            'What would you add? Let me know below.',
            'Save this for later reference.',
            'Share this with someone who needs it.',
            'Follow for more insights like this.',
            'Comment your thoughts below.'
          ];
          
          const cta = ctas[Math.floor(Math.random() * ctas.length)];
          return content + '\n\n' + cta;
        }
      },
      
      template: {
        diagnose: (content) => {
          const templatePhrases = [
            'in today\'s fast-paced',
            'in this post/article/guide',
            'let me tell you',
            'here are some',
            'in conclusion',
            'to summarize',
            'it\'s important to note'
          ];
          
          const found = templatePhrases.filter(p => content.toLowerCase().includes(p));
          if (found.length > 0) {
            return { issue: 'template_language', severity: 'high', found };
          }
          
          return { issue: null, severity: 'none' };
        },
        rewrite: (content, data = {}) => {
          let result = content;
          
          const replacements = {
            'in today\'s fast-paced world': '',
            'in this post': '',
            'in this article': '',
            'in this guide': '',
            'let me tell you': '',
            'here are some': '',
            'in conclusion,': '',
            'to summarize,': '',
            'it\'s important to note': 'Note:',
            'here\'s the thing': 'Key point:'
          };
          
          Object.entries(replacements).forEach(([phrase, replacement]) => {
            result = result.replace(new RegExp(phrase, 'gi'), replacement);
          });
          
          // Clean up
          result = result.replace(/\s{2,}/g, ' ');
          result = result.replace(/^\s*[:\-]\s*/gm, '');
          
          return result.trim();
        }
      }
    };
  }

  /**
   * Edit content actively
   */
  edit(content, originalityResults, options = {}) {
    const { topic = '', insights = [], evidence = [], questions = [] } = options;
    
    const data = { topic, insights, evidence, questions };
    const edits = [];
    
    // Apply edits based on originality results
    if (!originalityResults.isSurprising.passed || !originalityResults.hasStopScrollSentence.found) {
      const hookEdit = this._applyEdit('hook', content, data);
      if (hookEdit.newContent !== content) {
        edits.push({ type: 'hook', edit: 'rewrote_opener' });
        content = hookEdit.newContent;
      }
    }
    
    if (!originalityResults.hasOriginalInsight.passed) {
      const insightEdit = this._applyEdit('insight', content, data);
      if (insightEdit.newContent !== content) {
        edits.push({ type: 'insight', edit: 'added_insight' });
        content = insightEdit.newContent;
      }
    }
    
    if (!originalityResults.hasConcreteExample.passed) {
      const exampleEdit = this._applyEdit('example', content, data);
      if (exampleEdit.newContent !== content) {
        edits.push({ type: 'example', edit: 'added_example' });
        content = exampleEdit.newContent;
      }
    }
    
    if (!originalityResults.hasActionableTakeaway.passed) {
      const takeawayEdit = this._applyEdit('takeaway', content, data);
      if (takeawayEdit.newContent !== content) {
        edits.push({ type: 'takeaway', edit: 'added_takeaway' });
        content = takeawayEdit.newContent;
      }
    }
    
    if (!originalityResults.hasEmotionalEngagement.passed) {
      const emotionalEdit = this._applyEdit('emotional', content, data);
      if (emotionalEdit.newContent !== content) {
        edits.push({ type: 'emotional', edit: 'added_emotional_content' });
        content = emotionalEdit.newContent;
      }
    }
    
    if (originalityResults.isTemplateGenerated.passed) {
      const templateEdit = this._applyEdit('template', content, data);
      if (templateEdit.newContent !== content) {
        edits.push({ type: 'template', edit: 'removed_template_language' });
        content = templateEdit.newContent;
      }
    }
    
    if (!originalityResults.hasDiscussionWorthy.passed) {
      const ctaEdit = this._applyEdit('cta', content, data);
      if (ctaEdit.newContent !== content) {
        edits.push({ type: 'cta', edit: 'added_cta' });
        content = ctaEdit.newContent;
      }
    }
    
    return {
      content,
      edits,
      editCount: edits.length
    };
  }

  /**
   * Apply specific edit
   */
  _applyEdit(type, content, data) {
    const strategy = this.editStrategies[type];
    if (!strategy) {
      return { newContent: content, edited: false };
    }
    
    const diagnosis = strategy.diagnose(content);
    if (!diagnosis.issue) {
      return { newContent: content, edited: false };
    }
    
    const newContent = strategy.rewrite(content, data);
    
    return {
      newContent,
      edited: newContent !== content,
      diagnosis
    };
  }

  /**
   * Full edit pass
   */
  fullEdit(content, options = {}) {
    const { topic = '', insights = [], evidence = [], questions = [] } = options;
    const data = { topic, insights, evidence, questions };
    
    let edited = content;
    const allEdits = [];
    
    // Apply all edits in order
    Object.keys(this.editStrategies).forEach(type => {
      const result = this._applyEdit(type, edited, data);
      if (result.edited) {
        allEdits.push({ type, ...result.diagnosis });
        edited = result.newContent;
      }
    });
    
    // Final cleanup
    edited = this._finalCleanup(edited);
    
    return {
      content: edited,
      edits: allEdits,
      iterations: allEdits.length > 0 ? 2 : 1
    };
  }

  /**
   * Final cleanup pass
   */
  _finalCleanup(content) {
    let result = content;
    
    // Remove multiple blank lines
    result = result.replace(/\n{3,}/g, '\n\n');
    
    // Trim whitespace
    result = result.split('\n').map(line => line.trim()).join('\n');
    
    // Remove orphaned punctuation
    result = result.replace(/^\s*[:\-]\s*/gm, '');
    
    // Ensure proper spacing after punctuation
    result = result.replace(/([.!?])\s{2,}/g, '$1 ');
    
    return result.trim();
  }

  /**
   * Edit specific section
   */
  editSection(content, sectionType, newContent) {
    const paragraphs = content.split('\n\n');
    
    // Find and replace section
    const sectionIndicators = {
      hook: ['what nobody', 'here\'s', 'hot take', 'plot twist', 'pov:'],
      insight: ['key insight:', 'the truth', 'the secret'],
      example: ['for example', 'in practice', 'scenario:'],
      takeaway: ['takeaway:', 'lesson:', 'key lesson'],
      cta: ['follow', 'comment', 'save this', 'share this']
    };
    
    const indicators = sectionIndicators[sectionType] || [];
    
    // Find paragraph with indicator
    let found = false;
    for (let i = 0; i < paragraphs.length; i++) {
      const p = paragraphs[i].toLowerCase();
      if (indicators.some(ind => p.includes(ind))) {
        paragraphs[i] = newContent;
        found = true;
        break;
      }
    }
    
    // If not found, add at end
    if (!found) {
      paragraphs.push(newContent);
    }
    
    return paragraphs.join('\n\n');
  }
}

export default EditEngine;
