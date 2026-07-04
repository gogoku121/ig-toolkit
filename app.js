// Content Generation Data
const contentData = {
  captionOpeners: {
    professional: [
      "Here's what most people don't know about",
      "The key to success with",
      "A lesson I learned the hard way about",
      "The truth about",
      "What the experts won't tell you about"
    ],
    casual: [
      "Can we talk about",
      "Okay but seriously",
      "Not gonna lie",
      "Real talk:",
      "Anyone else?"
    ],
    funny: [
      "Plot twist:",
      "Cue the surprised Pikachu face",
      "When life gives you lemons...",
      "POV:",
      "Plot armor: activated"
    ],
    inspirational: [
      "Remember:",
      "Today's reminder:",
      "Here's the thing about",
      "What if I told you",
      "The journey of"
    ],
    promotional: [
      "Introducing",
      "Get ready for",
      "This is the moment you've been waiting for:",
      "Limited time offer:",
      "Exclusive for you:"
    ]
  },

  captionClosers: {
    professional: [
      "What's your experience been? Share below.",
      "Drop your thoughts in the comments.",
      "Let me know what resonates with you.",
      "Questions? I'm here to help.",
      "Follow for more insights."
    ],
    casual: [
      "Thoughts?",
      "Who else relates?",
      "lmk what you think!",
      "Comment your take below",
      "Agree?!"
    ],
    funny: [
      "No but actually though",
      "IYKYK",
      "This is your sign",
      "You can't make this up",
      "And that's on that"
    ],
    inspirational: [
      "You've got this. 💫",
      "Keep pushing forward.",
      "Believe in the process.",
      "Your journey is unique.",
      "Dream big, start now."
    ],
    promotional: [
      "Link in bio to get started.",
      "Shop now before it's gone!",
      "Don't miss out - grab yours today.",
      "Limited stock available.",
      "Use code SAVE20 for 20% off."
    ]
  },

  hashtags: {
    popular: [
      '#instagram', '#instagood', '#photooftheday', '#instadaily', '#follow',
      '#like4like', '#picoftheday', '#instamood', '#followme', '#lifestyle',
      '#beauty', '#fashion', '#happy', '#cute', '#nature', '#love', '#fun',
      '#smile', '#food', '#sunset', '#travel', '#art', '#photography', '#motivation'
    ],
    fitness: [
      '#fitness', '#fitnessmotivation', '#gym', '#workout', '#health', '#fit',
      '#training', '#fitnessjourney', '#bodybuilding', '#yoga', '#crossfit',
      '#running', '#healthy', '#nutrition', '#strength', '#fitnesslife'
    ],
    food: [
      '#foodie', '#foodporn', '#instafood', '#yummy', '#delicious', '#cooking',
      '#homemade', '#foodphotography', '#healthyfood', '#breakfast', '#dinner',
      '#lunch', '#dessert', '#chef', '#recipe', '#foodstagram'
    ],
    travel: [
      '#travel', '#travelgram', '#wanderlust', '#adventure', '#explore', '#vacation',
      '#travelphotography', '#nature', '#trip', '#holiday', '#instatravel',
      '#travelblogger', '#traveling', '#tourism', '#passport', '#discover'
    ],
    business: [
      '#entrepreneur', '#business', '#success', '#marketing', '#startup',
      '#smallbusiness', '#hustle', '#businessowner', '#motivation', '#ceo',
      '#entrepreneurship', '#branding', '#sales', '#networking', '#leadership'
    ],
    fashion: [
      '#fashion', '#style', '#ootd', '#fashionblogger', '#instafashion',
      '#streetstyle', '#outfitoftheday', '#fashionista', '#stylish', '#clothing',
      '#designer', '#luxury', '#accessories', '#beauty', '#makeup'
    ],
    lifestyle: [
      '#lifestyle', '#life', '#happy', '#love', '#motivation', '#inspiration',
      '#selfcare', '#wellness', '#mindfulness', '#positivevibes', '#goals',
      '#goodvibes', '#mindset', '#growth', '#daily', '#routine'
    ]
  },

  reelsHooks: {
    educational: [
      "Stop doing this if you want to grow",
      "The #1 mistake beginners make",
      "Here's everything you need to know about",
      "Learn this in 60 seconds",
      "POV: You're finally understanding"
    ],
    entertainment: [
      "Wait for it...",
      "Plot twist you didn't see coming",
      "When [situation] hits different",
      "Storytime: The time when",
      "Nobody asked but here we go"
    ],
    'behind-scenes': [
      "What actually happens on a typical day",
      "The truth about [profession/lifestyle]",
      "BTS of my [process/routine]",
      "What nobody tells you about",
      "24 hours in the life of"
    ],
    lifestyle: [
      "Morning routine that changed everything",
      "Day in my life: [theme] edition",
      "Things I wish I knew earlier about",
      "How I [achieve something] in [timeframe]",
      "My honest [review/experience] with"
    ],
    productivity: [
      "5 apps that 10x'd my productivity",
      "The morning routine I swear by",
      "How I get everything done",
      "System that changed my workflow",
      "Time blocking hack nobody talks about"
    ]
  },

  storyStickers: ['Poll', 'Question', 'Quiz', 'Emoji Slider', 'Link', 'Mention', 'Hashtag', 'Countdown', 'Music', 'Location'],
  
  replyTemplates: {
    positive: [
      "Thank you so much! 🙏✨",
      "This means the world to me! 💕",
      "You're too sweet! Love connecting with you!",
      "I appreciate you! 💯",
      "That seriously made my day! 🌟",
      "You're amazing! Thank you for the kind words!",
      "Grateful for people like you! 💫",
      "Wow, thank you! This is why I do what I do!"
    ],
    question: [
      "Great question! The answer is...",
      "I'm glad you asked! Here's the thing...",
      "Thanks for asking! Let me break it down...",
      "Love this question! Here's what I think...",
      "You caught me! The real answer is...",
      "Someone finally asked! Here's everything...",
      "Smart question! Here's my take...",
      "Love the curiosity! Here's how it works..."
    ],
    negative: [
      "I hear you and I appreciate the feedback. Let me try to help...",
      "Sorry you had that experience. Can you DM me more details?",
      "That's not the experience we want you to have. Let's fix this.",
      "Thank you for bringing this to my attention.",
      "I understand your frustration. Here's what we can do...",
      "We value your honesty. Please reach out so we can make it right."
    ],
    sarcastic: [
      "Oh, you noticed! 😂",
      "Thanks for paying attention!",
      "Took you long enough! Just kidding 😂",
      "Wow, the plot thickens!",
      "You cracked the code! 🕵️",
      "Caught me red-handed! 😂",
      "Gold star for you! ⭐",
      "And the award goes to... this person! 🏆"
    ],
    follower: [
      "You're one of my favorites! 💕",
      "Where have you been hiding?! I've missed you!",
      "You always show up and show out! Thank you! 🌟",
      "You're the reason I keep creating! 🙏",
      "This comment deserves more likes! Who agrees?!",
      "You're literally the best! Thank you for always supporting!",
      "Family recognizes family! 💯",
      "I see you! Always here for me! Love you!"
    ]
  },

  storyPrompts: {
    announcement: [
      "Big news incoming... 👀",
      "Can we talk about this for a sec?",
      "Something exciting is happening...",
      "Drop everything and look at this!",
      "You've been waiting for this moment..."
    ],
    poll: [
      "This or that? Your choice!",
      "I need your opinion on something...",
      "Let's settle this once and for all!",
      "What do YOU think?",
      "The people have spoken - now YOU decide!"
    ],
    question: [
      "Q&A time! Ask me anything...",
      "I'm curious about your thoughts...",
      "Help me understand...",
      "Your turn! What do you want to know?",
      "Drop your questions below!"
    ],
    'behind-scenes': [
      "What really goes on behind the gram...",
      "Real talk time...",
      "The unglamorous truth...",
      "BTS of this whole thing...",
      "What my day actually looks like..."
    ],
    ugc: [
      "Reposting this because I love you guys!",
      "Look what you made! 🥹",
      "Community spotlight time!",
      "Your content > My content",
      "Featuring YOU today!"
    ]
  },

  trendingAudio: [
    "Original Sound - trending",
    "Song by @artist - viral TikTok audio",
    "Trending sound - use it before it's old",
    "This song is EVERYWHERE right now",
    "Audio from viral reel - recreate it"
  ]
};

// Utility Functions
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Toast Notification
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  toastMessage.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// Copy to Clipboard
async function copyToClipboard(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    btn.classList.add('copied');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
    showToast('Copied to clipboard!');
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = originalText;
    }, 2000);
  } catch (err) {
    showToast('Failed to copy');
  }
}

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

themeToggle.addEventListener('click', () => {
  const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

if (localStorage.getItem('theme')) {
  html.setAttribute('data-theme', localStorage.getItem('theme'));
}

// Navigation
const navBtns = document.querySelectorAll('.nav-btn');
const toolPanels = document.querySelectorAll('.tool-panel');
const toolTitle = document.getElementById('toolTitle');
const toolDescription = document.getElementById('toolDescription');

const toolInfo = {
  captions: { title: 'Caption Generator', desc: 'Create engaging captions that capture attention and drive engagement' },
  hashtags: { title: 'Hashtag Generator', desc: 'Discover the perfect hashtags to boost your post reach and discovery' },
  reels: { title: 'Reels Ideas Generator', desc: 'Get creative Reels concepts with hooks, scripts, and trending audio suggestions' },
  products: { title: 'Product Description Generator', desc: 'Craft compelling product descriptions that convert browsers into buyers' },
  stories: { title: 'Story Posts Generator', desc: 'Generate engaging Instagram Story concepts that keep your audience hooked' },
  replies: { title: 'Reply Suggestions Generator', desc: 'Never struggle with comments again - get smart reply templates instantly' }
};

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tool = btn.dataset.tool;
    
    navBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    toolPanels.forEach(panel => panel.classList.remove('active'));
    document.getElementById(`panel-${tool}`).classList.add('active');
    
    toolTitle.textContent = toolInfo[tool].title;
    toolDescription.textContent = toolInfo[tool].desc;
  });
});

// Toggle Buttons for Reels
document.querySelectorAll('.toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const parent = btn.parentElement;
    parent.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Slider Value Update
document.getElementById('hashtagCount')?.addEventListener('input', (e) => {
  document.getElementById('hashtagCountValue').textContent = e.target.value;
});

// Loading State
function setLoading(outputId, isLoading) {
  const output = document.getElementById(outputId);
  if (isLoading) {
    output.classList.add('loading');
  } else {
    output.classList.remove('loading');
  }
}

// ==================== GENERATORS ====================

// Caption Generator
async function generateCaptions() {
  const topic = document.getElementById('captionTopic').value.trim();
  const tone = document.getElementById('captionTone').value;
  const length = document.getElementById('captionLength').value;
  
  if (!topic) {
    showToast('Please enter a topic');
    return;
  }
  
  setLoading('captionOutput', true);
  await delay(800);
  
  const openers = contentData.captionOpeners[tone];
  const closers = contentData.captionClosers[tone];
  
  const lengthMap = {
    short: { min: 40, max: 80 },
    medium: { min: 80, max: 150 },
    long: { min: 150, max: 250 }
  };
  
  const { min, max } = lengthMap[length];
  
  const captions = [];
  for (let i = 0; i < 3; i++) {
    const opener = random(openers);
    const closer = random(closers);
    
    let caption = `${opener} ${topic.toLowerCase()}.\n\n`;
    
    const sentences = [
      `It's not just about the destination - it's about the journey.`,
      `Every day is a new opportunity to grow.`,
      `Small steps lead to big changes.`,
      `Consistency is the key to transformation.`,
      `Your mindset determines your outcome.`,
      `Progress, not perfection.`,
      `The best version of yourself is still being built.`,
      `Embrace the process and trust the timing.`,
      `Success isn't always about the outcome - it's about showing up.`,
      `What you focus on grows.`
    ];
    
    const numSentences = Math.floor(Math.random() * 3) + 2;
    const selectedSentences = shuffle(sentences).slice(0, numSentences);
    
    caption += selectedSentences.join(' ');
    
    const emojis = ['✨', '💫', '🙌', '💪', '🚀', '💡', '🔥', '🌟', '💯', '⭐'];
    caption += `\n\n${random(emojis)} ${closer}`;
    
    if (caption.length < min || caption.length > max) {
      caption += '\n\n' + shuffle(sentences).slice(0, 2).join(' ');
    }
    
    captions.push(caption.trim());
  }
  
  const output = document.getElementById('captionOutput');
  output.innerHTML = captions.map(cap => `
    <div class="output-card">
      <div class="output-card-header">
        <span class="output-card-title">Caption ${captions.indexOf(cap) + 1}</span>
        <button class="copy-btn" onclick="copyToClipboard(this.textContent.trim(), this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          Copy
        </button>
      </div>
      <div class="output-card-content caption-text">${cap}</div>
    </div>
  `).join('');
  
  setLoading('captionOutput', false);
}

// Hashtag Generator
async function generateHashtags() {
  const topic = document.getElementById('hashtagTopic').value.trim();
  const count = parseInt(document.getElementById('hashtagCount').value);
  
  if (!topic) {
    showToast('Please enter keywords');
    return;
  }
  
  setLoading('hashtagOutput', true);
  await delay(600);
  
  const keywords = topic.split(',').map(k => k.trim().toLowerCase());
  const selectedCategories = keywords.length > 1 ? shuffle(['popular', 'lifestyle', 'business', 'fitness', 'food', 'travel', 'fashion']).slice(0, 2) : ['popular'];
  
  let allHashtags = [];
  
  // Add popular hashtags
  const popular = shuffle(contentData.hashtags.popular).slice(0, Math.ceil(count * 0.3));
  allHashtags = allHashtags.concat(popular);
  
  // Add category-specific hashtags
  selectedCategories.forEach(cat => {
    if (contentData.hashtags[cat]) {
      const categoryTags = shuffle(contentData.hashtags[cat]).slice(0, Math.ceil(count * 0.25));
      allHashtags = allHashtags.concat(categoryTags);
    }
  });
  
  // Add keyword-based hashtags
  keywords.forEach(kw => {
    const formattedKw = kw.replace(/\s+/g, '');
    allHashtags.push(`#${formattedKw}`, `#${formattedKw}life`, `#${formattedKw}gram`);
  });
  
  // Shuffle and limit
  allHashtags = shuffle([...new Set(allHashtags)]).slice(0, count);
  
  // Split into groups
  const popularTags = allHashtags.slice(0, Math.floor(count * 0.3));
  const nicheTags = allHashtags.slice(Math.floor(count * 0.3), Math.floor(count * 0.6));
  const keywordTags = allHashtags.slice(Math.floor(count * 0.6));
  
  const output = document.getElementById('hashtagOutput');
  output.innerHTML = `
    <button class="copy-btn" style="margin-bottom: 16px; align-self: flex-end;" onclick="copyToClipboard(\`${allHashtags.join(' ')}\`, this)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
      Copy All
    </button>
    ${popularTags.length > 0 ? `
      <div class="hashtag-group">
        <div class="hashtag-group-label">🔥 Popular Hashtags</div>
        <div class="hashtags-container">
          ${popularTags.map(tag => `<span class="hashtag" onclick="copyToClipboard('${tag}', this)">${tag}</span>`).join('')}
        </div>
      </div>
    ` : ''}
    ${nicheTags.length > 0 ? `
      <div class="hashtag-group">
        <div class="hashtag-group-label">🎯 Niche Hashtags</div>
        <div class="hashtags-container">
          ${nicheTags.map(tag => `<span class="hashtag" onclick="copyToClipboard('${tag}', this)">${tag}</span>`).join('')}
        </div>
      </div>
    ` : ''}
    ${keywordTags.length > 0 ? `
      <div class="hashtag-group">
        <div class="hashtag-group-label">💡 Related Hashtags</div>
        <div class="hashtags-container">
          ${keywordTags.map(tag => `<span class="hashtag" onclick="copyToClipboard('${tag}', this)">${tag}</span>`).join('')}
        </div>
      </div>
    ` : ''}
  `;
  
  setLoading('hashtagOutput', false);
}

// Reels Generator
async function generateReels() {
  const category = document.getElementById('reelsCategory').value;
  const audience = document.getElementById('reelsAudience').value.trim();
  const style = document.querySelector('.toggle-btn.active')?.dataset.style || 'trendy';
  
  setLoading('reelsOutput', true);
  await delay(1000);
  
  const hooks = contentData.reelsHooks[category] || contentData.reelsHooks.lifestyle;
  const audienceText = audience || 'your target audience';
  
  const reelsIdeas = [];
  for (let i = 0; i < 5; i++) {
    const hook = random(hooks);
    const durations = ['15-30 sec', '30-60 sec', '60-90 sec'];
    const styles = style === 'trendy' 
      ? ['Fast-paced cuts', 'Trending audio', 'Text overlays', 'Green screen effect']
      : ['Educational text', 'Step-by-step', 'Before/after', 'Clean transitions'];
    
    reelsIdeas.push({
      title: `${hook} ${category === 'educational' ? '🔢' : category === 'entertainment' ? '😂' : category === 'behind-scenes' ? '🎬' : '✨'}`,
      duration: random(durations),
      style: random(styles),
      script: generateScript(category, hook, audienceText)
    });
  }
  
  const output = document.getElementById('reelsOutput');
  output.innerHTML = reelsIdeas.map((reel, i) => `
    <div class="reel-card">
      <div class="reel-header">
        <span class="reel-number">${i + 1}</span>
        <span class="reel-title">${reel.title}</span>
      </div>
      <div class="reel-meta">
        <span>⏱️ ${reel.duration}</span>
        <span>📹 ${reel.style}</span>
        <span>🎵 ${random(contentData.trendingAudio)}</span>
      </div>
      <div class="reel-content">
        <strong>Hook (first 3 sec):</strong> Start with ${random(['a question', 'a bold statement', 'eye contact with camera', 'quick text reveal'])}\n
        <strong>Script outline:</strong> ${reel.script}\n
        <strong>CTA:</strong> ${random(['Follow for more!', 'Save this for later!', 'Tag someone who needs this!', 'Share your thoughts in comments!'])}
      </div>
      <button class="copy-btn" style="margin-top: 12px;" onclick="copyToClipboard(\`${reel.title}\n\nHook: ${reel.script}\nDuration: ${reel.duration}\nStyle: ${reel.style}\`, this)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        Copy Idea
      </button>
    </div>
  `).join('');
  
  setLoading('reelsOutput', false);
}

function generateScript(category, hook, audience) {
  const scripts = {
    educational: [
      `1. Hook (0-3s)\n2. Break down the topic into 3 key points\n3. Explain each point with a quick example\n4. Summary and key takeaway\n5. CTA: "Follow for more tips"`,
      `1. Hook - ask a common question\n2. Share the common misconception\n3. Reveal the truth with evidence\n4. Give actionable steps\n5. CTA: "Save this for later!"`,
      `1. Start with "Here's the thing"\n2. Point 1 with visual demonstration\n3. Point 2 with real-life example\n4. Point 3 quick win tip\n5. Wrap up with motivation`
    ],
    entertainment: [
      `1. Start with relatable situation\n2. Escalate the comedy\n3. Unexpected twist ending\n4. Tag/reaction at the end\n5. Trending sound throughout`,
      `1. POV opening scene\n2. Build up the story\n3. Punchline delivery\n4. Reaction shot\n5. Use trending audio`,
      `1. Set up the scenario\n2. Build anticipation\n3. The reveal moment\n4. Comedic payoff\n5. Call to action`
    ],
    'behind-scenes': [
      `1. Quick intro to setting\n2. Show your process/workflow\n3. Share a challenge you faced\n4. How you solved it\n5. BTS tips viewers can use`,
      `1. Morning routine intro\n2. Show the prep work\n3. Main activity/dreation\n4. The "glamorous" reality\n5. Wrap up and CTA`,
      `1. Start with "What nobody tells you"\n2. Show the messy reality\n3. Contrast with perception\n4. Honest commentary\n5. Ask followers about their experience`
    ],
    lifestyle: [
      `1. Morning setup shot\n2. Walk through your routine\n3. Show products/tools used\n4. Share 1-2 tips\n5. End with "Day X" outro`,
      `1. Hook: "Here's how I..."\n2. Quick montage of process\n3. Share the results\n4. Products/resources in text\n5. "Try this" CTA`,
      `1. Before/after reveal\n2. Walk through transformation\n3. Key steps highlighted\n4. Share honest review\n5. Recommendation CTA`
    ],
    productivity: [
      `1. Hook: Problem statement\n2. Solution preview\n3. Deep dive into tips\n4. Show real examples\n5. "Save this" CTA`,
      `1. Start with relatable struggle\n2. My morning routine setup\n3. Walk through each tool\n4. Show the results\n5. Free resource link`,
      `1. "Stop doing X, start doing Y"\n2. Explain why X fails\n3. Introduce Y as solution\n4. Show how to implement\n5. Encourage to save`
    ]
  };
  
  return random(scripts[category] || scripts.lifestyle);
}

// Product Description Generator
async function generateProductDesc() {
  const name = document.getElementById('productName').value.trim();
  const features = document.getElementById('productFeatures').value.trim();
  const price = document.getElementById('productPrice').value.trim();
  const audience = document.getElementById('productAudience').value.trim();
  
  if (!name) {
    showToast('Please enter a product name');
    return;
  }
  
  setLoading('productOutput', true);
  await delay(900);
  
  const featureList = features ? features.split(',').map(f => f.trim()) : ['Premium quality', 'Easy to use', 'Great value'];
  const audienceText = audience || 'customers';
  
  const variations = [
    {
      label: 'Version 1: Benefit-Focused',
      text: `✨ Introducing ${name} ✨

Transform your ${audienceText} experience with ${name}. This isn't just another product - it's the solution you've been searching for.

${featureList.slice(0, 3).map(f => `• ${f}`).join('\n')}

${price ? `💰 Priced at ${price} - an investment in yourself.` : ''}

Ready to make the change? Tap the link in bio to learn more.

#${name.replace(/\s+/g, '')} #ProductLaunch #MustHave`,
      highlights: featureList.slice(0, 4)
    },
    {
      label: 'Version 2: Story-Driven',
      text: `Let me tell you about ${name} 👇

I used to struggle with ${shuffle(['finding the right solution', 'getting results', 'staying consistent', 'seeing progress']).pop()}. Then I found ${name}.

Here's what makes it different:

${featureList.map((f, i) => `${i + 1}. ${capitalizeFirst(f)}`).join('\n')}

${audience ? `Designed specifically for ${audienceText}.\n` : ''}${price ? `Now available for ${price}.\n` : ''}
This could be exactly what you need.

Drop a 🔥 if you're ready to level up!`,
      highlights: featureList.slice(0, 3)
    },
    {
      label: 'Version 3: Direct & Punchy',
      text: `${name}.

That's it. That's the product.

✅ ${featureList[0]}
✅ ${featureList[1] || 'Premium quality'}
✅ ${featureList[2] || 'Fast results'}

${price ? `💰 ${price}\n` : ''}
👆 Link in bio

No fluff. No BS. Just results.

Tag someone who needs this! 👇`,
      highlights: featureList.slice(0, 3)
    }
  ];
  
  const output = document.getElementById('productOutput');
  output.innerHTML = variations.map((v, i) => `
    <div class="product-variation">
      <div class="variation-label">${v.label}</div>
      <div class="product-text">${v.text}</div>
      <div class="product-highlights">
        ${v.highlights.map(h => `<div class="highlight-item">${h}</div>`).join('')}
      </div>
      <button class="copy-btn" style="margin-top: 12px;" onclick="copyToClipboard(\`${v.text}\`, this)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        Copy
      </button>
    </div>
  `).join('');
  
  setLoading('productOutput', false);
}

// Story Generator
async function generateStories() {
  const type = document.getElementById('storyType').value;
  const topic = document.getElementById('storyTopic').value.trim();
  
  setLoading('storyOutput', true);
  await delay(700);
  
  const prompts = contentData.storyPrompts[type] || contentData.storyPrompts.announcement;
  const topicText = topic || (type === 'announcement' ? 'something exciting' : 'this topic');
  
  const ideas = [];
  for (let i = 0; i < 5; i++) {
    const slides = [];
    const numSlides = Math.floor(Math.random() * 3) + 4;
    
    slides.push({
      content: random(prompts),
      type: 'Hook'
    });
    
    slides.push({
      content: `Share your thoughts in 3 words!`,
      type: 'Interactive'
    });
    
    slides.push({
      content: topicText,
      type: 'Content'
    });
    
    slides.push({
      content: `Yes! 🙌 / Not really 🤔`,
      type: 'Poll'
    });
    
    if (numSlides > 4) {
      slides.push({
        content: `${random(['Behind the scenes', 'Full story', 'The details', 'What really happened'])}...`,
        type: 'Content'
      });
    }
    
    slides.push({
      content: `Follow for more! 🔔`,
      type: 'CTA'
    });
    
    const stickers = shuffle(contentData.storyStickers).slice(0, 3);
    
    ideas.push({
      title: `Story Series ${i + 1}`,
      slides,
      stickers,
      time: random(['9 AM - 12 PM', '12 PM - 3 PM', '5 PM - 8 PM', '7 PM - 10 PM'])
    });
  }
  
  const output = document.getElementById('storyOutput');
  output.innerHTML = ideas.map((idea, i) => `
    <div class="story-card">
      <div class="output-card-header">
        <span class="output-card-title">${idea.title}</span>
        <span style="font-size: 11px; color: var(--text-muted);">📅 ${idea.time}</span>
      </div>
      ${idea.slides.map((slide, j) => `
        <div class="story-slide">
          <span class="slide-number">${j + 1}</span>
          <span class="slide-content">${slide.content}</span>
        </div>
      `).join('')}
      <div class="story-meta">
        ${idea.stickers.map(s => `<span>${s} Sticker</span>`).join('')}
        <span>⏱️ 5-7 slides</span>
      </div>
      <button class="copy-btn" style="margin-top: 12px;" onclick="copyToClipboard(\`${idea.slides.map(s => s.content).join('\n')}\`, this)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        Copy Slides
      </button>
    </div>
  `).join('');
  
  setLoading('storyOutput', false);
}

// Reply Generator
async function generateReplies() {
  const type = document.getElementById('replyType').value;
  const context = document.getElementById('replyContext').value.trim();
  
  setLoading('replyOutput', true);
  await delay(500);
  
  const templates = contentData.replyTemplates[type] || contentData.replyTemplates.positive;
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
    replies.splice(4, 0, 
      `Love this! Especially the ${random(['first point', 'last part', 'main idea', 'approach'])} ${contextText} 💯`,
      `This is exactly what I needed ${contextText}! Thank you! 🙌`
    );
  }
  
  const output = document.getElementById('replyOutput');
  output.innerHTML = replies.slice(0, 10).map((reply, i) => `
    <div class="reply-item">
      <span style="color: var(--text-muted); font-size: 11px;">#${i + 1}</span>
      <span class="reply-text">${reply}</span>
      <button class="copy-btn" onclick="copyToClipboard(\`${reply}\`, this)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
      </button>
    </div>
  `).join('');
  
  setLoading('replyOutput', false);
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  
  const shortcuts = {
    '1': 'captions',
    '2': 'hashtags',
    '3': 'reels',
    '4': 'products',
    '5': 'stories',
    '6': 'replies'
  };
  
  if (shortcuts[e.key]) {
    document.querySelector(`[data-tool="${shortcuts[e.key]}"]`).click();
  }
  
  if (e.key === 'g' || e.key === 'G') {
    const activeTool = document.querySelector('.nav-btn.active')?.dataset.tool;
    if (activeTool) {
      const generateFns = {
        captions: generateCaptions,
        hashtags: generateHashtags,
        reels: generateReels,
        products: generateProductDesc,
        stories: generateStories,
        replies: generateReplies
      };
      generateFns[activeTool]?.();
    }
  }
});
