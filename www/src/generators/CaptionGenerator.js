// Caption Generator
import { ContentData, random, shuffle } from '../core/contentData.js';

export class CaptionGenerator {
  static generate(options = {}) {
    const {
      topic,
      tone = 'casual',
      length = 'medium'
    } = options;

    if (!topic || !topic.trim()) {
      throw new Error('Topic is required');
    }

    const lengthMap = {
      short: { min: 40, max: 80 },
      medium: { min: 80, max: 150 },
      long: { min: 150, max: 250 }
    };

    const { min, max } = lengthMap[length] || lengthMap.medium;
    const captions = [];

    for (let i = 0; i < 3; i++) {
      const caption = this._generateSingle(topic.trim(), tone, min, max);
      captions.push(caption);
    }

    return captions.map((caption, index) => ({
      id: `caption-${Date.now()}-${index}`,
      type: 'caption',
      title: `Caption ${index + 1}`,
      content: caption,
      metadata: {
        tone,
        length,
        topic
      }
    }));
  }

  static _generateSingle(topic, tone, min, max) {
    const openers = ContentData.captionOpeners[tone] || ContentData.captionOpeners.casual;
    const closers = ContentData.captionClosers[tone] || ContentData.captionClosers.casual;

    const opener = random(openers);
    const closer = random(closers);

    let caption = `${opener} ${topic.toLowerCase()}.\n\n`;

    const sentences = [
      "It's not just about the destination - it's about the journey.",
      "Every day is a new opportunity to grow.",
      "Small steps lead to big changes.",
      "Consistency is the key to transformation.",
      "Your mindset determines your outcome.",
      "Progress, not perfection.",
      "The best version of yourself is still being built.",
      "Embrace the process and trust the timing.",
      "Success isn't always about the outcome - it's about showing up.",
      "What you focus on grows."
    ];

    const numSentences = Math.floor(Math.random() * 3) + 2;
    const selectedSentences = shuffle(sentences).slice(0, numSentences);

    caption += selectedSentences.join(' ');

    const emojis = ['✨', '💫', '🙌', '💪', '🚀', '💡', '🔥', '🌟', '💯', '⭐'];
    caption += `\n\n${random(emojis)} ${closer}`;

    // Adjust length if needed
    if (caption.length < min) {
      caption += '\n\n' + shuffle(sentences).slice(0, 2).join(' ');
    }

    return caption.trim();
  }

  // Get available tones
  static getTones() {
    return Object.keys(ContentData.captionOpeners);
  }

  // Get available lengths
  static getLengths() {
    return [
      { value: 'short', label: 'Short' },
      { value: 'medium', label: 'Medium' },
      { value: 'long', label: 'Long' }
    ];
  }
}

export default CaptionGenerator;
