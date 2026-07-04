// Product Description Generator
import { ContentData, random, shuffle, capitalizeFirst } from '../core/contentData.js';

export class ProductGenerator {
  static generate(options = {}) {
    const {
      name,
      features = '',
      price = '',
      audience = ''
    } = options;

    if (!name || !name.trim()) {
      throw new Error('Product name is required');
    }

    const featureList = features 
      ? features.split(',').map(f => f.trim()).filter(Boolean)
      : ['Premium quality', 'Easy to use', 'Great value'];
    const audienceText = audience || 'customers';

    return [
      {
        id: `product-${Date.now()}-1`,
        type: 'product',
        title: 'Version 1: Benefit-Focused',
        content: this._generateBenefitFocused(name, featureList, price, audienceText),
        highlights: featureList.slice(0, 4),
        metadata: { style: 'benefit-focused' }
      },
      {
        id: `product-${Date.now()}-2`,
        type: 'product',
        title: 'Version 2: Story-Driven',
        content: this._generateStoryDriven(name, featureList, price, audienceText),
        highlights: featureList.slice(0, 3),
        metadata: { style: 'story-driven' }
      },
      {
        id: `product-${Date.now()}-3`,
        type: 'product',
        title: 'Version 3: Direct & Punchy',
        content: this._generateDirectPunchy(name, featureList, price),
        highlights: featureList.slice(0, 3),
        metadata: { style: 'direct' }
      }
    ];
  }

  static _generateBenefitFocused(name, features, price, audience) {
    let text = `✨ Introducing ${name} ✨\n\n`;
    text += `Transform your ${audience} experience with ${name}. `;
    text += `This isn't just another product - it's the solution you've been searching for.\n\n`;
    text += features.slice(0, 3).map(f => `• ${capitalizeFirst(f)}`).join('\n') + '\n\n';
    if (price) {
      text += `💰 Priced at ${price} - an investment in yourself.\n\n`;
    }
    text += `Ready to make the change? Tap the link in bio to learn more.\n\n`;
    text += `#${name.replace(/\s+/g, '')} #ProductLaunch #MustHave`;
    return text;
  }

  static _generateStoryDriven(name, features, price, audience) {
    const struggles = ['finding the right solution', 'getting results', 'staying consistent', 'seeing progress'];
    
    let text = `Let me tell you about ${name} 👇\n\n`;
    text += `I used to struggle with ${random(struggles)}. Then I found ${name}.\n\n`;
    text += `Here's what makes it different:\n\n`;
    text += features.map((f, i) => `${i + 1}. ${capitalizeFirst(f)}`).join('\n') + '\n\n';
    if (audience) text += `Designed specifically for ${audience}.\n`;
    if (price) text += `Now available for ${price}.\n`;
    text += `\nThis could be exactly what you need.\n\n`;
    text += `Drop a 🔥 if you're ready to level up!`;
    return text;
  }

  static _generateDirectPunchy(name, features, price) {
    let text = `${name}.\n\n`;
    text += `That's it. That's the product.\n\n`;
    text += features.slice(0, 3).map((f, i) => `✅ ${capitalizeFirst(f)}`).join('\n') + '\n\n';
    if (price) text += `💰 ${price}\n`;
    text += `👆 Link in bio\n\n`;
    text += `No fluff. No BS. Just results.\n\n`;
    text += `Tag someone who needs this! 👇`;
    return text;
  }
}

export default ProductGenerator;
