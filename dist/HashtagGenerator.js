// Hashtag Generator
import { ContentData, random, shuffle } from '../core/contentData.js';

export class HashtagGenerator {
  static generate(options = {}) {
    const {
      keywords,
      count = 15
    } = options;

    if (!keywords || !keywords.trim()) {
      throw new Error('Keywords are required');
    }

    const keywordList = keywords.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
    const selectedCategories = keywordList.length > 1 
      ? shuffle(['popular', 'lifestyle', 'business', 'fitness', 'food', 'travel', 'fashion']).slice(0, 2)
      : ['popular'];

    let allHashtags = [];

    // Add popular hashtags
    const popular = shuffle(ContentData.hashtags.popular).slice(0, Math.ceil(count * 0.3));
    allHashtags = allHashtags.concat(popular);

    // Add category-specific hashtags
    selectedCategories.forEach(cat => {
      if (ContentData.hashtags[cat]) {
        const categoryTags = shuffle(ContentData.hashtags[cat]).slice(0, Math.ceil(count * 0.25));
        allHashtags = allHashtags.concat(categoryTags);
      }
    });

    // Add keyword-based hashtags
    keywordList.forEach(kw => {
      const formattedKw = kw.replace(/\s+/g, '');
      allHashtags.push(`#${formattedKw}`, `#${formattedKw}life`, `#${formattedKw}gram`);
    });

    // Shuffle and limit
    allHashtags = shuffle([...new Set(allHashtags)]).slice(0, Math.min(count, allHashtags.length));

    // Split into groups
    const popularTags = allHashtags.slice(0, Math.floor(count * 0.3));
    const nicheTags = allHashtags.slice(Math.floor(count * 0.3), Math.floor(count * 0.6));
    const keywordTags = allHashtags.slice(Math.floor(count * 0.6));

    return [
      {
        id: `hashtag-${Date.now()}`,
        type: 'hashtag',
        title: 'Popular Hashtags',
        content: popularTags.join(' '),
        tags: popularTags,
        metadata: { category: 'popular', count: popularTags.length }
      },
      {
        id: `hashtag-${Date.now()}-niche`,
        type: 'hashtag',
        title: 'Niche Hashtags',
        content: nicheTags.join(' '),
        tags: nicheTags,
        metadata: { category: 'niche', count: nicheTags.length }
      },
      {
        id: `hashtag-${Date.now()}-related`,
        type: 'hashtag',
        title: 'Related Hashtags',
        content: keywordTags.join(' '),
        tags: keywordTags,
        metadata: { category: 'related', count: keywordTags.length }
      }
    ].filter(group => group.tags.length > 0);
  }

  static getCountRange() {
    return { min: 5, max: 30, default: 15 };
  }
}

export default HashtagGenerator;
