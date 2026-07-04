// Reels Ideas Generator
import { ContentData, random, shuffle } from '../core/contentData.js';

export class ReelsGenerator {
  static generate(options = {}) {
    const {
      category = 'educational',
      audience = '',
      style = 'trendy'
    } = options;

    const hooks = ContentData.reelsHooks[category] || ContentData.reelsHooks.lifestyle;
    const audienceText = audience || 'your target audience';
    const reels = [];

    for (let i = 0; i < 5; i++) {
      const hook = random(hooks);
      const durations = ['15-30 sec', '30-60 sec', '60-90 sec'];
      const styles = style === 'trendy'
        ? ['Fast-paced cuts', 'Trending audio', 'Text overlays', 'Green screen effect']
        : ['Educational text', 'Step-by-step', 'Before/after', 'Clean transitions'];

      reels.push({
        id: `reel-${Date.now()}-${i}`,
        type: 'reel',
        title: `${hook} ${this._getCategoryEmoji(category)}`,
        content: this._generateScript(category, hook, audienceText),
        metadata: {
          duration: random(durations),
          style: random(styles),
          audio: random(ContentData.trendingAudio),
          category,
          styleType: style
        }
      });
    }

    return reels;
  }

  static _generateScript(category, hook, audience) {
    const scripts = {
      educational: [
        `1. Hook (0-3s)\n2. Break down the topic into 3 key points\n3. Explain each point with a quick example\n4. Summary and key takeaway\n5. CTA: "Follow for more tips"`,
        `1. Hook - ask a common question\n2. Share the common misconception\n3. Reveal the truth with evidence\n4. Give actionable steps\n5. CTA: "Save this for later!"`,
        `1. Start with "Here's the thing"\n2. Point 1 with visual demonstration\n3. Point 2 with real-life example\n4. Point 3 quick win tip\n5. Wrap up with motivation`
      ],
      entertainment: [
        `1. Start with relatable situation\n2. Escalate the comedy\n3. Unexpected twist ending\n4. Tag/reaction at the end\n5. Trending sound throughout`,
        `1. POV opening scene\n2. Build up the story\n3. Punchline delivery\n4. Reaction shot\n5. Call to action`,
        `1. Set up the scenario\n2. Build anticipation\n3. The reveal moment\n4. Comedic payoff\n5. Call to action`
      ],
      'behind-scenes': [
        `1. Quick intro to setting\n2. Show your process/workflow\n3. Share a challenge you faced\n4. How you solved it\n5. BTS tips viewers can use`,
        `1. Morning routine intro\n2. Show the prep work\n3. Main activity/dreation\n4. The "glamorous" reality\n5. Wrap up and CTA`,
        `1. Start with "What nobody tells you"\n2. Show the messy reality\n3. Contrast with perception\n4. Honest commentary\n5. Ask followers about their experience`
      ],
      lifestyle: [
        `1. Morning setup shot\n2. Walk through your routine\n3. Show products/tools used\n4. Share 1-2 tips\n5. End with "Day X" outro`,
        `1. Hook: "Here's how I..."\n2. Quick montage of process\n3. Show the results\n4. Products/resources in text\n5. "Try this" CTA`,
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

  static _getCategoryEmoji(category) {
    const emojis = {
      educational: '🔢',
      entertainment: '😂',
      'behind-scenes': '🎬',
      lifestyle: '✨',
      productivity: '⚡'
    };
    return emojis[category] || '📱';
  }

  static getCategories() {
    return [
      { value: 'educational', label: 'Educational / Tutorial' },
      { value: 'entertainment', label: 'Entertainment' },
      { value: 'behind-scenes', label: 'Behind the Scenes' },
      { value: 'lifestyle', label: 'Lifestyle' },
      { value: 'productivity', label: 'Productivity' }
    ];
  }

  static getStyles() {
    return [
      { value: 'trendy', label: 'Trendy' },
      { value: 'evergreen', label: 'Evergreen' }
    ];
  }
}

export default ReelsGenerator;
