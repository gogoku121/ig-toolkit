/**
 * Knowledge Layer
 * Structured information repository for each topic category
 * Provides facts, insights, tips, and context for intelligent content generation
 */

export const KNOWLEDGE_BASE = {
  travel: {
    name: 'Travel',
    insights: {
      commonMistakes: [
        'Not researching local customs and etiquette',
        'Overpacking instead of packing light',
        'Skipping travel insurance',
        'Not informing banks of travel plans',
        'Eating near tourist traps',
        'Not having offline maps',
        'Underestimating travel time to airports',
        'Booking non-refundable flights too early'
      ],
      hiddenGems: [
        'Tbilisi, Georgia - unique architecture and wine culture',
        'Ljubljana, Slovenia - sustainable and charming',
        'Guangxi, China - stunning karst landscapes',
        'Colmar, France - fairytale village',
        'Rothenburg ob der Tauber, Germany - medieval perfection',
        'Alentejo, Portugal - authentic Portugal',
        'Palawan, Philippines - last frontier paradise',
        'Lofoten Islands, Norway - dramatic Arctic beauty'
      ],
      travelMyths: [
        'Traveling is always expensive - wrong season = cheap travel',
        'You need weeks off for international travel',
        'Hostels are unsafe or dirty - most are modern and social',
        'You must speak the language - apps and gestures work',
        'Travel bloggers make it look easy - lots of planning behind it',
        'You need a huge budget to travel well'
      ],
      expertAdvice: [
        'Use Google Flights explore for cheap destinations',
        'Book during shoulder season for best prices and weather',
        'Learn 10 phrases in local language - goes a long way',
        'Carry a reusable water bottle with filter',
        'Use packing cubes to maximize luggage space',
        'Book experiences through Airbnb Experiences or GetYourGuide',
        'Always have a backup credit card in different bag'
      ],
      planningTips: [
        'Start with flights - they set the trip budget',
        'Use Pinterest boards to collect inspiration',
        'Join Facebook groups for insider tips',
        'Make reservations 2 weeks ahead for popular restaurants',
        'Build an itinerary but stay flexible',
        'Check CDC and State Dept advisories',
        'Save offline maps of your destination'
      ],
      budgetingAdvice: [
        'Use 50-30-20 rule: 50 experiences, 30 accommodation, 20 food',
        'Cook some meals - grocery stores reveal local life',
        'Get city tourist cards for free transport and museum entries',
        'Travel mid-week for cheaper flights and accommodation',
        'Consider house sitting or home exchanges',
        'Use points and miles for flights',
        'Eat where locals eat - not on main tourist streets'
      ],
      packingTips: [
        'Roll clothes instead of folding - saves space',
        'Put shoes in shower caps to stay clean',
        'Use a portable luggage scale to avoid overweight fees',
        'Pack a small first aid kit',
        'Bring a power bank and universal adapter',
        'Keep essentials in carry-on (medications, change of clothes)',
        'Limit shoes to 3 pairs: walking, dress, sandals'
      ],
      emotionalExperiences: [
        'Getting lost in a foreign city and finding something magical',
        'Watching sunset from an unexpected viewpoint',
        'Making a genuine connection with a stranger',
        'Trying food that changes your perspective',
        'Witnessing local traditions and ceremonies',
        'The feeling of arrival after a long journey',
        'Finding a place that feels like home away from home'
      ]
    },
    storyPrompts: {
      turningPoints: [
        'The moment you realized travel changes you',
        'When a trip exceeded all expectations',
        'A travel mistake that taught a valuable lesson',
        'The stranger who changed your trip - and maybe your life',
        'First solo trip - the fear and freedom'
      ],
      unexpected: [
        'The detour that became the highlight',
        'When plans fell through and something better happened',
        'Weather ruined plans but created magic',
        'Getting to witness something most tourists miss'
      ]
    }
  },

  fitness: {
    name: 'Fitness',
    insights: {
      commonMistakes: [
        'Doing too much too soon - consistency beats intensity',
        'Neglecting recovery and sleep',
        'Not tracking progress properly',
        'Comparing yourself to others',
        'Relying on motivation instead of building habits',
        'Overemphasizing cardio over strength training',
        'Not progressive overload',
        'Poor nutrition without proper protein intake'
      ],
      hiddenGems: [
        'Zone 2 cardio - the underrated fat burning foundation',
        'Single leg exercises for functional strength',
        'Mind-muscle connection improves results',
        'Morning workouts for consistency',
        'Compound movements over isolation for beginners',
        'Mobility work prevents injuries'
      ],
      fitnessMyths: [
        'No pain, no gain - soreness does not equal progress',
        'You need gym equipment for a good workout',
        'Spot reduction works - it does not',
        'Carbs make you fat - they are your friend for energy',
        'Women get bulky lifting heavy - they do not',
        'More gym time = better results - quality over quantity'
      ],
      expertAdvice: [
        'Build habits before optimizing - show up first',
        'Track your workouts in a simple app or notebook',
        'Prioritize protein: 1.6-2.2g per kg bodyweight',
        'Sleep 7-9 hours - this is when you actually grow',
        'Progressive overload: add weight, reps, or sets weekly',
        'Change workouts every 4-8 weeks to avoid plateaus',
        'Deload weeks every 4-6 weeks for recovery'
      ],
      trainingPrinciples: [
        'Progressive overload: gradually increase demands',
        'Specificity: train what you want to improve',
        'Recovery: rest is when adaptation happens',
        'Individuality: what works for others may not work for you',
        'Variation: change exercises to challenge body',
        'Consistency: showing up matters more than perfection'
      ],
      nutritionBasics: [
        'Protein builds and repairs muscle',
        'Carbs fuel training and recovery',
        'Fats support hormones and joint health',
        'Eat whole foods most of the time',
        'Stay hydrated - aim for 3+ liters daily',
        'Pre-workout: simple carbs for energy',
        'Post-workout: protein within 2 hours'
      ],
      motivationPsychology: [
        'Identity-based goals work better than outcome goals',
        'Small wins build momentum',
        'Environment shapes behavior more than willpower',
        'Accountability partners increase follow-through',
        'Progress photos track changes scale misses',
        'Celebrate non-scale victories'
      ],
      habitsBuilding: [
        'Start ridiculously small - 5 minutes counts',
        'Stack new habits onto existing ones',
        'Remove friction from good habits, add friction to bad',
        'Track habits on a calendar - consistency visible',
        'Make it enjoyable - you will stick with it',
        'Miss one day - do not miss two'
      ]
    },
    storyPrompts: {
      turningPoints: [
        'When fitness finally clicked - the realization',
        'First time seeing progress in photos',
        'Completing something you never thought possible',
        'How fitness helped through a difficult time',
        'Finding a workout you actually enjoy'
      ],
      unexpected: [
        'Unexpected friendship at the gym',
        'When the scale did not move but clothes fit better',
        'Learning to rest without guilt',
        'Discovering a new favorite type of workout'
      ]
    }
  },

  business: {
    name: 'Business',
    insights: {
      commonMistakes: [
        'Starting without a clear customer problem',
        'Pricing too low from fear of rejection',
        'Neglecting customer retention for acquisition',
        'Trying to be everything to everyone',
        'Ignoring financials until crisis point',
        'Scaling too fast before systems are ready',
        'Not validating ideas before building',
        'Copying competitors instead of differentiation'
      ],
      growthHacks: [
        'Reverse engineering competitor successes',
        'Building in public for audience growth',
        'Strategic partnerships for distribution',
        'Referral programs that actually work',
        'Content marketing for organic reach',
        'Freemium or free trial with clear upgrade path',
        'Customer interviews for product-market fit'
      ],
      customerAcquisition: [
        'Know your CAC and LTV before spending',
        'Content marketing beats paid ads for most early stage',
        'Referrals are cheapest and highest quality',
        'Focus on one channel deeply before spreading',
        'Build an email list from day one',
        'Social proof accelerates trust'
      ],
      pricingStrategy: [
        'Test price increases with segments first',
        'Value-based pricing beats cost-plus',
        'Anchor pricing - first number sets perception',
        'Tiered pricing creates perceived value',
        'Annual pricing improves cash flow and retention',
        'Add payment plans for higher ticket items'
      ],
      brandingTruth: [
        'Brand is what people say about you when you leave',
        'Consistency beats brilliance in branding',
        'Story differentiates more than features',
        'Promise + delivery = trust',
        'Brand personality must be authentic',
        'Visual identity is 10% of brand'
      ],
      leadershipLessons: [
        'Hire slow, fire fast - bad hires poison culture',
        'Delegate outcomes, not tasks',
        'Vision casting creates alignment',
        'Lead by example - culture starts with you',
        'Give credit, take responsibility',
        'Build systems before scaling teams'
      ],
      scalingWisdom: [
        'Systems before hiring - document everything',
        'Cash flow is oxygen - watch it daily',
        'Hire for culture add, not culture fit',
        'Build redundancies before you need them',
        'Trust but verify metrics',
        'Exit strategies matter even at startup'
      ],
      commonPitfalls: [
        'Vanity metrics over actionable metrics',
        'Perfection paralysis - launch and iterate',
        'Ignoring customer feedback',
        'Growing team too fast',
        'Not having legal and contracts in place',
        'Mixing personal and business finances'
      ]
    },
    storyPrompts: {
      turningPoints: [
        'The first customer who believed in you',
        'When pivoting saved the business',
        'The hire that changed everything',
        'Realizing the business was actually working',
        'First month hitting revenue goals'
      ],
      unexpected: [
        'The competitor who became a partner',
        'When going viral backfired',
        'Finding your niche by accident',
        'Learning failure was the best teacher'
      ]
    }
  },

  technology: {
    name: 'Technology',
    insights: {
      commonMistakes: [
        'Chasing every new tool instead of mastering few',
        'Not backing up data regularly',
        'Ignoring cybersecurity basics',
        'Over-customizing before understanding defaults',
        'Assuming newer is always better',
        'Not learning keyboard shortcuts',
        'Neglecting to declutter digital life',
        'Privacy settings left at defaults'
      ],
      productivitySecrets: [
        'Inbox Zero - email anxiety elimination',
        'Time blocking - protect focus hours',
        'Batching similar tasks - reduces context switching',
        'Two-minute rule - do it now or schedule it',
        'No meeting Wednesdays - focus days work',
        'Async first - not everything needs a meeting',
        'Weekly reviews - 30 minutes to plan the week'
      ],
      toolComparisons: [
        'Notion vs Obsidian - databases vs linking',
        'Slack vs Discord - work vs community',
        'Figma vs Sketch - collaboration vs mac-only',
        'GitHub vs GitLab - Microsoft ecosystem vs open',
        'VS Code vs JetBrains - lightweight vs full IDE',
        'Chrome vs Firefox - ecosystem vs privacy'
      ],
      workflowOptimization: [
        'Shortcuts and hotkeys - 2x productivity',
        'Text expanders for repetitive typing',
        'Clipboard managers save hours weekly',
        'Window managers organize screen real estate',
        'RSS readers vs algorithmic feeds',
        'Automation tools connect apps: Zapier, Make'
      ],
      emergingTech: [
        'AI coding assistants - pair programming redefined',
        'Low-code/no-code - build without engineers',
        'Browser-based development - coding from any device',
        'Edge computing - faster, private processing',
        'Voice interfaces - hands-free productivity',
        'Spatial computing - beyond flat screens'
      ],
      securityBasics: [
        'Unique passwords - never reuse',
        'Password manager - essential, not optional',
        '2FA everywhere - especially email and banking',
        'VPN on public WiFi - non-negotiable',
        'Regular updates - security patches matter',
        'Backup 3-2-1: 3 copies, 2 media, 1 offsite'
      ],
      digitalWellness: [
        'Screen time limits - awareness first',
        'Notification batching - check 3x daily',
        'Focus modes - do not disturb work',
        'Blue light management - evening wellness',
        'Standing desk - movement integrated',
        'Social media boundaries - curated feeds'
      ],
      learningResources: [
        'Project-based learning beats passive watching',
        'Build real things to learn real skills',
        'Documentation is often the best tutorial',
        'Communities accelerate learning',
        'Teach to learn - write about it',
        'Learn in public - accountability and feedback'
      ]
    },
    storyPrompts: {
      turningPoints: [
        'When a tool transformed workflow',
        'Discovering automation that saved hours daily',
        'Building something from scratch that worked',
        'First time reaching flow state',
        'When tech frustration became tech mastery'
      ],
      unexpected: [
        'The simple tool that changed everything',
        'Going analog when tech overwhelmed',
        'Finding a hidden feature by accident',
        'How tech helped connect despite isolation'
      ]
    }
  },

  ai: {
    name: 'AI',
    insights: {
      practicalApplications: [
        'Drafting and brainstorming - first pass done fast',
        'Research summarization - distilling long documents',
        'Code debugging and explanation',
        'Email drafting with tone adjustment',
        'Content ideation and outlines',
        'Learning explanation - step-by-step guides',
        'Travel planning and itinerary creation',
        'Recipe modification and meal planning'
      ],
      promptEngineering: [
        'Be specific: context + task + format',
        'Role prompting: "Act as a..." sets behavior',
        'Chain of thought: ask for reasoning steps',
        'Few-shot examples: show what you want',
        'Constraints: specify tone, length, audience',
        'Iterate: refine outputs through dialogue',
        'Temperature and max tokens control randomness'
      ],
      limitations: [
        'Hallucinations - confident but wrong',
        'Knowledge cutoff - recent events unknown',
        'No personal memory across sessions',
        'Cannot browse live web (without tools)',
        'Biased training data reflects society',
        'Math can be wrong - verify calculations',
        'Cannot guarantee privacy of inputs'
      ],
      ethicalConsiderations: [
        'Transparency about AI usage matters',
        'Bias can be amplified, not removed',
        'Copyright of AI outputs is unsettled',
        'Energy consumption of training',
        'Job displacement concerns are real',
        'Deepfakes and misinformation risk',
        'Human oversight remains essential'
      ],
      futureOfWork: [
        'Augmentation beats replacement for most jobs',
        'Learning to work with AI is new skill',
        'Human soft skills become more valuable',
        'New job categories will emerge',
        'Continuous learning is the new normal',
        'AI literacy becomes basic requirement',
        'Creativity + AI = exponential output'
      ],
      toolCategories: [
        'Text: ChatGPT, Claude, Gemini',
        'Image: Midjourney, DALL-E, Stable Diffusion',
        'Video: Runway, Synthesia, Descript',
        'Audio: Eleven Labs, Descript, Otter',
        'Code: GitHub Copilot, Cursor, Codeium',
        'Research: Perplexity, Consensus, Scite'
      ],
      gettingStarted: [
        'Start with one tool and one use case',
        'Free tiers are good enough to start',
        'Specific problems beat generic exploration',
        'Document what works in your workflow',
        'Share learnings with team',
        'Stay updated - the field moves fast'
      ],
      mythsVsReality: [
        'Myth: AI will replace all jobs - Reality: Augmentation is more likely',
        'Myth: You need technical skills - Reality: Natural language works',
        'Myth: AI is always right - Reality: Must verify',
        'Myth: Enterprise AI is same as consumer - Reality: Very different',
        'Myth: One AI tool does everything - Reality: Specialization common'
      ]
    },
    storyPrompts: {
      turningPoints: [
        'When AI made something click',
        'First time AI saved significant time',
        'Realizing AI was not going away',
        'How AI changed approach to learning',
        'When AI hallucination caused problems'
      ],
      unexpected: [
        'Unexpected creative output from AI',
        'When AI was wrong in a funny way',
        'AI helping with something personal',
        'Learning to trust but verify AI'
      ]
    }
  },

  food: {
    name: 'Food',
    insights: {
      cookingTechniques: [
        'Mise en place - everything in its place first',
        'Salt as you go - builds depth',
        'Rest meat after cooking - juices redistribute',
        'Cast iron seasoned properly = nonstick',
        'Boiling vs simmering - temperature matters',
        'Deglaze pan for flavor - all those bits',
        'Acid brightens dishes - lemon, vinegar'
      ],
      flavorProfiles: [
        'Sweet, salty, sour, bitter, umami - balance all five',
        'Fat carries flavor - do not fear it',
        'Heat levels: raw, low, medium, high, scorching',
        'Aromatics: onion, garlic, celery base',
        'Fresh vs dried herbs: when to use which',
        'Acid cuts richness - lemon or wine',
        'Umami: parmesan, soy, tomatoes, mushrooms'
      ],
      commonMistakes: [
        'Crowding pan - steams instead of sears',
        'Not preheating properly',
        'Cutting meat wrong direction of grain',
        'Overmixing batter - tough baked goods',
        'Not tasting as you go',
        'Following recipe exactly without adjusting',
        'Knife skills - dull knives are dangerous'
      ],
      nutritionBasics: [
        'Protein: meat, fish, eggs, legumes',
        'Complex carbs: whole grains, vegetables',
        'Healthy fats: olive oil, nuts, avocado',
        'Fiber: vegetables, whole grains, beans',
        'Micronutrients: eat the rainbow',
        'Hydration: water with meals aids digestion',
        'Portion control: eyeballs get better over time'
      ],
      globalCuisines: [
        'Italian: simple ingredients, bold flavors',
        'Japanese: precision, seasonality, umami',
        'Mexican: chilies, corn, fresh herbs',
        'Indian: spices, layered cooking, yogurt',
        'Thai: balance of sweet, sour, salty, spicy',
        'French: technique, butter, sauces',
        'Middle Eastern: aromatics, grains, nuts'
      ],
      mealPrepSecrets: [
        'Batch grains and proteins mid-week',
        'Marinades freeze well - make ahead',
        'Sheet pan meals: minimal cleanup',
        'Prep vegetables on Sunday',
        'Sauces and dressings: homemade beats store-bought',
        'Label everything with dates',
        'Starches freeze well; leafy greens do not'
      ],
      foodTrends: [
        'Plant-based: beyond meat alternatives maturing',
        'Fermented foods: gut health focus',
        'Global flavors: diaspora cuisine rising',
        'Functional ingredients: adaptogens, nootropics',
        'Sustainable eating: local, seasonal, reduce waste',
        'AI-generated recipes: personalized cooking',
        'Ghost kitchens: delivery-only restaurants'
      ],
      restaurantSecrets: [
        'Most "house" sauces start with a base',
        'Restaurants prep 80% before service',
        'Acidity is the secret restaurant weapon',
        'Butter finishes make everything better',
        'Fresh pasta only needs simple sauce',
        'Mise en place makes or breaks service'
      ]
    },
    storyPrompts: {
      turningPoints: [
        'When cooking finally made sense',
        'First time impressing guests',
        'Learning a family recipe',
        'Finding joy in meal prep',
        'Discovering a new cuisine'
      ],
      unexpected: [
        'Accidental culinary discovery',
        'When a "failed" dish became favorite',
        'Restaurant meal that inspired',
        'Cooking for someone special'
      ]
    }
  },

  marketing: {
    name: 'Marketing',
    insights: {
      contentStrategy: [
        'Document your strategy before creating content',
        'Quality over quantity - one great piece beats ten mediocre',
        'Repurpose content across platforms',
        'Build content pillars around expertise',
        'Consistency beats virality for growth',
        'Engage with comments to build community',
        'Track what resonates and do more of it'
      ],
      socialMediaTactics: [
        'Hook in first 3 seconds or scroll past',
        'Trending audio accelerates reach',
        'Carousels get highest saves',
        'Stories create intimacy and connection',
        'Reels reach new audiences; grid builds brand',
        'Post when your audience is active',
        'Engagement pods boost algorithmic reach'
      ],
      growthChannels: [
        'SEO: long-term compound growth',
        'Social media: community and reach',
        'Email: highest ROI channel',
        'Referrals: word of mouth amplified',
        'Paid ads: scalable but requires budget',
        'Partnerships: reach new audiences',
        'PR and press: credibility and backlinks'
      ],
      brandingEssentials: [
        'Be recognizable: color, fonts, style',
        'Voice is how you sound; tone is how you adapt',
        'Brand promise should be deliverable',
        'Consistency builds trust over time',
        'Stories make brands memorable',
        'Community is the ultimate brand asset',
        'Authenticity > perfection'
      ],
      copywritingSecrets: [
        'Write like you talk - conversational converts',
        'Benefits over features every time',
        'Specificity beats vagueness',
        'Emotional connection drives action',
        'Clear CTA: what do you want them to do?',
        'Test headlines - they carry the message',
        'AIDA: Attention, Interest, Desire, Action'
      ],
      audienceBuilding: [
        'Know your audience better than they know themselves',
        'Buyer personas are roadmaps, not prisons',
        'Pain points > features in messaging',
        'Community creates loyalty beyond product',
        'User-generated content is authentic proof',
        'Email list is your most owned asset',
        'Micro-influencers often outperform macro'
      ],
      analyticsMetrics: [
        'Vanity metrics (followers) vs action metrics (engagement)',
        'Reach x conversion = impact',
        'Retention > acquisition cheaper',
        'CAC should be less than LTV',
        'Benchmark against past performance',
        'A/B testing: one variable at a time',
        'Attribution: know what drives revenue'
      ],
      commonMistakes: [
        'Chasing trends before brand foundation',
        'Selling before building trust',
        'Ignoring analytics - gut feelings are not data',
        'Copying competitors instead of differentiation',
        'Inconsistent posting destroys momentum',
        'No clear call to action',
        'Focusing on vanity over business metrics'
      ]
    },
    storyPrompts: {
      turningPoints: [
        'When a piece of content went viral unexpectedly',
        'Building an audience from zero',
        'Realizing marketing changed the business',
        'Finding the content formula that worked',
        'First 1000 followers milestone'
      ],
      unexpected: [
        'The post that flopped but then went viral',
        'When competitor became collaborator',
        'Going viral for the wrong reasons',
        'Unexpected audience from surprising content'
      ]
    }
  },

  productivity: {
    name: 'Productivity',
    insights: {
      timeManagement: [
        'Time is finite; energy is manageable',
        'Eat the frog: do hardest task first',
        'Time blocking protects deep work hours',
        'Calendar is a commitment device',
        'Weekly review prevents drift',
        'Not all hours are equal - know yours',
        'Meeting cost: prep + duration + recovery'
      ],
      focusSecrets: [
        'Single-tasking beats multitasking always',
        'Flow state requires 90-minute blocks',
        'Environment design: remove distractions',
        'Phone on airplane mode = focus mode',
        'Timer technique: 25 min work, 5 min break',
        'Inbox zero daily reduces cognitive load',
        'Morning for creative, afternoon for meetings'
      ],
      habitFormation: [
        'Cue → Routine → Reward framework',
        'Habit stacking: attach to existing habit',
        'Make it easy: reduce friction for good habits',
        '2-minute rule: if it takes less, do it now',
        'Habit tracking: visual streaks motivate',
        'Environmental design beats willpower',
        'Identity-based habits last longer'
      ],
      goalSetting: [
        'SMART: Specific, Measurable, Achievable, Relevant, Time-bound',
        'Yearly theme provides direction, not constraint',
        'OKRs: ambitious goals with measurable results',
        'Break big goals into weekly actions',
        'Share goals for accountability',
        'Celebrate milestones - progress matters',
        'Review and adjust quarterly'
      ],
      energyManagement: [
        'Sleep is the foundation - 7-9 hours non-negotiable',
        'Exercise: 30 min daily transforms energy',
        'Breaks prevent decision fatigue',
        'Hydration affects mental clarity',
        'Naps: power nap 20 min max',
        'Coffee strategically: first thing disrupts cortisol',
        'Walking meetings boost creativity'
      ],
      procrastinationSolutions: [
        '5-minute start: just begin, momentum follows',
        'Remove friction: make bad habits harder',
        'Break into tiny steps - overwhelm is enemy',
        ' Accountability: tell someone',
        'Reward completion: have something to look forward to',
        'Body doubling: work alongside others',
        ' Perfectionism is procrastination in disguise'
      ],
      systemBuilding: [
        'Weekend reset: prep for Monday',
        'Evening routine: tomorrow starts tonight',
        'Weekly review: 30 min to plan week',
        'Monthly reflection: what worked, what did not',
        'Quarterly planning: big picture check',
        'Annual review: trajectory and direction',
        'Second brain: capture, organize, review'
      ],
      digitalMinamalism: [
        'Unsubscribe from everything - start fresh',
        'Notification off by default',
        'Social media: scheduled times only',
        'App rationing: set daily limits',
        'Dopamine detox: 24-48 hours off screens',
        'Do not disturb: schedule it daily',
        'One inbox, zero tabs'
      ]
    },
    storyPrompts: {
      turningPoints: [
        'When productivity system finally clicked',
        'First week of deep work commitment',
        'Realizing rest was part of productivity',
        'Achieving inbox zero and staying there',
        'Finding the right tool or system'
      ],
      unexpected: [
        'Doing less but accomplishing more',
        'How letting go of productivity guilt helped',
        'Unexpected breakthrough after vacation',
        'When the system became second nature'
      ]
    }
  },

  lifestyle: {
    name: 'Lifestyle',
    insights: {
      morningRoutines: [
        '5 AM club: quiet hours before chaos',
        'Hydrate first: water with lemon',
        'Move your body: 10 minutes minimum',
        'Meditate or journal: mental clarity',
        'Review goals: daily priorities clear',
        'Cold exposure: cold shower or face wash',
        'Nourish well: protein-rich breakfast'
      ],
      selfCare: [
        'Rest is productive - brain needs it',
        'Boundaries: no is complete sentence',
        'Digital detox: regular breaks from screens',
        'Nature: 20 min daily reduces cortisol',
        'Journaling: process emotions, gain clarity',
        'Saying no to good enables yes to great',
        'Therapy: mental health is health'
      ],
      minimalism: [
        'Less but better: quality over quantity',
        'One in, one out: maintain balance',
        'Clear spaces create calm mind',
        'Experiences over things: lasting happiness',
        'Define essentials: everything else is bonus',
        'Digital minimalism: organized files, clear phone',
        'Declutter regularly: annual and seasonal'
      ],
      relationships: [
        'Quality time: present with people',
        'Active listening: hear to understand, not reply',
        'Express gratitude: tell people they matter',
        'Quality > quantity in friendships',
        'Boundaries in relationships are healthy',
        'Shared experiences build bonds',
        'Nurture yourself to show up for others'
      ],
      personalGrowth: [
        'Read 20 min daily: knowledge compounds',
        'Learn a new skill yearly',
        'Find mentors: learn from mistakes of others',
        'Step outside comfort zone regularly',
        'Failure is data: iterate and improve',
        'Daily reflection: what went well, what to improve',
        'Goals give life direction and meaning'
      ],
      homeEnvironment: [
        'Bedroom: sleep sanctuary only',
        'Workspace: clean desk, clear mind',
        'Plants: improve air and mood',
        'Lighting: natural light best; warm tones evening',
        'Organize for how you actually live',
        'Personal touches make it home',
        'Scent: lavender or eucalyptus for calm'
      ],
      workLifeBalance: [
        'Define success for yourself - not others',
        'Set working hours and stick to them',
        'Lunch break: real break, not at desk',
        'Leave work at work - home is home',
        'Pursue hobbies outside work',
        'Vacation: actually disconnect',
        'Boundaries with email and slack after hours'
      ],
      financialWellness: [
        'Pay yourself first: savings before expenses',
        'Track spending: awareness enables choices',
        'Needs vs wants: be honest',
        'Invest early: compound interest is powerful',
        'Experiences over things: better ROI on happiness',
        'Contentment: enough is a powerful word',
        'Financial stress affects everything - address it'
      ]
    },
    storyPrompts: {
      turningPoints: [
        'When minimalism changed perspective on stuff',
        'Morning routine transformation',
        'Learning to rest without guilt',
        'Finding balance after burnout',
        'Defining personal success on own terms'
      ],
      unexpected: [
        'The thing that unexpectedly sparked joy',
        'Letting go that helped gain',
        'When simple proved sufficient',
        'Routine disruption brought clarity'
      ]
    }
  },

  finance: {
    name: 'Finance',
    insights: {
      investingBasics: [
        'Start early: compound interest is powerful',
        'Index funds: diversified, low-cost, effective',
        'Time in market beats timing market',
        'Emergency fund: 3-6 months expenses',
        'Diversification reduces risk',
        'Boring investing often wins',
        'Volatility is normal; do not panic sell'
      ],
      wealthBuilding: [
        'Pay yourself first: automate savings',
        'Live below means: save the difference',
        'Multiple income streams reduce risk',
        'Invest in yourself: skills pay lifelong dividends',
        'Real estate can build long-term wealth',
        'Tax-advantaged accounts first: 401k, IRA',
        'Estate planning: protect what you build'
      ],
      budgetingMethods: [
        '50/30/20: needs, wants, savings',
        'Zero-based: every dollar assigned purpose',
        'Envelope system: cash for categories',
        'Pay yourself first: savings automatic',
        'Track every purchase first month',
        'Needs vs wants: be ruthlessly honest',
        'Review monthly: adjust as life changes'
      ],
      commonMistakes: [
        'High-interest debt: pay off aggressively',
        'Lifestyle inflation: more income, more spending',
        'No emergency fund: financial vulnerability',
        'Investing emergency money: illiquid, risky',
        'Keeping cash under mattress: loses purchasing power',
        'Timing market: crystal ball does not exist',
        'Ignoring fees: they compound against you'
      ],
      retirementPlanning: [
        'Start now: even small amounts matter',
        '401k match: free money, do not miss it',
        'Roth vs Traditional: know the difference',
        'FIRE movement: Financial Independence, Retire Early',
        '4% rule: safe withdrawal rate historically',
        'Sequence of returns risk: early retirement',
        'Healthcare: often biggest retirement cost'
      ],
      passiveIncome: [
        'Dividend investing: companies share profits',
        'Rental real estate: cash flow + appreciation',
        'Index funds: set and forget compounding',
        'Digital products: create once, sell many',
        'Licensing: monetize skills or creations',
        'Interest: HYSAs, bonds, treasuries',
        'Business ownership: scalable income'
      ],
      cryptoBasics: [
        'Bitcoin: first, largest, store of value narrative',
        'Ethereum: smart contracts, DeFi, NFTs',
        'Altcoins: higher risk, higher potential reward',
        'Dollar-cost averaging: reduce volatility risk',
        'Only invest what you can afford to lose',
        'Custody: self-wallet vs exchange',
        'Regulation: evolving, affects holdings'
      ],
      financialMindset: [
        'Money is tool for options and freedom',
        'Financial literacy is learnable skill',
        'Net worth: assets minus liabilities',
        'Money does not buy happiness, but reduces stress',
        'Generosity: giving feels good, often comes back',
        'Contentment: enough is powerful word',
        'Legacy: what you leave matters'
      ]
    },
    storyPrompts: {
      turningPoints: [
        'First investment milestone',
        'When money stopped being scary',
        'Reaching financial independence number',
        'Learning money lessons the hard way',
        'First passive income check'
      ],
      unexpected: [
        'How saving small amounts became big',
        'Market crash taught long-term thinking',
        'Side hustle became main income',
        'Money did not solve expected problems'
      ]
    }
  }
};

/**
 * KnowledgeLayer
 * Provides structured knowledge for content generation
 */
export class KnowledgeLayer {
  constructor() {
    this.knowledge = KNOWLEDGE_BASE;
    this.currentCategory = null;
  }

  /**
   * Get knowledge for a category
   * @param {string} category - Category name
   * @returns {Object} Knowledge data
   */
  getKnowledge(category) {
    const normalized = category.toLowerCase().replace(/\s+/g, '');
    return this.knowledge[normalized] || null;
  }

  /**
   * Get random insight from category
   * @param {string} category - Category name
   * @param {string} insightType - Type of insight
   * @returns {string} Random insight
   */
  getInsight(category, insightType) {
    const knowledge = this.getKnowledge(category);
    if (!knowledge || !knowledge.insights[insightType]) return null;

    const insights = knowledge.insights[insightType];
    return insights[Math.floor(Math.random() * insights.length)];
  }

  /**
   * Get all insights for a category
   * @param {string} category - Category name
   * @returns {Object} All insights
   */
  getAllInsights(category) {
    const knowledge = this.getKnowledge(category);
    return knowledge?.insights || {};
  }

  /**
   * Get story prompt from category
   * @param {string} category - Category name
   * @param {string} type - Type of story prompt
   * @returns {string} Random story prompt
   */
  getStoryPrompt(category, type = 'turningPoints') {
    const knowledge = this.getKnowledge(category);
    if (!knowledge || !knowledge.storyPrompts[type]) return null;

    const prompts = knowledge.storyPrompts[type];
    const typeKey = type === 'turningPoints' ? 'turningPoints' : 'unexpected';
    const items = prompts[typeKey] || prompts;
    return items[Math.floor(Math.random() * items.length)];
  }

  /**
   * Generate knowledge-grounded content section
   * @param {string} category - Category name
   * @param {string} sectionType - Type of section
   * @param {Object} options - Generation options
   * @returns {Object} Generated section with knowledge
   */
  generateSection(category, sectionType, options = {}) {
    const { personality = 'default' } = options;
    const knowledge = this.getKnowledge(category);
    if (!knowledge) return null;

    const insightTypes = Object.keys(knowledge.insights);
    const randomInsightType = insightTypes[Math.floor(Math.random() * insightTypes.length)];
    const insight = knowledge.insights[randomInsightType][
      Math.floor(Math.random() * knowledge.insights[randomInsightType].length)
    ];

    const sectionFormats = {
      fact: `Here's a fact about ${category}:\n\n${insight}`,
      tip: `The ${this._formatKey(randomInsightType)} that changed everything:\n\n${insight}`,
      truth: `Unpopular opinion about ${category}:\n\n${insight}`,
      secret: `The ${category} secret nobody tells you:\n\n${insight}`
    };

    return {
      type: randomInsightType,
      format: Object.keys(sectionFormats)[Math.floor(Math.random() * 4)],
      content: sectionFormats[Object.keys(sectionFormats)[Math.floor(Math.random() * 4)]],
      knowledge: insight
    };
  }

  _formatKey(key) {
    return key.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase());
  }

  /**
   * Check if category exists
   * @param {string} category - Category name
   * @returns {boolean}
   */
  hasKnowledge(category) {
    const normalized = category.toLowerCase().replace(/\s+/g, '');
    return !!this.knowledge[normalized];
  }

  /**
   * Get all available categories
   * @returns {string[]} Category names
   */
  getCategories() {
    return Object.keys(this.knowledge).map(key => ({
      key,
      name: this.knowledge[key].name
    }));
  }
}

export default KnowledgeLayer;
