// Reply Suggestions Generator
import { ContentData, random, shuffle } from '../core/contentData.js';

export class ReplyGenerator {
  static generate(options = {}) {
    const {
      type = 'positive',
      context = ''
    } = options;

    const templates = ContentData.replyTemplates[type] || ContentData.replyTemplates.positive;
    const contextText = context ? ` regarding ${context}` : '';
    const replies = [];
    const usedTemplates = new Set();

    while (replies.length < 10) {
      const template = random(templates);
      if (!usedTemplates.has(template)) {
        usedTemplates.add(template);
        replies.push(template);
      }
      if (usedTemplates.size >= templates.length) break;
    }

    // Add context-specific variations
    if (context) {
      const contextReplies = [
        `Love this! Especially the ${random(['first point', 'last part', 'main idea', 'approach'])} ${contextText} 💯`,
        `This is exactly what I needed ${contextText}! Thank you! 🙌`
      ];
      replies.splice(4, 0, ...contextReplies);
    }

    return replies.slice(0, 10).map((reply, index) => ({
      id: `reply-${Date.now()}-${index}`,
      type: 'reply',
      content: reply,
      metadata: {
        category: type,
        context: context || 'general'
      }
    }));
  }

  static getTypes() {
    return [
      { value: 'positive', label: 'Positive / Compliment' },
      { value: 'question', label: 'Question / Inquiry' },
      { value: 'negative', label: 'Negative / Complaint' },
      { value: 'sarcastic', label: 'Playful / Sarcastic' },
      { value: 'follower', label: 'Follower Appreciation' }
    ];
  }
}

export default ReplyGenerator;
