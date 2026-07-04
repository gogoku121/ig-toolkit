// Structured Content Engine
// Generates content with: Hook → Insight → Value → Emotion → Takeaway → CTA

import { shuffle, random, capitalizeFirst } from '../contentData.js';
import { TopicClassifier } from './TopicClassifier.js';

export class StructuredContentEngine {
  constructor() {
    this.classifier = new TopicClassifier();
    this.usedItems = {
      hooks: [],
      insights: [],
      emotions: [],
      ctas: [],
      patterns: [],
      vocabulary: [],
      sentenceStructures: []
    };
  }

  // Main generation method
  generate(options = {}) {
    const {
      topic,
      personality = 'default',
      goal = 'engage',
      audience = 'general',
      tone = 'casual',
      pattern = 'auto'
    } = options;

    // Classify topic
    const classification = this.classifier.classify(topic);
    const { category, context, customKeywords } = classification;

    // Select storytelling pattern
    const selectedPattern = pattern === 'auto' 
      ? this._selectPattern(goal, category)
      : pattern;

    // Generate each section
    const sections = {
      hook: this._generateHook(topic, personality, category, context),
      insight: this._generateInsight(topic, personality, category, context, audience),
      value: this._generateValue(topic, personality, category, context, audience),
      emotion: this._generateEmotion(topic, personality, category, context),
      takeaway: this._generateTakeaway(topic, personality, category, context, goal),
      cta: this._generateCTA(goal, personality, category)
    };

    // Assemble based on pattern
    const content = this._assemble(selectedPattern, sections, topic, personality, context);

    // Track used items for diversity
    this._trackUsedItems(sections, selectedPattern);

    // Score the result
    const score = this._scoreContent(content, sections, goal);

    return {
      content,
      sections,
      pattern: selectedPattern,
      score,
      category,
      personality,
      goal
    };
  }

  _selectPattern(goal, category) {
    const patternsByGoal = {
      educate: ['listicle', 'case study', 'comparison', 'problem solution'],
      entertain: ['storytelling', 'behind scenes', 'comparison'],
      inspire: ['storytelling', 'before after', 'myth truth'],
      sell: ['problem solution', 'comparison', 'testimonial'],
      'build trust': ['case study', 'behind scenes', 'testimonial'],
      'generate comments': ['question answer', 'poll', 'controversial'],
      'generate shares': ['shocking', 'viral', 'comparison'],
      'generate saves': ['educational', 'listicle', 'resource']
    };

    const patterns = patternsByGoal[goal] || patternsByGoal.entertain;
    return this.classifier.getUnused('patterns', patterns);
  }

  _generateHook(topic, personality, category, context) {
    const hooksByPersonality = {
      'viral creator': [
        `POV: You just discovered the ${topic} secret nobody talks about`,
        `Wait for it... (everything about ${topic})`,
        `Nobody is talking about this ${topic} thing and it's driving me crazy`,
        `Breaking: ${topic} just changed forever`,
        `I tried the ${topic} thing for 30 days and...`,
        `The ${topic} mistake that cost me YEARS`,
        `This ${topic} hack changed everything about my approach`
      ],
      'luxury brand': [
        `Introducing the art of ${topic}`,
        `Where precision meets ${topic} excellence`,
        `The pursuit of ${topic} perfection`,
        `Crafted for those who appreciate ${topic} mastery`,
        `Discover the ${topic} experience`,
        `Elevate your understanding of ${topic}`
      ],
      'startup founder': [
        `We spent 6 months building ${topic} and here's what we learned`,
        `The ${topic} truth nobody tells you`,
        `Why ${topic} will define the next decade`,
        `Hot take: Most people get ${topic} completely wrong`,
        `The ${topic} framework that scaled our business 10x`,
        `Unpopular opinion: ${topic} is overrated`
      ],
      'gen z': [
        `no bc someone actually explained ${topic} to me finally`,
        `the way i wish someone told me about ${topic} sooner`,
        `rating ${topic} on a scale of big yikes to no thoughts head empty`,
        `main character energy: ${topic} edition`,
        `not me realizing the truth about ${topic} 💀`,
        `${topic} but make it a plot twist`
      ],
      'minimalist': [
        `On ${topic}: A simpler perspective`,
        `What matters in ${topic}`,
        `The essential truth about ${topic}`,
        `Less about ${topic}, more about growth`,
        `The ${topic} fundamentals`
      ],
      'funny': [
        `${topic} explained like you're a 5 year old (you're not)`,
        `POV: ${topic} hits different after age 30`,
        `When ${topic} goes wrong but make it a rom-com`,
        `I asked ChatGPT about ${topic} and honestly? Same vibes`,
        `${topic} checklist (don't @ me)`,
        `Plot twist: ${topic} edition`
      ],
      'storyteller': [
        `Three years ago, I almost gave up on ${topic}. Here's what changed.`,
        `The ${topic} story that still gives me chills`,
        `What nobody tells you about the ${topic} journey`,
        `A moment that redefined how I see ${topic}`,
        `The ${topic} chapter I never share publicly`
      ],
      'educational': [
        `${capitalizeFirst(topic)} 101: What you need to know`,
        `The complete guide to understanding ${topic}`,
        `${capitalizeFirst(topic)} fundamentals explained`,
        `Why ${topic} matters more than you think`,
        `Everything you've got wrong about ${topic}`,
        `The ${topic} blueprint for beginners`
      ],
      'corporate': [
        `Strategic insights on ${topic} for modern organizations`,
        `Leveraging ${topic} for competitive advantage`,
        `Key considerations for ${topic} optimization`,
        `Industry perspective: The state of ${topic}`,
        `Driving value through ${topic} excellence`
      ],
      'premium brand': [
        `The ${topic} standard you've been searching for`,
        `Experience the difference in ${topic} mastery`,
        `Redefining excellence in ${topic}`,
        `For those who accept only the best in ${topic}`,
        `The ${topic} distinction that matters`
      ],
      'influencer': [
        `Hi besties! Let's talk ${topic} 🫶`,
        `Grwm for ${topic} talk (get ready with me)`,
        `Things I wish I knew about ${topic} sooner`,
        `Full transparency: My ${topic} journey`,
        `The ${topic} content you asked for!`
      ],
      'emotional': [
        `Why ${topic} matters more than I ever imagined`,
        `The ${topic} truth that broke me open`,
        `What ${topic} taught me about myself`,
        `The ${topic} moment I'll never forget`,
        `This ${topic} journey is changing me`
      ],
      'luxury lifestyle': [
        `Living beautifully with ${topic}`,
        `The ${topic} philosophy of an intentional life`,
        `Curating your best ${topic} experience`,
        `Refined perspectives on ${topic} excellence`,
        `The art of ${topic} in everyday moments`
      ],
      default: [
        `Everything you need to know about ${topic}`,
        `Let's talk ${topic}`,
        `The ${topic} guide you've been waiting for`,
        `Why ${topic} deserves your attention`,
        `My honest take on ${topic}`
      ]
    };

    const hooks = hooksByPersonality[personality] || hooksByPersonality.default;
    const hook = this.classifier.getUnused('hooks', hooks);
    this.classifier.trackUsed('hooks', hook);
    
    return hook;
  }

  _generateInsight(topic, personality, category, context, audience) {
    const insights = context.vocabulary.slice(0, 15);
    const selectedInsight = this.classifier.getUnused('insights', insights);
    
    const audienceModifiers = {
      beginners: `If you're just starting with ${topic}, here's the thing:`,
      professionals: `Here's what the ${topic} experts won't tell you:`,
      students: `The ${topic} lesson I wish someone taught me in school:`,
      creators: `As creators, we often overlook ${topic}, but:`,
      entrepreneurs: `When it comes to ${topic} and building a business:`,
      parents: `What nobody tells you about ${topic} when you have kids:`,
      'fitness enthusiasts': `Deep dive into the ${topic} science:`,
      general: `Here's the ${topic} insight that changed my perspective:`
    };

    const modifier = audienceModifiers[audience] || audienceModifiers.general;
    const insightPhrase = this._varySentenceStructure([
      `The key is understanding how ${topic} connects to what you actually want`,
      `What most people miss is the relationship between consistency and ${topic}`,
      `Here's the thing about ${topic} that took me years to learn`,
      `The surprising connection between ${topic} and long-term success`,
      `Most advice about ${topic} ignores this fundamental truth`
    ]);

    return `${modifier}\n\n${insightPhrase}`;
  }

  _generateValue(topic, personality, category, context, audience) {
    const aspects = context.aspects;
    const valueTemplates = [
      `When you nail ${topic}, you unlock ${aspects[0]}, ${aspects[1]}, and real ${aspects[2]}`,
      `The ${topic} trifecta: understanding, application, and results\n\n- ${capitalizeFirst(aspects[3])}: What it means\n- ${capitalizeFirst(aspects[4])}: How to get there\n- ${capitalizeFirst(aspects[5])}: What it looks like`,
      `Here's what actually works with ${topic}:\n\n1. Start with the basics\n2. Build momentum\n3. Measure what matters\n4. Adjust based on feedback\n5. Stay consistent`,
      `Three things that transformed my ${topic} approach:\n\n→ ${capitalizeFirst(aspects[6])}\n→ ${capitalizeFirst(aspects[7])}\n→ Understanding the bigger picture`,
      `The ${topic} breakdown you've been looking for:\n\n• Core concept: ${aspects[0]}\n• Key strategy: ${aspects[1]}\n• Common mistake: ${aspects[2]}\n• Secret weapon: ${aspects[3]}`
    ];

    return this.classifier.getUnused('vocabulary', valueTemplates);
  }

  _generateEmotion(topic, personality, category, context) {
    const emotions = context.emotions;
    const emotionTemplates = {
      'viral creator': [
        `And can we talk about how ${topic} makes you feel SO seen? 🙌`,
        `The ${emotions[0]} I felt when I finally understood ${topic}...`,
        `Not me getting emotional about ${topic} 😭`,
        `${topic} hits different when you get it right`
      ],
      'luxury brand': [
        `There's something deeply satisfying about mastering ${topic}`,
        `The refined approach to ${topic} brings quiet confidence`,
        `Appreciating the elegance in proper ${topic} technique`
      ],
      'gen z': [
        `lowkey obsessed with how ${topic} changed my whole vibe`,
        `the ${emotions[0]} is REAL when you get ${topic} right`,
        `okay but ${topic} unlocked something in me`,
        `me after understanding ${topic}: 🗣️🔥`
      ],
      'storyteller': [
        `I'll never forget the day I understood ${topic}. The feeling of ${emotions[0]} was overwhelming.`,
        `That moment of clarity about ${topic} — pure ${emotions[1]}.`,
        `The ${topic} journey is really a story about ${emotions[2]}.`
      ],
      'funny': [
        `And THEN I realized I had been doing ${topic} wrong the whole time 😅`,
        `${topic} thought process: confusion → frustration → enlightenment → more confusion`,
        `Plot twist: ${topic} is actually pretty simple once you stop overcomplicating it`
      ],
      default: [
        `That feeling when you finally get ${topic} right — pure ${emotions[0]} ✨`,
        `There's something about ${topic} that just hits different`,
        `The ${emotions[1]} of mastering ${topic} is unmatched`
      ]
    };

    const templates = emotionTemplates[personality] || emotionTemplates.default;
    return this.classifier.getUnused('emotions', templates);
  }

  _generateTakeaway(topic, personality, category, context, goal) {
    const takeawaysByGoal = {
      educate: [
        `Key takeaway: ${topic} requires understanding the fundamentals before advancing`,
        `Remember: With ${topic}, consistency beats perfection every time`,
        `The ${topic} lesson: Start where you are, use what you have, do what you can`
      ],
      entertain: [
        `So here's the thing about ${topic}... it never gets old`,
        `${capitalizeFirst(topic)} tip: Take what works, leave what doesn't`,
        `At the end of the day, ${topic} is about enjoying the process`
      ],
      inspire: [
        `This is your sign to take ${topic} seriously`,
        `The ${topic} journey is worth every step. Trust me.`,
        `You don't have to be perfect at ${topic}. You just have to start.`
      ],
      sell: [
        `Here's what makes our approach to ${topic} different:\nquality, consistency, and real results`,
        `When you invest in ${topic}, you're investing in yourself`,
        `The ROI on mastering ${topic} is infinite`
      ],
      'build trust': [
        `What I've learned about ${topic} comes from real experience, real results`,
        `The truth about ${topic} takes time to understand. Be patient.`,
        `My ${topic} approach is built on transparency and honest effort`
      ],
      'generate comments': [
        `What's your take on ${topic}? Drop your thoughts below 👇`,
        `Agree or disagree? I want to hear your ${topic} perspective`,
        `AMA about ${topic} — ask me anything in the comments`
      ],
      'generate shares': [
        `Tag someone who needs to see this about ${topic} 🔄`,
        `Send this to your friend who's struggling with ${topic}`,
        `Someone who wants to win at ${topic} needs this 🔖`
      ],
      'generate saves': [
        `Save this for later — you'll want to revisit ${topic}`,
        `Bookmark this ${topic} guide for future reference`,
        `The ${topic} resource you'll actually use`
      ]
    };

    const takeaways = takeawaysByGoal[goal] || takeawaysByGoal.entertain;
    return this.classifier.getUnused('vocabulary', takeaways);
  }

  _generateCTA(goal, personality, category) {
    const ctasByGoal = {
      educate: ['Follow for more insights like this', 'Save this post', 'Share with someone learning'],
      entertain: ['Follow for more', 'Turn on notifications', 'Comment your take'],
      inspire: ['Follow for daily motivation', 'Save this', 'Share with someone who needs this'],
      sell: ['Shop now', 'Link in bio', 'DM for more info', 'Get started today'],
      'build trust': ['Follow the journey', 'Check out our other content', 'Learn more about us'],
      'generate comments': ['Comment below', 'Tell me your story', 'What's your experience?'],
      'generate shares': ['Tag a friend', 'Share this post', 'Spread the word'],
      'generate saves': ['Save this', 'Bookmark for later', 'Add to your collection']
    };

    const ctasByPersonality = {
      'viral creator': [
        `Follow for more ${ctasByGoal[goal]?.[0] || 'content like this'} 🔥`,
        `Drop a ❤️ if this helped`,
        `Share this with someone who needs to see this`,
        `Comment "tips" if you want more ${goal === 'educate' ? 'educational' : 'content'}`
      ],
      'luxury brand': [
        `Experience excellence. Follow for curated insights.`,
        `Discover more in our collection.`,
        `Elevate your journey with us.`
      ],
      'gen z': [
        `follow for more 🫶`,
        `this was so helpful ngl`,
        `lmk in comments what you want next!`,
        `share this w ur bestie fr fr`
      ],
      'startup founder': [
        `Building something in this space? Let's connect.`,
        `Follow for behind-the-scenes content.`,
        `DM me — I reply to everyone.`
      ],
      'influencer': [
        `Thanks for being here 💕`,
        `Follow for more content like this!`,
        `Questions? Drop them below!`
      ],
      default: [
        `Follow for more like this!`,
        `Save this post for later 📌`,
        `Share your thoughts in the comments`,
        `Tag someone who should see this`
      ]
    };

    const ctas = ctasByPersonality[personality] || ctasByPersonality.default;
    const cta = this.classifier.getUnused('ctas', ctas);
    this.classifier.trackUsed('ctas', cta);
    return cta;
  }

  _assemble(pattern, sections, topic, personality, context) {
    const patterns = {
      'before after': this._assembleBeforeAfter(sections, topic),
      'problem solution': this._assembleProblemSolution(sections, topic),
      'storytelling': this._assembleStorytelling(sections, topic, context),
      'listicle': this._assembleListicle(sections, topic, context),
      'case study': this._assembleCaseStudy(sections, topic),
      'comparison': this._assembleComparison(sections, topic),
      'question answer': this._assembleQandA(sections, topic),
      'behind scenes': this._assembleBTS(sections, topic),
      'testimonial': this._assembleTestimonial(sections, topic),
      'myth truth': this._assembleMythTruth(sections, topic),
      default: this._assembleDefault(sections)
    };

    return patterns[pattern] || patterns.default;
  }

  _assembleBeforeAfter(sections, topic) {
    return `${sections.hook}\n\n` +
      `BEFORE:\nThe old way of thinking about ${topic} kept me stuck. I was doing everything wrong without even knowing it.\n\n` +
      `${sections.insight}\n\n` +
      `AFTER:\nEverything changed when I understood ${topic} differently. Now:\n` +
      `${sections.value}\n\n` +
      `${sections.emotion}\n\n` +
      `${sections.takeaway}\n\n` +
      `${sections.cta}`;
  }

  _assembleProblemSolution(sections, topic) {
    return `${sections.hook}\n\n` +
      `THE PROBLEM:\nMost people struggle with ${topic}. They try everything but nothing seems to work.\n\n` +
      `THE SOLUTION:\n${sections.insight}\n\n` +
      `HOW IT WORKS:\n${sections.value}\n\n` +
      `${sections.emotion}\n\n` +
      `${sections.takeaway}\n\n` +
      `${sections.cta}`;
  }

  _assembleStorytelling(sections, topic, context) {
    return `${sections.hook}\n\n` +
      `${sections.insight}\n\n` +
      `${sections.value}\n\n` +
      `${sections.emotion}\n\n` +
      `${sections.takeaway}\n\n` +
      `${sections.cta}`;
  }

  _assembleListicle(sections, topic, context) {
    const items = context.aspects.slice(0, 5);
    return `${sections.hook}\n\n` +
      `Here's what you need to know about ${topic}:\n\n` +
      items.map((item, i) => `${i + 1}. ${capitalizeFirst(item)}: ${this._generateListItem(item, topic)}`).join('\n\n') +
      `\n\n${sections.emotion}\n\n` +
      `${sections.takeaway}\n\n` +
      `${sections.cta}`;
  }

  _generateListItem(aspect, topic) {
    const items = {
      quality: `The foundation of everything ${topic}-related`,
      benefits: `Why ${topic} actually matters`,
      features: `What makes ${topic} effective`,
      value: `The return on investing in ${topic}`,
      experience: `How ${topic} feels in practice`,
      results: `What you can expect from ${topic}`,
      impact: `The ripple effect of good ${topic}`,
      outcomes: `Where ${topic} can take you`
    };
    return items[aspect] || `The essential truth about ${aspect} in ${topic}`;
  }

  _assembleCaseStudy(sections, topic) {
    return `${sections.hook}\n\n` +
      `THE SETUP:\nWhen I first encountered ${topic}, I had no idea it would change everything.\n\n` +
      `THE CHALLENGE:\n${sections.insight}\n\n` +
      `THE APPROACH:\n${sections.value}\n\n` +
      `THE RESULT:\n${sections.emotion}\n\n` +
      `${sections.takeaway}\n\n` +
      `${sections.cta}`;
  }

  _assembleComparison(sections, topic) {
    return `${sections.hook}\n\n` +
      `Option A vs Option B — let's break it down:\n\n` +
      `OPTION A: The traditional approach to ${topic}\n` +
      `OPTION B: The modern ${topic} strategy\n\n` +
      `THE REAL ANSWER:\n${sections.insight}\n\n` +
      `${sections.value}\n\n` +
      `${sections.emotion}\n\n` +
      `${sections.takeaway}\n\n` +
      `${sections.cta}`;
  }

  _assembleQandA(sections, topic) {
    return `${sections.hook}\n\n` +
      `Q: What is the biggest misconception about ${topic}?\nA: ${sections.insight}\n\n` +
      `Q: How do I actually improve at ${topic}?\nA: ${sections.value}\n\n` +
      `Q: What should I expect?\nA: ${sections.takeaway}\n\n` +
      `${sections.emotion}\n\n` +
      `${sections.cta}`;
  }

  _assembleBTS(sections, topic) {
    return `${sections.hook}\n\n` +
      `What actually goes into ${topic}:\n\n` +
      `${sections.value}\n\n` +
      `Behind the scenes, it's about:\n` +
      `• ${sections.insight}\n` +
      `• The real work nobody sees\n\n` +
      `${sections.emotion}\n\n` +
      `${sections.takeaway}\n\n` +
      `${sections.cta}`;
  }

  _assembleTestimonial(sections, topic) {
    return `${sections.hook}\n\n` +
      `"${this._varySentenceStructure([
        `I never understood ${topic} until I tried this approach. Now it's a game-changer.`,
        `This ${topic} method completely transformed my perspective.`,
        `If you're serious about ${topic}, this is the way. Trust me.`
      ])}"\n\n` +
      `Here's why it works:\n${sections.value}\n\n` +
      `${sections.emotion}\n\n` +
      `${sections.takeaway}\n\n` +
      `${sections.cta}`;
  }

  _assembleMythTruth(sections, topic) {
    return `${sections.hook}\n\n` +
      `MYTH: ${this._varySentenceStructure([
        `${topic} is one-size-fits-all`,
        `You need expensive tools for ${topic}`,
        `${topic} happens overnight`,
        `There's a secret shortcut to ${topic}`
      ])}\n\n` +
      `TRUTH:\n${sections.insight}\n\n` +
      `${sections.value}\n\n` +
      `${sections.emotion}\n\n` +
      `${sections.takeaway}\n\n` +
      `${sections.cta}`;
  }

  _assembleDefault(sections) {
    return `${sections.hook}\n\n` +
      `${sections.insight}\n\n` +
      `${sections.value}\n\n` +
      `${sections.emotion}\n\n` +
      `${sections.takeaway}\n\n` +
      `${sections.cta}`;
  }

  _varySentenceStructure(sentences) {
    const shuffled = shuffle(sentences);
    return shuffled[0];
  }

  _trackUsedItems(sections, pattern) {
    this.classifier.trackUsed('hooks', sections.hook);
    this.classifier.trackUsed('ctas', sections.cta);
    this.classifier.trackUsed('patterns', pattern);
  }

  _scoreContent(content, sections, goal) {
    let score = 0;
    let maxScore = 0;

    // Hook strength (20 points)
    maxScore += 20;
    const hookWords = ['secret', 'truth', 'discover', 'mistake', 'hacks', 'tips', 'everything', 'nobody'];
    if (hookWords.some(w => sections.hook.toLowerCase().includes(w))) score += 10;
    if (sections.hook.length > 20 && sections.hook.length < 200) score += 10;

    // Emotional impact (20 points)
    maxScore += 20;
    const emotionWords = ['feel', 'felt', 'never forget', 'changed', 'transformed', 'amazing', 'incredible'];
    if (emotionWords.some(w => content.toLowerCase().includes(w))) score += 10;
    if (sections.emotion.includes('\n')) score += 10;

    // Readability (20 points)
    maxScore += 20;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgLength = sentences.reduce((a, s) => a + s.trim().length, 0) / sentences.length;
    if (avgLength > 30 && avgLength < 150) score += 20;
    else if (avgLength > 20 && avgLength < 200) score += 10;

    // CTA strength (20 points)
    maxScore += 20;
    const ctaWords = ['follow', 'share', 'comment', 'save', 'tag', 'dm', 'link in bio'];
    if (ctaWords.some(w => sections.cta.toLowerCase().includes(w))) score += 20;

    // Variety/uniqueness (20 points)
    maxScore += 20;
    const uniqueWords = new Set(content.toLowerCase().split(/\s+/));
    const varietyRatio = uniqueWords.size / content.split(/\s+/).length;
    score += Math.round(varietyRatio * 20);

    // Goal alignment bonus (up to 10 points)
    const goalAlignment = {
      'generate comments': content.includes('?') ? 10 : 0,
      'generate shares': (content.includes('tag') || content.includes('share')) ? 10 : 0,
      'generate saves': content.includes('save') ? 10 : 0,
      sell: content.includes('link in bio') || content.includes('shop') ? 10 : 0,
      educate: content.includes(':') ? 5 : 0,
      inspire: content.includes('!') ? 5 : 0
    };
    score += goalAlignment[goal] || 0;
    maxScore += 10;

    return {
      total: score,
      max: maxScore,
      percentage: Math.round((score / maxScore) * 100)
    };
  }
}

export default StructuredContentEngine;
