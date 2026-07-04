/**
 * Topic Packs - Comprehensive structured knowledge for content generation
 * Each topic contains: facts, pain points, misconceptions, trends, comparisons,
 * expert tips, beginner mistakes, and practical examples
 */

export const TOPIC_PACKS = {
  // =========================================================================
  // TECHNOLOGY & AI
  // =========================================================================
  ai: {
    name: 'AI',
    category: 'technology',
    facts: [
      'GPT-4 has approximately 1.76 trillion parameters',
      'The term "artificial intelligence" was first coined in 1956 at Dartmouth',
      'AI can now pass the bar exam, medical licensing exam, and coding interviews',
      'ChatGPT reached 100 million users in just 2 months - fastest growing app ever',
      'AI models require massive amounts of energy to train - one training run = 5 cars\' lifetime emissions',
      'The AI market is projected to reach $407 billion by 2027',
      'AI writing detection tools have significant false positive rates',
      'Over 75% of developers now use AI coding assistants'
    ],
    painPoints: [
      'Hours spent crafting perfect prompts that still yield mediocre results',
      'Output looks great but contains subtle factual errors',
      'Cannot trust AI outputs without extensive fact-checking',
      'Hard to get consistent tone across multiple generations',
      'Context window limitations force awkward workarounds',
      'AI feels cold and robotic despite optimization attempts',
      'Uncertainty about what AI can and cannot do reliably',
      'Productivity gains hard to measure or demonstrate'
    ],
    misconceptions: [
      { myth: 'AI will replace most jobs', truth: 'AI augments human work rather than replacing it entirely. Jobs transform, not disappear.' },
      { myth: 'More prompts = better results', truth: 'Quality of prompts matters far more than quantity. One excellent prompt beats ten mediocre ones.' },
      { myth: 'AI is objective', truth: 'AI reflects training data biases. It can be biased, wrong, or culturally insensitive.' },
      { myth: 'AI understands like humans', truth: 'AI predicts patterns, it doesn\'t truly understand context or meaning.' },
      { myth: 'Enterprise AI is the same as consumer AI', truth: 'Enterprise versions offer better accuracy, privacy controls, and customization.' },
      { myth: 'AI will eventually be perfect', truth: 'AI will improve but fundamentally has limits in reasoning and judgment.' }
    ],
    trends: [
      'Multimodal AI that processes text, images, audio, and video simultaneously',
      'AI agents that can complete complex multi-step tasks autonomously',
      'On-device AI running locally on phones and laptops without cloud',
      'AI regulation and governance frameworks emerging globally',
      'Synthetic media detection becoming critical skill',
      'Custom GPTs and specialized AI assistants for specific industries'
    ],
    comparisons: [
      {
        subject: 'ChatGPT vs Claude',
        versus: 'Claude emphasizes safety and nuanced responses; ChatGPT focuses on helpfulness and broad knowledge',
        betterFor: 'Claude for thoughtful analysis, ChatGPT for quick generation',
        nuance: 'Both have improved significantly and the gap has narrowed'
      },
      {
        subject: 'Free vs Paid AI',
        versus: 'Free versions have rate limits and older models; paid versions offer latest models and priority access',
        betterFor: 'Paid for heavy professional use, free for experimentation',
        nuance: 'Free tiers are often sufficient for casual users'
      },
      {
        subject: 'AI vs Traditional Search',
        versus: 'AI provides synthesized answers; search provides links to find answers yourself',
        betterFor: 'AI for complex queries, search for current events and source verification',
        nuance: 'Best approach combines both'
      }
    ],
    expertTips: [
      'Iterate iteratively: ask for revision, then refinement rather than expecting perfection first try',
      'Specify constraints explicitly: "Write in casual tone, under 200 words, for a tech-savvy audience"',
      'Use chain-of-thought prompting for complex reasoning: "Think step by step before answering"',
      'Provide examples of desired output format: "[Example]: then "[Your input]:"',
      'System prompts set behavior; user prompts provide task. Use both strategically.',
      'Temperature settings control randomness: lower (0.1-0.3) for factual, higher (0.7-0.9) for creative',
      'Break complex tasks into smaller steps rather than asking for complete solutions'
    ],
    beginnerMistakes: [
      'Asking vague questions like "help me with marketing" instead of specific scenarios',
      'Accepting first output without asking for alternatives or improvements',
      'Not providing context about the intended audience or purpose',
      'Copying AI output verbatim without reviewing for accuracy or tone',
      'Using AI for everything instead of identifying what AI does well',
      'Ignoring the limitations: treating confident wrong answers as truth',
      'Not saving successful prompt patterns for future use'
    ],
    practicalExamples: [
      {
        scenario: 'Writing follow-up emails',
        prompt: 'Write a follow-up email to a client who hasn\'t responded in 2 weeks. Professional but friendly tone. Keep it under 100 words. Include a specific meeting time proposal.',
        outcome: 'Concise, actionable email that maintains relationship while creating urgency'
      },
      {
        scenario: 'Learning a new concept',
        prompt: 'Explain neural networks to someone who understands spreadsheets but not programming. Use 3 analogies. End with one practical application.',
        outcome: 'Accessible explanation that builds understanding progressively'
      },
      {
        scenario: 'Debugging code',
        prompt: 'I\'m getting this error [error message] when running [code]. The expected behavior is [behavior]. I\'ve tried [solutions]. Explain what\'s causing it and how to fix it.',
        outcome: 'Root cause explanation with clear fix'
      }
    ]
  },

  chatgpt: {
    name: 'ChatGPT',
    category: 'ai',
    facts: [
      'ChatGPT launched November 30, 2022 and reached 1 million users in 5 days',
      'GPT-4 powers ChatGPT Plus, released March 2023',
      'ChatGPT can browse the internet with plugins and Browse mode',
      'Custom GPTs allow anyone to create specialized ChatGPT versions',
      'ChatGPT has passed multiple professional exams including bar, medical, and CFA',
      'Over 180 million people use ChatGPT monthly',
      'ChatGPT\'s training data includes books, articles, websites, and more'
    ],
    painPoints: [
      'Memory is limited to current conversation unless using custom instructions',
      'Cannot browse social media or private information',
      'Knowledge cutoff means missing recent events',
      'Sometimes generates plausible-sounding but incorrect information',
      'Output formatting options are limited',
      'Rate limits on free tier can be frustrating',
      'Finding the right prompt takes trial and error'
    ],
    misconceptions: [
      { myth: 'ChatGPT knows everything', truth: 'Training data has a cutoff date and can contain errors or biases.' },
      { myth: 'ChatGPT is always accurate', truth: 'It can confidently provide incorrect information ("hallucinations").' },
      { myth: 'Free and Plus are the same', truth: 'Plus has GPT-4, DALL-E, browsing, plugins, and higher limits.' },
      { myth: 'ChatGPT can replace Google', truth: 'ChatGPT explains; Google searches. Different tools for different needs.' }
    ],
    trends: [
      'GPT Store with custom GPTs becoming mainstream',
      'Voice conversations with ChatGPT (mobile app)',
      'Integration with Microsoft products (Office, Teams, Bing)',
      'Image generation via DALL-E 3 integrated',
      'Advanced data analysis and file processing'
    ],
    expertTips: [
      'Use custom instructions to set persistent preferences: "Always respond in Spanish unless asked otherwise"',
      'Start with broad context, then narrow: "I\'m a freelance designer. Now help me write a client proposal..."',
      'Ask for multiple options: "Give me 3 different opening lines for this email"',
      'Use it as thinking partner: "Here\'s my situation... What questions should I be asking?"',
      'Specify format explicitly: "Format this as a table with columns for Task, Deadline, and Priority"',
      'Iterate: "Good, but make the third point longer and the last point a call to action"'
    ],
    beginnerMistakes: [
      'Asking one-off questions without providing context',
      'Not specifying tone, audience, or length',
      'Believing everything without verification',
      'Using for things it\'s not suited for (real-time info, emotional support)'
    ],
    practicalExamples: [
      { scenario: 'Brainstorming', prompt: 'I need 10 unique business names for a sustainable clothing brand. Hip, not preachy.', outcome: 'Creative names with environmental angle' },
      { scenario: 'Learning', prompt: 'Explain compound interest as if I\'m 12 years old, then give me a real example with numbers.', outcome: 'Simple explanation with practical application' }
    ]
  },

  // =========================================================================
  // BUSINESS & ENTREPRENEURSHIP
  // =========================================================================
  business: {
    name: 'Business',
    category: 'business',
    facts: [
      '90% of startups fail, with 10% failing within the first year',
      'Small businesses employ nearly 50% of the American workforce',
      'The average millionaire has 7 different income streams',
      'Customer acquisition costs increase 60% on average when scaling',
      'Companies that prioritize customer experience generate 1.6x more revenue',
      '73% of consumers prefer personalized experiences',
      'The average CEO workday is 9.7 hours'
    ],
    painPoints: [
      'Finding product-market fit before running out of cash',
      'Balancing short-term survival with long-term vision',
      'Hiring the right people when you cannot afford top talent',
      'Getting customers to trust a new brand without social proof',
      'Managing cash flow while scaling operations',
      'Differentiating from competitors in crowded markets',
      'Building systems that work without you being in everything'
    ],
    misconceptions: [
      { myth: 'Big ideas lead to big businesses', truth: 'Execution matters more than ideas. Many successful businesses started with simple concepts executed exceptionally well.' },
      { myth: 'You need a perfect product to launch', truth: 'Successful entrepreneurs launch minimum viable products and iterate based on real feedback.' },
      { myth: 'VC funding equals success', truth: 'Most successful businesses never raised VC. Bootstrapping forces discipline and customer focus.' },
      { myth: 'Competition is bad', truth: 'Competition validates market demand and can push you to be better.' },
      { myth: 'Working more hours leads to more success', truth: 'Strategic work and systems outperform raw hours worked.' }
    ],
    trends: [
      'AI-powered business tools democratizing capabilities',
      'Remote and hybrid becoming permanent workforce models',
      'Vertical SaaS solutions replacing horizontal platforms',
      'Community-first business models gaining traction',
      'Sustainability becoming competitive advantage'
    ],
    comparisons: [
      {
        subject: 'Bootstrapping vs VC Funding',
        versus: 'Bootstrapping means self-funding; VC funding means giving up equity for capital',
        betterFor: 'Bootstrapping for control/sustainability; VC for fast scaling in high-growth markets',
        nuance: 'Hybrid approaches exist: pre-revenue grants, revenue-based financing'
      },
      {
        subject: 'B2B vs B2C',
        versus: 'B2B sells to businesses; B2C sells to individual consumers',
        betterFor: 'B2B for higher margins/repeatability; B2C for volume/brand building',
        nuance: 'Marketplace models blend both'
      }
    ],
    expertTips: [
      'Start with customer interviews before building anything',
      'Measure everything: if you cannot track it, you cannot improve it',
      'Build in public to attract early adopters and talent',
      'Charge for your product from day one: free is not a business model',
      'Batch similar tasks to maintain focus and reduce context switching',
      'Document processes early so you can delegate and scale',
      'The best time to fire a bad customer is now'
    ],
    beginnerMistakes: [
      'Building without validating demand first',
      'Underpricing to attract customers (devalues your work)',
      'Ignoring finances until crisis point',
      'Hiring too fast or too slow',
      'Not setting clear roles and expectations',
      'Perfectionism delaying launch',
      'Trying to do everything alone'
    ],
    practicalExamples: [
      {
        scenario: 'Finding first customers',
        approach: 'Start with personal network + one specific niche. Offer early adopters discounts + exclusive access. Ask for referrals.',
        outcome: 'First 10 customers provide testimonials and feedback for iteration'
      },
      {
        scenario: 'Pricing a new service',
        approach: 'Calculate hours × desired hourly rate × overhead factor. Research competitor pricing. Test two tiers: good/better.',
        outcome: 'Pricing that reflects value and covers costs'
      }
    ]
  },

  // =========================================================================
  // FITNESS & HEALTH
  // =========================================================================
  fitness: {
    name: 'Fitness',
    category: 'health',
    facts: [
      'Muscle memory allows strength to return faster than initial gains after losing it',
      'You cannot out-exercise a bad diet - nutrition accounts for 80% of body composition',
      'Sleep is when muscle growth actually happens - 7-9 hours recommended',
      'Compound movements (squat, deadlift, bench) work more muscles than isolation exercises',
      'Progressive overload is the fundamental principle - you must gradually increase demand',
      'Consistency over intensity - 20 minutes daily beats 2-hour sessions once a week',
      'DOMS (post-workout soreness) is not required for muscle growth'
    ],
    painPoints: [
      'Not seeing results despite consistent effort',
      'Plateaus that seem impossible to break through',
      'Lack of motivation on days when life gets in the way',
      'Conflicting advice from different fitness sources',
      'Not knowing proper form for exercises',
      'Being intimidated at the gym',
      'Recovery taking longer as you get older'
    ],
    misconceptions: [
      { myth: 'No pain, no gain', truth: 'Muscle soreness ≠ muscle growth. Progressive overload matters, not suffering.' },
      { myth: 'You need a gym membership', truth: 'Bodyweight training, resistance bands, and home equipment can build serious fitness.' },
      { myth: 'Women get bulky lifting heavy', truth: 'Women generally lack testosterone for natural bulk. Heavy lifting creates tone and strength.' },
      { myth: 'Spot reduction works', truth: 'You cannot target fat loss from specific areas. Overall body fat % matters.' },
      { myth: 'More protein is always better', truth: 'Beyond ~1.6g/kg bodyweight, excess protein just becomes expensive urine.' }
    ],
    trends: [
      'Zone 2 cardio gaining recognition for fat adaptation',
      'Wearable tech changing how people track recovery',
      'Personalized nutrition based on genetics and biometrics',
      'Hybrid training combining mobility, strength, and conditioning',
      'Mindfulness and recovery becoming prioritized'
    ],
    comparisons: [
      {
        subject: 'Cardio vs Strength Training',
        versus: 'Cardio improves heart health and endurance; strength maintains muscle and metabolism',
        betterFor: 'Both necessary - prioritize based on goals',
        nuance: 'Concurrent training (both) is effective if balanced properly'
      },
      {
        subject: 'Gym vs Home Workouts',
        versus: 'Gym offers equipment variety; home workouts offer convenience and privacy',
        betterFor: 'Depends on personality and goals',
        nuance: 'The best workout is one you will actually do'
      }
    ],
    expertTips: [
      'Track your workouts - progress requires progressive overload',
      'Sleep is a performance enhancer - prioritize it',
      'Learn the major lifts: squat, hinge, push, pull, carry',
      'Warm up smart: mobility work before lifting, not stretching cold muscles',
      'Post-workout protein within 2 hours maximizes muscle protein synthesis',
      'Plan workouts in advance to avoid gym confusion',
      'Find a training partner or community for accountability'
    ],
    beginnerMistakes: [
      'Doing too much too soon leading to injury or burnout',
      'Neglecting form for heavier weights',
      'Skipping leg day or focusing only on vanity muscles',
      'Not allowing adequate recovery between sessions',
      'Comparing progress to others instead of focusing on personal journey',
      'Following random programs without progression',
      'Underestimating the importance of consistency'
    ],
    practicalExamples: [
      {
        scenario: 'Starting a workout routine',
        approach: 'Start with 3 days/week, full body. Focus on learning 5-6 compound movements. Use light weights initially to perfect form.',
        outcome: 'Foundation for long-term progress without injury'
      },
      {
        scenario: 'Breaking a plateau',
        approach: 'Change one variable: add sets, add weight (2-3%), change exercises, reduce rest periods, or add tempo work.',
        outcome: 'Continued progress without overhauling entire program'
      }
    ]
  },

  // =========================================================================
  // MARKETING & SOCIAL MEDIA
  // =========================================================================
  marketing: {
    name: 'Marketing',
    category: 'marketing',
    facts: [
      'Video content generates 1200% more shares than text and images combined',
      'Instagram posts with location tags get 79% more engagement',
      'The average person sees 4,000-10,000 ads per day',
      'Brand consistency increases revenue by an average of 23%',
      '80% of people prefer personalized content experiences',
      'User-generated content has 4x higher engagement than brand-created content',
      'Emotional marketing campaigns are twice as effective as rational ones'
    ],
    painPoints: [
      'Creating content consistently without burning out',
      'Standing out in oversaturated feeds and inboxes',
      'Measuring ROI of marketing efforts accurately',
      'Keeping up with algorithm changes on each platform',
      'Generating leads that actually convert',
      'Building genuine community versus passive followers',
      'Balancing authenticity with professional polish'
    ],
    misconceptions: [
      { myth: 'More followers equals more sales', truth: 'Engagement and conversion matter more than follower count. A smaller engaged audience outperforms a large passive one.' },
      { myth: 'Viral content is the goal', truth: 'Virality is unpredictable. Consistent value delivery builds sustainable growth.' },
      { myth: 'Social media is free marketing', truth: 'Organic reach has declined. Successful social media requires time investment and often paid promotion.' },
      { myth: 'You need to be on every platform', truth: 'Focus on where your audience actually spends time. Quality presence beats quantity of platforms.' }
    ],
    trends: [
      'Short-form video dominating engagement (TikTok, Reels, Shorts)',
      'AI-generated content becoming widespread but requiring human touch',
      'Micro-communities forming around niche interests',
      'Authenticity and transparency becoming differentiators',
      'Social commerce integrating shopping directly into platforms',
      'Creator economy maturing with better monetization options'
    ],
    expertTips: [
      'Hook in the first 3 seconds or lose them',
      'Give your content one job: either educate, entertain, or inspire - not all three in one post',
      'Study the algorithm: engagement signals, save signals, and share signals differ',
      'Repurpose content across platforms instead of creating new from scratch',
      'Build an email list from day one - social platforms can disappear',
      'Create content that makes people feel something - emotion drives action',
      'Consistency beats virality for building sustainable business'
    ],
    beginnerMistakes: [
      'Focusing on vanity metrics over engagement and conversions',
      'Copying competitors instead of finding unique voice',
      'Posting without clear strategy or goals',
      'Ignoring analytics and not testing different approaches',
      'Not having a clear brand voice and visual identity',
      'Selling too soon before building trust',
      'Neglecting the platforms where their audience actually is'
    ],
    practicalExamples: [
      {
        scenario: 'Writing a viral hook',
        approach: 'Start with pattern interrupt: unexpected stat, bold statement, or relatable struggle. Then deliver value.',
        outcome: 'High retention and engagement from first seconds'
      },
      {
        scenario: 'Repurposing content',
        approach: 'Long-form YouTube video → 3 key clips for Reels → Quote graphics for Instagram → LinkedIn article → Twitter thread',
        outcome: 'Maximum reach from single content investment'
      }
    ]
  },

  // =========================================================================
  // PRODUCTIVITY
  // =========================================================================
  productivity: {
    name: 'Productivity',
    category: 'personal',
    facts: [
      'The average knowledge worker is interrupted every 11 minutes',
      'It takes 23 minutes to fully regain focus after an interruption',
      'Multitasking can reduce productivity by up to 40%',
      'The first 2 hours of the day are typically the most productive',
      'Most people overestimate what they can do in a day',
      'Writing down goals makes them 42% more likely to be achieved',
      'Decluttering your workspace can increase productivity by 20%'
    ],
    painPoints: [
      'Starting the day without clear priorities',
      'Getting distracted by emails, Slack, and notifications',
      'Feeling busy but not actually productive',
      'Struggling to maintain focus for extended periods',
      'Ending the day wondering what was accomplished',
      'Not having enough time for important but non-urgent tasks',
      'Difficulty saying no to requests that derail plans'
    ],
    misconceptions: [
      { myth: 'Early bird gets the worm', truth: 'Chronotype varies. Working with your natural rhythm beats forcing early mornings.' },
      { myth: 'Busy equals productive', truth: 'Output matters, not hours logged. 4 focused hours beats 8 distracted ones.' },
      { myth: 'More tools make you more productive', truth: 'Tool switching has costs. Master fewer tools deeply.' },
      { myth: 'Willpower is unlimited', truth: 'Decision fatigue is real. Reduce daily decisions to preserve willpower.' }
    ],
    trends: [
      'AI assistants handling administrative tasks',
      'Asynchronous communication reducing meeting overload',
      'Focus sprints replacing traditional time blocking',
      'Second brain and knowledge management systems gaining adoption',
      'Bimodal sleep and strategic napping for sustained energy'
    ],
    comparisons: [
      {
        subject: 'Time Blocking vs To-Do Lists',
        versus: 'Time blocking schedules specific tasks to time slots; to-do lists track tasks without time context',
        betterFor: 'Time blocking for execution; to-do lists for brainstorming and capture',
        nuance: 'Combine both: brain dump to to-do, then time block priorities'
      }
    ],
    expertTips: [
      'Do the hardest thing first when energy is highest',
      'Process email at set times rather than continuously',
      'Batch similar tasks to reduce context switching',
      'Protect your peak energy hours - schedule them for deep work',
      'The two-minute rule: if it takes less than 2 minutes, do it now',
      'Weekly review: 30 minutes to plan the upcoming week',
      'Systemize recurring decisions so you do not waste willpower'
    ],
    beginnerMistakes: [
      'Planning every minute rather than blocking themes or priorities',
      'Starting with email or Slack instead of priorities',
      'Not having a shutdown ritual to end the workday',
      'Taking on too much due to inability to say no',
      'Working in long blocks without breaks leading to diminishing returns',
      'Not tracking where time actually goes versus where planned'
    ],
    practicalExamples: [
      {
        scenario: 'Morning routine',
        approach: '90 min: No phone, light stretch, hardest project for 60 min, plan day in 10 min, email/social last.',
        outcome: 'Wins before checking phone, maintains energy for priorities'
      },
      {
        scenario: 'Email management',
        approach: 'Set 3 daily email slots: 9am, 1pm, 4pm. Process inbox to zero at each slot. Unsubscribe ruthlessly.',
        outcome: 'Inbox under control, focus preserved, no urgent-missed-email stress'
      }
    ]
  },

  // =========================================================================
  // TRAVEL
  // =========================================================================
  travel: {
    name: 'Travel',
    category: 'lifestyle',
    facts: [
      'Japan was the most passport-powerful destination until recently',
      'Travel rewards credit cards have distributed billions in sign-up bonuses',
      'Shoulder season travel can save 30-50% on accommodations',
      'The world\'s most visited city is consistently Bangkok, Paris, or London',
      'Over 50% of travelers now prioritize experiential travel over luxury',
      'Solo female travel has increased 65% over the past decade',
      'The best time to book flights is 6-8 weeks out for domestic, 2-3 months for international'
    ],
    painPoints: [
      'Overwhelm from planning logistics in unfamiliar destinations',
      'Fear of missing out on authentic experiences versus tourist traps',
      'Budget constraints limiting desired experiences',
      'Language barriers creating communication challenges',
      'Uncertainty about safety in unfamiliar places',
      'Post-vacation blues affecting re-adjustment',
      'Balancing planned activities with spontaneous discovery'
    ],
    misconceptions: [
      { myth: 'Travel requires significant time off', truth: 'Weekend trips and long weekends can provide meaningful travel experiences.' },
      { myth: 'Travel is always expensive', truth: 'With proper planning, budget travel is accessible. Points, off-season, and local destinations help.' },
      { myth: 'Tourist areas are always inferior', truth: 'Some tourist infrastructure exists because it is genuinely good. Research replaces assumptions.' }
    ],
    trends: [
      'Bleisure: combining business travel with leisure activities',
      'Regenerative travel focused on giving back to destinations',
      'Digital nomad visas enabling location independence',
      'Underrated destinations gaining popularity as travelers seek authenticity',
      'Luxury travel becoming more experiential rather than opulent'
    ],
    expertTips: [
      'Use Google Flights\' explore feature to find affordable destinations',
      'Learn 10 essential phrases in local language - goes a long way',
      'Eat where locals eat, not where reviews push you',
      'Build buffer days into itineraries - overplanning creates stress',
      'Get travel insurance for international trips',
      'Book popular restaurants well in advance',
      'Carry a refillable water bottle and portable charger'
    ],
    beginnerMistakes: [
      'Overpacking to be prepared for every scenario',
      'Trying to see too much in limited time',
      'Not informing banks of travel plans - cards get blocked',
      'Ignoring local customs and etiquette',
      'Skipping travel insurance for international trips',
      'Eating at restaurants right outside tourist attractions',
      'Not having offline maps or backup navigation'
    ],
    practicalExamples: [
      {
        scenario: 'Planning a 3-day city trip',
        approach: 'Day 1: major landmarks (morning), walking neighborhood (afternoon). Day 2: museum/must-see (morning), food tour (afternoon). Day 3: off-beat discovery, last-minute shopping.',
        outcome: 'Balanced mix of highlights, local flavor, and flexibility'
      },
      {
        scenario: 'Finding authentic food experiences',
        approach: 'Ask locals in non-tourist areas. Use Foodie Tours for introduction. Follow locals on social media. Eat where locals line up at lunch.',
        outcome: 'Memorable meals that cost less and teach more about culture'
      }
    ]
  },

  // =========================================================================
  // FOOD & COOKING
  // =========================================================================
  food: {
    name: 'Food',
    category: 'lifestyle',
    facts: [
      'Home-cooked meals are 5x less expensive than restaurant meals on average',
      'The average American spends 37 minutes cooking per day, down from 2 hours in the 1960s',
      'Meal prepping on Sunday can save 20+ hours during the workweek',
      'Salt is added to 75% of restaurant dishes before serving',
      'The Mediterranean diet is consistently ranked the healthiest overall',
      'Batch cooking grains and proteins can cut meal prep to 15 minutes'
    ],
    painPoints: [
      'Deciding what to cook when tired after work',
      'Fresh produce going bad before use',
      'Recipes requiring obscure ingredients for single use',
      'Not knowing proper cooking techniques',
      'Balancing healthy eating with convenience',
      'Cooking for one or two people leads to waste',
      'Recipe yield discrepancies with actual portions'
    ],
    misconceptions: [
      { myth: 'Cooking takes too much time', truth: 'Once you learn techniques and batch prep, home cooking takes 15-30 minutes per meal.' },
      { myth: 'Healthy food is expensive', truth: 'Beans, rice, eggs, and seasonal vegetables are nutritious and affordable.' },
      { myth: 'You need fancy equipment', truth: 'A sharp knife, decent pan, and cutting board are 90% of what you need.' }
    ],
    trends: [
      'Plant-based eating beyond just vegetarian/vegan',
      'Fermented foods for gut health gaining mainstream acceptance',
      'Global flavors from diaspora cuisines becoming normalized',
      'AI-generated recipes personalized to dietary needs',
      'Meal kit services evolving with better customization'
    ],
    expertTips: [
      'Master mise en place: prep all ingredients before starting to cook',
      'Season as you go - taste constantly and adjust',
      'Let meat rest after cooking - juices redistribute',
      'Use acid (lemon, vinegar) to brighten dishes at the end',
      'Invest in quality olive oil, salt, and one sharp knife',
      'Cook once, eat twice: plan for leftovers intentionally',
      'Build flavor bases: onion, garlic, celery (soffritto)'
    ],
    beginnerMistakes: [
      'Crowding the pan when searing (steams instead of browns)',
      'Not preheating the pan or oven properly',
      'Cutting proteins against the grain for toughness',
      'Following recipes exactly instead of tasting and adjusting',
      'Using dull knives (more dangerous than sharp ones)',
      'Overmixing batter and dough',
      'Not reading recipe fully before starting'
    ],
    practicalExamples: [
      {
        scenario: 'Weeknight dinner in 20 minutes',
        approach: 'Prep: chop protein and vegetables on weekend. Cook: hot pan + oil, protein 4 min/side, remove, veg 4 min, return protein, sauce 2 min.',
        outcome: 'Restaurant-quality meal in under 20 minutes'
      },
      {
        scenario: 'Meal prepping for the week',
        approach: 'Choose 2 proteins, 2 grains, 3 vegetables. Roast all protein and veg Sunday. Cook grains. Mix and match through week.',
        outcome: 'Varied, healthy meals without daily cooking'
      }
    ]
  },

  // =========================================================================
  // FINANCE & INVESTING
  // =========================================================================
  finance: {
    name: 'Finance',
    category: 'finance',
    facts: [
      'The S&P 500 has returned about 10% annually on average since 1926',
      'Compound interest is called the eighth wonder of the world by Einstein (possibly apocryphal)',
      'Only 35% of Americans could cover a \$1,000 emergency expense',
      'The average millionaire drives a used car and lives in a modest home',
      'Passive index investing outperforms most active fund managers over 15+ years',
      'Debt interest compounds against you just as savings compounds for you'
    ],
    painPoints: [
      'Not knowing where to start investing with limited funds',
      'Fear of market downturns and losing money',
      'Balancing debt payoff versus investing',
      'Analysis paralysis on financial decisions',
      'Not earning enough to save meaningfully',
      'Unexpected expenses derailing financial plans',
      'Retirement feels impossible at current savings rate'
    ],
    misconceptions: [
      { myth: 'You need a lot of money to start investing', truth: 'Fractional shares and low-cost ETFs allow starting with any amount.' },
      { myth: 'Timing the market works', truth: 'Time in market beats timing market. Missing the 10 best days can devastate returns.' },
      { myth: 'Expensive financial advisors are better', truth: 'Many charge high fees that erode returns. Index funds often outperform.' }
    ],
    trends: [
      'AI-powered financial planning tools democratizing advice',
      'ESG investing becoming mainstream consideration',
      'Real estate crowdfunding opening access to property investing',
      'High-yield savings accounts offering competitive rates again',
      'Financial literacy becoming more emphasized in education'
    ],
    expertTips: [
      'Pay yourself first: automate savings before you can spend it',
      'Before investing, pay off high-interest debt (credit cards)',
      'Build 3-6 month emergency fund before investing',
      'Keep investment costs low: look at expense ratios and fees',
      'Tax-advantaged accounts (401k, IRA) before taxable brokerage',
      'Automate contributions - you cannot spend what you do not see',
      'Review and rebalance portfolio annually'
    ],
    beginnerMistakes: [
      'Waiting to invest until they have "enough" money',
      'Putting emergency fund in volatile investments',
      'Trying to predict market movements',
      'Not taking employer 401k match (free money)',
      'Investing in individual stocks without research',
      'Ignoring fees - small percentages compound into large amounts',
      'Making emotional decisions during market volatility'
    ],
    practicalExamples: [
      {
        scenario: 'First \$1,000 investment',
        approach: 'Put in high-yield savings first for emergency fund. Then low-cost total market ETF (like VTI or FSKAX). Add monthly.',
        outcome: 'Simple foundation that grows wealth over decades'
      },
      {
        scenario: 'Budgeting with irregular income',
        approach: 'Calculate average monthly income. Fixed expenses. Flexible spending based on percentages. Save extra months.',
        outcome: 'Financial stability without constant stress'
      }
    ]
  },

  // =========================================================================
  // MINIMALISM & LIFESTYLE
  // =========================================================================
  minimalism: {
    name: 'Minimalism',
    category: 'lifestyle',
    facts: [
      'The average American home has 300,000 items',
      'We use 20% of what we own 80% of the time',
      'Clutter causes cortisol levels to spike similar to trauma',
      'The minimalism community grew 10x between 2015-2020',
      'Organization industry is worth \$9+ billion annually',
      'Many people report feeling overwhelmed by their possessions'
    ],
    painPoints: [
      'Feeling guilty about letting go of gifts or sentimental items',
      'Not knowing where to start when overwhelmed by clutter',
      'Fear of needing something later that was discarded',
      'Living with others who do not share minimalist values',
      'Maintaining minimalism after initial declutter',
      'Finding balance between minimalism and practicality',
      'Social pressure to accumulate and display wealth'
    ],
    misconceptions: [
      { myth: 'Minimalism means owning almost nothing', truth: 'Minimalism is having intentional clarity about what adds value. Some people own less; others just own deliberately.' },
      { myth: 'Minimalism is about aesthetics', truth: 'It is primarily about mindset and intentionality, not about white walls and empty spaces.' },
      { myth: 'Minimalism is expensive', truth: 'Reducing consumption saves money. Minimalism is often a path to financial freedom.' }
    ],
    trends: [
      'Digital minimalism gaining attention as screen time concerns grow',
      'Minimalist parenting emphasizing experiences over things',
      'Capsule wardrobes reducing decision fatigue',
      'One-in-one-out rules becoming household management tools',
      'Digital decluttering as important as physical'
    ],
    expertTips: [
      'Start with easy categories: duplicates, broken items, expired products',
      'Use the box method: put unseen items in a box, if you need something in 6 months, keep it',
      'Question every acquisition: does this add value proportional to what it takes (space, time, money, attention)?',
      'Create designated homes for everything - reduces clutter',
      'The best time to declutter is before acquiring, not after',
      'Physical minimalism often leads to mental clarity',
      'Share resources with neighbors instead of owning rarely-used items'
    ],
    beginnerMistakes: [
      'Trying to declutter everything at once - leads to burnout',
      'Keeping things "just in case" that have not been used in years',
      'Not having a system for incoming items',
      'Minimalism as performance rather than genuine intention',
      'Judging others for their consumption choices'
    ],
    practicalExamples: [
      {
        scenario: 'Clothing capsule wardrobe',
        approach: '33 items (including clothes, shoes, accessories). Choose versatile pieces in coordinating colors. Rotate seasonally.',
        outcome: 'Reduced decision fatigue, clearer wardrobe, easier laundry'
      },
      {
        scenario: 'Digital declutter',
        approach: 'Uninstall unused apps. Turn off non-essential notifications. Set screen time limits. Unsubscribe from everything. Organize files with folders.',
        outcome: 'Reduced digital overwhelm, reclaim attention'
      }
    ]
  },

  // =========================================================================
  // PHOTOGRAPHY
  // =========================================================================
  photography: {
    name: 'Photography',
    category: 'creative',
    facts: [
      'The best camera is the one you have with you',
      'Smartphone cameras now exceed professional cameras in many scenarios',
      'The most important element of a photo is light',
      'Composition rules can be broken effectively once understood',
      'Editing is where photos truly come to life',
      'Most famous photographs were not planned but captured instinctively'
    ],
    painPoints: [
      'Photos not matching the vision in mind',
      'Not understanding manual camera settings',
      'Post-processing feeling overwhelming',
      'Finding unique angles in popular locations',
      'Consistency across a photo series',
      'Balancing technical skill with creative vision',
      'Getting clients to understand creative direction'
    ],
    misconceptions: [
      { myth: 'Better gear makes better photos', truth: 'Skill, vision, and light matter far more than equipment. Many iconic photos were taken with basic gear.' },
      { myth: 'Photos should not be edited', truth: 'All photos are edited - the question is how much. Digital post-processing is part of photography.' }
    ],
    trends: [
      'Computational photography changing what cameras can capture',
      'Film photography resurgence among younger photographers',
      'AI editing tools accelerating post-processing',
      'Drone photography becoming more accessible',
      'Photo dumping versus intentional curation'
    ],
    expertTips: [
      'Learn to see light before learning camera settings',
      'Shoot in RAW for maximum editing flexibility',
      'Study compositions: rule of thirds, leading lines, negative space',
      'Golden hour provides the most flattering natural light',
      'Edit selectively - enhance, do not transform',
      'Have a clear vision before shooting, not just hoping for good photos',
      'Back up photos in multiple locations - cloud and physical'
    ],
    beginnerMistakes: [
      'Chasing gear instead of skill development',
      'Not learning manual mode and staying in auto',
      'Over-editing with too much saturation or clarity',
      'Not backing up photos',
      'Trying to get the shot instead of experiencing the moment',
      'Comparing their work to heavily edited professional results'
    ],
    practicalExamples: [
      {
        scenario: 'Improving phone photography',
        approach: 'Clean lens. Enable grid. Tap to focus and adjust exposure. Shoot in good light. Use portrait mode intentionally.',
        outcome: 'Noticeable improvement without buying new gear'
      },
      {
        scenario: 'Quick editing workflow',
        approach: 'Exposure correction → white balance → shadows/highlights → saturation → crop → vignette. Do not overthink.',
        outcome: 'Polished photo in under 2 minutes'
      }
    ]
  },

  // =========================================================================
  // PERSONAL DEVELOPMENT
  // =========================================================================
  personal_development: {
    name: 'Personal Development',
    category: 'lifestyle',
    facts: [
      'Adults who continue learning have 31% lower risk of cognitive decline',
      'Goal setting increases achievement by 25%',
      'Habits form based on frequency, not duration',
      'The average habit takes 66 days to become automatic',
      'Reading 30 minutes daily exposes you to 1.8 million words per year'
    ],
    painPoints: [
      'Starting but not maintaining new habits',
      'Not seeing immediate results from self-improvement efforts',
      'Feeling overwhelmed by self-improvement content',
      'Comparing progress to highlight reels of others',
      'Not knowing what to focus on first',
      'Lacking accountability to stick with commitments',
      'Setting vague goals that are hard to measure'
    ],
    misconceptions: [
      { myth: 'Motivation is the key to success', truth: 'Systems and habits beat motivation. Build infrastructure for success.' },
      { myth: 'You need to fix your weaknesses first', truth: 'Building strengths often yields better results than focusing on weaknesses.' }
    ],
    trends: [
      'Micro-learning: small daily doses rather than intensive courses',
      'Accountability partnerships and communities',
      'Integrating wellness and personal development',
      'Journaling practices becoming more structured',
      'Skill stacking versus singular focus'
    ],
    expertTips: [
      'Start ridiculously small: 5 minutes of meditation beats 60-minute sessions you skip',
      'Stack new habits onto existing ones: after I brush teeth, I will journal',
      'Track habits visually - calendar X\'s create momentum',
      'Focus on identity-based habits: "I am a reader" not "I read more"',
      'Review and reflect weekly: what worked, what to adjust',
      'Invest in learning: courses, books, coaches accelerate growth',
      'Teaching others solidifies your own learning'
    ],
    beginnerMistakes: [
      'Taking on too many changes simultaneously',
      'Perfectionism preventing any action',
      'Not having clear metrics for success',
      'Relying on willpower instead of environment design',
      'Skipping rest and recovery in pursuit of productivity'
    ],
    practicalExamples: [
      {
        scenario: 'Building a daily reading habit',
        approach: 'Put book by bed. Read 10 pages before phone in morning. Keep phone out of bedroom.',
        outcome: 'Reading becomes automatic part of daily routine'
      },
      {
        scenario: 'Goal setting that actually works',
        approach: 'Yearly theme (not resolution) → quarterly milestones → monthly priorities → weekly projects → daily actions',
        outcome: 'Big goals broken into executable daily steps'
      }
    ]
  }
};

/**
 * TopicPackManager
 * Manages access to topic packs with intelligent retrieval
 */
export class TopicPackManager {
  constructor() {
    this.packs = TOPIC_PACKS;
    this.entityToPack = this._buildEntityMapping();
  }

  _buildEntityMapping() {
    const mapping = {};
    
    // Map AI-related entities
    ['ai', 'openai', 'chatgpt'].forEach(entity => {
      mapping[entity.toLowerCase()] = 'ai';
    });
    
    // Map business entities
    ['business', 'entrepreneur', 'startup'].forEach(entity => {
      mapping[entity.toLowerCase()] = 'business';
    });
    
    // Map fitness
    ['fitness', 'workout', 'gym', 'exercise'].forEach(entity => {
      mapping[entity.toLowerCase()] = 'fitness';
    });
    
    // Map marketing
    ['marketing', 'social media', 'instagram', 'content'].forEach(entity => {
      mapping[entity.toLowerCase()] = 'marketing';
    });
    
    // Map productivity
    ['productivity', 'time management', 'focus', 'efficiency'].forEach(entity => {
      mapping[entity.toLowerCase()] = 'productivity';
    });
    
    // Map travel
    ['travel', 'vacation', 'trip'].forEach(entity => {
      mapping[entity.toLowerCase()] = 'travel';
    });
    
    // Map food
    ['food', 'cooking', 'recipe', 'meal'].forEach(entity => {
      mapping[entity.toLowerCase()] = 'food';
    });
    
    // Map finance
    ['finance', 'investing', 'money', 'budget'].forEach(entity => {
      mapping[entity.toLowerCase()] = 'finance';
    });
    
    // Map minimalism
    ['minimalism', 'declutter', 'organize', 'simplify'].forEach(entity => {
      mapping[entity.toLowerCase()] = 'minimalism';
    });
    
    // Map photography
    ['photography', 'photo', 'camera'].forEach(entity => {
      mapping[entity.toLowerCase()] = 'photography';
    });
    
    // Map personal development
    ['personal development', 'self improvement', 'growth', 'habits'].forEach(entity => {
      mapping[entity.toLowerCase()] = 'personal_development';
    });
    
    return mapping;
  }

  /**
   * Get pack for a topic or entity
   */
  getPack(identifier) {
    const normalized = identifier.toLowerCase().trim();
    
    // Direct pack match
    if (this.packs[normalized]) {
      return this.packs[normalized];
    }
    
    // Entity mapping
    if (this.entityToPack[normalized]) {
      return this.packs[this.entityToPack[normalized]];
    }
    
    // Keyword matching
    for (const [key, pack] of Object.entries(this.packs)) {
      if (normalized.includes(key.replace('_', ' ')) || 
          key.replace('_', ' ').includes(normalized)) {
        return pack;
      }
    }
    
    return null;
  }

  /**
   * Get random item from pack section
   */
  getRandom(packName, section, count = 1) {
    const pack = typeof packName === 'string' ? this.getPack(packName) : packName;
    if (!pack || !pack[section]) return null;
    
    const items = pack[section];
    if (count === 1) {
      return items[Math.floor(Math.random() * items.length)];
    }
    
    // Shuffle and return count
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Get all sections from a pack
   */
  getAll(packName) {
    const pack = this.getPack(packName);
    if (!pack) return null;
    
    return {
      name: pack.name,
      category: pack.category,
      facts: pack.facts,
      painPoints: pack.painPoints,
      misconceptions: pack.misconceptions,
      trends: pack.trends,
      comparisons: pack.comparisons,
      expertTips: pack.expertTips,
      beginnerMistakes: pack.beginnerMistakes,
      practicalExamples: pack.practicalExamples
    };
  }

  /**
   * Generate content using pack data
   */
  generateContent(packName, options = {}) {
    const {
      personality = 'default',
      goal = 'engage',
      strategy = 'auto'
    } = options;
    
    const pack = this.getPack(packName);
    if (!pack) return null;
    
    const content = {
      // Observation - surprising or relatable fact
      observation: this._generateObservation(pack, personality),
      
      // Explanation - why this matters
      explanation: this._generateExplanation(pack, personality),
      
      // Example - real-world application
      example: this._generateExample(pack),
      
      // Lesson - actionable takeaway
      lesson: this._generateLesson(pack, personality, goal),
      
      // CTA - action based on goal
      cta: this._generateCTA(pack, goal)
    };
    
    return content;
  }

  _generateObservation(pack, personality) {
    // Get a surprising or relatable fact
    const fact = pack.facts[Math.floor(Math.random() * pack.facts.length)];
    const painPoint = pack.painPoints[Math.floor(Math.random() * pack.painPoints.length)];
    
    const patterns = {
      viral: [
        `Here's the thing about ${pack.name.toLowerCase()} that nobody talks about:\n\n${fact}`,
        `${fact}\n\nAnd honestly? That changes everything about how we should approach ${pack.name.toLowerCase()}.`,
        `POV: You just learned this about ${pack.name.toLowerCase()}:\n\n${fact}`
      ],
      genz: [
        `not me finding out ${fact} 💀`,
        `okay but ${pack.name.toLowerCase()} users need to know:\n\n${fact}`,
        `the way ${pack.name.toLowerCase()} works is actually wild`
      ],
      storytelling: [
        `I'll never forget when I realized ${fact.toLowerCase()}`,
        `The moment I understood ${pack.name.toLowerCase()} differently:\n\n${fact}`
      ],
      educational: [
        `Key fact about ${pack.name}:\n\n${fact}`,
        `${pack.name} by the numbers:\n\n${fact}`
      ],
      default: [
        `Something interesting about ${pack.name}:\n\n${fact}`,
        `Here's a fact that puts ${pack.name.toLowerCase()} into perspective:\n\n${fact}`
      ]
    };
    
    const personalityPatterns = patterns[personality] || patterns.default;
    return personalityPatterns[Math.floor(Math.random() * personalityPatterns.length)];
  }

  _generateExplanation(pack, personality) {
    const misconception = pack.misconceptions[Math.floor(Math.random() * pack.misconceptions.length)];
    
    const patterns = {
      viral: [
        `${misconception.truth}\n\nMost people still believe "${misconception.myth}" - but that couldn't be further from the truth.`,
        `Wrong assumption: ${misconception.myth}\n\nThe reality: ${misconception.truth}`
      ],
      genz: [
        `lowkey the myth about ${pack.name.toLowerCase()} is:\n\n${misconception.myth}\n\nbut actually:\n\n${misconception.truth}`,
        `the way ${pack.name.toLowerCase()} people get it wrong is crazy`
      ],
      storytelling: [
        `I used to think ${misconception.myth.toLowerCase()}\n\nThen I learned: ${misconception.truth}`,
        `The lesson that changed my approach to ${pack.name.toLowerCase()}: ${misconception.truth}`
      ],
      educational: [
        `Common misconception: ${misconception.myth}\n\nCorrect understanding: ${misconception.truth}`,
        `Understanding ${pack.name}: ${misconception.truth}`
      ],
      default: [
        `Here's the truth about ${pack.name.toLowerCase()}:\n\n${misconception.truth}`,
        `The biggest misconception about ${pack.name.toLowerCase()}: ${misconception.myth}\n\nActual truth: ${misconception.truth}`
      ]
    };
    
    const personalityPatterns = patterns[personality] || patterns.default;
    return personalityPatterns[Math.floor(Math.random() * personalityPatterns.length)];
  }

  _generateExample(pack) {
    const example = pack.practicalExamples[Math.floor(Math.random() * pack.practicalExamples.length)];
    
    return `Here's how this plays out in practice:\n\n${example.scenario}\n\n${example.approach}\n\nResult: ${example.outcome}`;
  }

  _generateLesson(pack, personality, goal) {
    const tips = pack.expertTips;
    const beginnerMistakes = pack.beginnerMistakes;
    
    // Get a mix
    const tip = tips[Math.floor(Math.random() * tips.length)];
    const mistake = beginnerMistakes[Math.floor(Math.random() * beginnerMistakes.length)];
    
    const patterns = {
      viral: [
        `The ${pack.name.toLowerCase()} tip that actually works:\n\n${tip}`,
        `Stop doing this about ${pack.name.toLowerCase()}:\n\n${mistake}\n\nInstead: ${tip}`
      ],
      genz: [
        `${pack.name.toLowerCase()} tip that changed my life:\n\n${tip}`,
        `things I wish I knew about ${pack.name.toLowerCase()}:\n\n${tip}`
      ],
      storytelling: [
        `The ${pack.name.toLowerCase()} insight I wish someone told me:\n\n${tip}`,
        `What I learned the hard way about ${pack.name.toLowerCase()}: ${mistake}\n\nThe fix: ${tip}`
      ],
      educational: [
        `Expert tip for ${pack.name}:\n\n${tip}`,
        `Common beginner mistake: ${mistake}\n\nHow to avoid it: ${tip}`
      ],
      default: [
        `The key to ${pack.name.toLowerCase()}:\n\n${tip}`,
        `${pack.name} 101: ${tip}`
      ]
    };
    
    const personalityPatterns = patterns[personality] || patterns.default;
    return personalityPatterns[Math.floor(Math.random() * personalityPatterns.length)];
  }

  _generateCTA(pack, goal) {
    const ctas = {
      educate: 'Follow for more insights like this.',
      entertain: 'This was wild, right? Follow for more.',
      inspire: 'Save this for when you need motivation.',
      sell: 'Link in bio for the full guide.',
      engage: 'Follow for more like this.',
      default: 'Follow for more insights.'
    };
    
    return ctas[goal] || ctas.default;
  }

  /**
   * Get available pack names
   */
  getAvailablePacks() {
    return Object.keys(this.packs).map(key => ({
      key,
      name: this.packs[key].name,
      category: this.packs[key].category
    }));
  }
}

export default TopicPackManager;
