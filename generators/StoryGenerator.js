// Story Posts Generator
import { ContentData, random, shuffle } from '../core/contentData.js';

export class StoryGenerator {
  static generate(options = {}) {
    const {
      type = 'announcement',
      topic = ''
    } = options;

    const prompts = ContentData.storyPrompts[type] || ContentData.storyPrompts.announcement;
    const topicText = topic || (type === 'announcement' ? 'something exciting' : 'this topic');
    const ideas = [];

    for (let i = 0; i < 5; i++) {
      const slides = this._generateSlides(prompts, topicText, type);
      const stickers = shuffle(ContentData.storyStickers).slice(0, 3);
      const times = ['9 AM - 12 PM', '12 PM - 3 PM', '5 PM - 8 PM', '7 PM - 10 PM'];

      ideas.push({
        id: `story-${Date.now()}-${i}`,
        type: 'story',
        title: `Story Series ${i + 1}`,
        slides,
        stickerSuggestions: stickers,
        metadata: {
          recommendedTime: random(times),
          slideCount: slides.length,
          storyType: type
        }
      });
    }

    return ideas;
  }

  static _generateSlides(prompts, topicText, type) {
    const slides = [];

    // Hook slide
    slides.push({
      number: 1,
      content: random(prompts),
      type: 'hook',
      suggestion: 'Use engaging background or text animation'
    });

    // Interactive slide
    slides.push({
      number: 2,
      content: 'Share your thoughts in 3 words!',
      type: 'interactive',
      suggestion: 'Add question sticker'
    });

    // Content slide
    slides.push({
      number: 3,
      content: topicText,
      type: 'content',
      suggestion: 'Use high-quality visual'
    });

    // Poll/Engagement slide
    slides.push({
      number: 4,
      content: type === 'poll' ? 'This or that?' : 'Yes! 🙌 / Not really 🤔',
      type: 'engagement',
      suggestion: 'Add poll sticker'
    });

    // Additional slides based on type
    const additionalSlides = {
      announcement: [
        { content: 'The big reveal...', type: 'reveal' },
        { content: 'Mark your calendars!', type: 'cta' }
      ],
      poll: [
        { content: 'I need your opinion!', type: 'engagement' },
        { content: 'Results coming soon...', type: 'teaser' }
      ],
      question: [
        { content: 'Keep the questions coming!', type: 'engagement' },
        { content: 'Answers coming up!', type: 'teaser' }
      ],
      'behind-scenes': [
        { content: 'The real story...', type: 'bts' },
        { content: 'Full process video', type: 'content' }
      ],
      ugc: [
        { content: 'Look at this!', type: 'showcase' },
        { content: 'Tag the creator!', type: 'cta' }
      ]
    };

    const extras = additionalSlides[type] || additionalSlides.announcement;
    extras.forEach((slide, i) => {
      slides.push({
        number: slides.length + 1,
        content: slide.content,
        type: slide.type,
        suggestion: this._getSuggestion(slide.type)
      });
    });

    // CTA slide
    slides.push({
      number: slides.length + 1,
      content: 'Follow for more! 🔔',
      type: 'cta',
      suggestion: 'Add follow button sticker'
    });

    return slides;
  }

  static _getSuggestion(slideType) {
    const suggestions = {
      hook: 'Use trending audio or eye-catching visual',
      interactive: 'Add poll or question sticker',
      content: 'Use clean, readable text overlay',
      engagement: 'Add poll or slider sticker',
      reveal: 'Use countdown or temp sticker',
      cta: 'Add link or follow sticker',
      teaser: 'Create curiosity gap',
      bts: 'Show raw, unfiltered content',
      showcase: 'Feature user content prominently',
      default: 'Match brand aesthetic'
    };
    return suggestions[slideType] || suggestions.default;
  }

  static getTypes() {
    return [
      { value: 'announcement', label: 'Announcement' },
      { value: 'poll', label: 'Poll / Quiz' },
      { value: 'question', label: 'Question / Q&A' },
      { value: 'behind-scenes', label: 'Behind the Scenes' },
      { value: 'ugc', label: 'User Generated Content' }
    ];
  }
}

export default StoryGenerator;
