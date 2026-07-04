/**
 * ResearchExtractor
 * Extracts structured data from research results
 */

export class ResearchExtractor {
  constructor() {
    this.entityPatterns = this._buildEntityPatterns();
    this.questionPatterns = this._buildQuestionPatterns();
    this.trendPatterns = this._buildTrendPatterns();
  }

  /**
   * Extract all structured data from research
   */
  extract(rawData, options = {}) {
    const { topic = '' } = options;

    return {
      topic,
      results: this.extractResults(rawData),
      entities: this.extractEntities(rawData),
      questions: this.extractQuestions(rawData),
      trends: this.extractTrends(rawData),
      insights: this.extractInsights(rawData),
      keywords: this.extractKeywords(rawData),
      painPoints: this.extractPainPoints(rawData),
      misconceptions: this.extractMisconceptions(rawData),
      comparisons: this.extractComparisons(rawData),
      opinions: this.extractOpinions(rawData),
      examples: this.extractExamples(rawData),
      statistics: this.extractStatistics(rawData),
      products: this.extractProducts(rawData),
      companies: this.extractCompanies(rawData),
      people: this.extractPeople(rawData),
      hashtags: this.extractHashtags(rawData),
      timestamp: Date.now()
    };
  }

  /**
   * Extract search results
   */
  extractResults(rawData) {
    if (!rawData) return [];
    
    if (Array.isArray(rawData)) {
      return rawData.map(r => ({
        title: r.title || '',
        url: r.url || '',
        snippet: r.snippet || r.Text || '',
        source: r.source || 'unknown'
      })).filter(r => r.title || r.snippet);
    }
    
    if (rawData.results) {
      return this.extractResults(rawData.results);
    }
    
    if (rawData.RelatedTopics) {
      return rawData.RelatedTopics.map(t => ({
        title: t.Text || t.Topics?.[0]?.Text || '',
        url: t.FirstURL || t.Topics?.[0]?.FirstURL || '',
        snippet: t.Text || '',
        source: 'duckduckgo'
      })).filter(r => r.title);
    }
    
    return [];
  }

  /**
   * Extract entities (products, companies, people)
   */
  extractEntities(rawData) {
    const entities = [];
    const text = this._getText(rawData);
    
    // Extract capitalized phrases (potential entities)
    const capitalPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g;
    const matches = text.match(capitalPattern) || [];
    
    // Filter out common words
    const commonWords = new Set(['The', 'This', 'That', 'These', 'Those', 'There', 'Here', 'What', 'When', 'Where', 'Why', 'How', 'I', 'A', 'An', 'In', 'On', 'At', 'To', 'For', 'Of', 'And', 'Or', 'But', 'With', 'From']);
    
    const filtered = matches.filter(m => !commonWords.has(m.split(' ')[0]));
    const counts = {};
    filtered.forEach(m => counts[m] = (counts[m] || 0) + 1);
    
    // Entities mentioned multiple times are likely real entities
    Object.entries(counts)
      .filter(([_, count]) => count >= 2 && counts[_].length > 2)
      .forEach(([entity, count]) => {
        entities.push({ name: entity, count, type: 'unknown' });
      });
    
    // Categorize known entities
    entities.forEach(e => {
      if (this.isCompany(e.name)) e.type = 'company';
      else if (this.isPerson(e.name)) e.type = 'person';
      else if (this.isProduct(e.name)) e.type = 'product';
    });
    
    return entities.slice(0, 20);
  }

  /**
   * Extract questions
   */
  extractQuestions(rawData) {
    const questions = [];
    const text = this._getText(rawData);
    
    // Patterns that indicate questions
    const patterns = [
      /what (is|are|does|do|would|should|will|can|has|had)\s+[^?]+\?/gi,
      /how (to|do|does|can|would|should|is|are)\s+[^?]+\?/gi,
      /why (does|do|is|are|would|should|can)\s+[^?]+\?/gi,
      /when (does|do|is|are|would|should)\s+[^?]+\?/gi,
      /where (does|do|is|are|would|should)\s+[^?]+\?/gi,
      /is\s+[^?]+\?/gi,
      /can\s+[^?]+\?/gi,
      /should\s+[^?]+\?/gi,
      /does\s+[^?]+\?/gi
    ];
    
    patterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      matches.forEach(q => {
        const clean = q.trim();
        if (clean.length > 15 && clean.length < 200) {
          questions.push({
            text: clean,
            type: this._classifyQuestion(clean)
          });
        }
      });
    });
    
    return this._dedupeQuestions(questions).slice(0, 15);
  }

  /**
   * Classify question type
   */
  _classifyQuestion(text) {
    const lower = text.toLowerCase();
    if (lower.startsWith('what')) return 'what';
    if (lower.startsWith('how')) return 'how';
    if (lower.startsWith('why')) return 'why';
    if (lower.startsWith('when')) return 'when';
    if (lower.startsWith('where')) return 'where';
    if (lower.startsWith('is') || lower.startsWith('are')) return 'yesno';
    if (lower.startsWith('can')) return 'capability';
    if (lower.startsWith('should')) return 'advice';
    return 'other';
  }

  /**
   * Extract trends
   */
  extractTrends(rawData) {
    const trends = [];
    const text = this._getText(rawData);
    
    const trendIndicators = [
      /\b(trending|viral|popular|growing|emerging|latest|new|recent|current)\s+([a-z\s]+?)(?=,|\.|$)/gi,
      /\b202[0-9]\s+([a-z\s]+?)(?=,|\.|$)/gi,
      /\b(upcoming|forecast|predicted|expected|projected)\s+([a-z\s]+?)(?=,|\.|$)/gi
    ];
    
    trendIndicators.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const trend = (match[2] || match[1] || '').trim();
        if (trend.length > 3 && trend.length < 50) {
          trends.push({
            text: trend,
            indicator: match[1] || match[0].split(' ')[0]
          });
        }
      }
    });
    
    return this._dedupe(trends, 'text').slice(0, 10);
  }

  /**
   * Extract insights
   */
  extractInsights(rawData) {
    const insights = [];
    const text = this._getText(rawData);
    
    const insightPatterns = [
      /the (truth|secret|key|main|real|important|biggest)\s+([^.]+)/gi,
      /what nobody (tells|talks|shares|mentions)\s+([^.]+)/gi,
      /here'?s (what|the)\s+([^.]+)/gi,
      /most people (don'?t|never|ignore|overlook)\s+([^.]+)/gi,
      /(actually|really|truly|honestly)\s+([^.]+)/gi,
      /the (issue|problem|reason|cause)\s+([^.]+)/gi,
      /(contrary|counterintuitive|unexpected|surprising)\s+([^.]+)/gi
    ];
    
    insightPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const insight = (match[2] || match[1] || '').trim();
        if (insight.length > 10 && insight.length < 200) {
          insights.push({
            text: match[0].trim(),
            insight: insight,
            type: this._classifyInsight(match[0])
          });
        }
      }
    });
    
    return this._dedupe(insights, 'text').slice(0, 10);
  }

  /**
   * Classify insight type
   */
  _classifyInsight(text) {
    const lower = text.toLowerCase();
    if (lower.includes('secret')) return 'secret';
    if (lower.includes('truth') || lower.includes('myth')) return 'truth';
    if (lower.includes('nobody')) return 'gap';
    if (lower.includes('most people')) return 'behavior';
    if (lower.includes('contrary') || lower.includes('counterintuitive')) return 'contrary';
    if (lower.includes('problem') || lower.includes('issue')) return 'problem';
    return 'general';
  }

  /**
   * Extract keywords
   */
  extractKeywords(rawData) {
    const text = this._getText(rawData);
    
    // Extract words 4+ characters
    const words = text.split(/\W+/).filter(w => w.length >= 4);
    
    // Count frequencies
    const counts = {};
    words.forEach(w => {
      const lower = w.toLowerCase();
      counts[lower] = (counts[lower] || 0) + 1;
    });
    
    // Filter out common stop words
    const stopWords = new Set([
      'that', 'this', 'with', 'from', 'have', 'been', 'were', 'they',
      'their', 'what', 'when', 'where', 'which', 'about', 'would',
      'could', 'should', 'there', 'here', 'these', 'those', 'being',
      'other', 'some', 'into', 'only', 'very', 'just', 'than'
    ]);
    
    // Return top keywords
    return Object.entries(counts)
      .filter(([word]) => !stopWords.has(word))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([word, count]) => ({ word, count }));
  }

  /**
   * Extract pain points
   */
  extractPainPoints(rawData) {
    const painPoints = [];
    const text = this._getText(rawData);
    
    const painPatterns = [
      /struggle[s]?\s+(?:with|from)\s+([^.]+)/gi,
      /problem[s]?\s+(?:with|in)\s+([^.]+)/gi,
      /challenge[s]?\s+(?:with|in)\s+([^.]+)/gi,
      /frustrat[ing|ed]\s+(?:with|by)\s+([^.]+)/gi,
      /difficult[yies]?\s+(?:with|in)\s+([^.]+)/gi,
      /hard\s+(?:to|for)\s+([^.]+)/gi,
      /fail(?:s|ed|ing)?\s+(?:to|in)\s+([^.]+)/gi,
      /wrong\s+([^.]+)/gi,
      /mistake[s]?\s+([^.]+)/gi
    ];
    
    painPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const pain = (match[1] || match[0]).trim();
        if (pain.length > 5 && pain.length < 100) {
          painPoints.push({ text: pain, type: 'pain_point' });
        }
      }
    });
    
    return this._dedupe(painPoints, 'text').slice(0, 10);
  }

  /**
   * Extract misconceptions
   */
  extractMisconceptions(rawData) {
    const misconceptions = [];
    const text = this._getText(rawData);
    
    const misconceptionPatterns = [
      /myth\s*[:\-]?\s*([^.]+)/gi,
      /wrong\s+belief\s*[:\-]?\s*([^.]+)/gi,
      /common\s+misconception\s*[:\-]?\s*([^.]+)/gi,
      /people\s+think\s+([^,]+)\s+but\s+([^.]+)/gi,
      /(?:actually|really|truth)\s+([^,]+)\s+not\s+([^.]+)/gi
    ];
    
    misconceptionPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const text = match[0].trim();
        if (text.length > 10 && text.length < 200) {
          misconceptions.push({ text });
        }
      }
    });
    
    return this._dedupe(misconceptions, 'text').slice(0, 5);
  }

  /**
   * Extract comparisons
   */
  extractComparisons(rawData) {
    const comparisons = [];
    const text = this._getText(rawData);
    
    const comparisonPatterns = [
      /([A-Z][^vs]+?)\s+vs\.?\s+([A-Z][^.]+)/gi,
      /([A-Z][^versus]+?)\s+versus\s+([A-Z][^.]+)/gi,
      /better\s+(?:than|in)\s+([^.]+)/gi,
      /worse\s+(?:than|in)\s+([^.]+)/gi,
      /compared\s+(?:to|with)\s+([^.]+)/gi
    ];
    
    comparisonPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const text = match[0].trim();
        if (text.length > 10 && text.length < 150) {
          comparisons.push({ text, subject: match[1], compared: match[2] });
        }
      }
    });
    
    return this._dedupe(comparisons, 'text').slice(0, 5);
  }

  /**
   * Extract opinions
   */
  extractOpinions(rawData) {
    const opinions = [];
    const text = this._getText(rawData);
    
    const opinionPatterns = [
      /i\s+(think|believe|feel|guess|prefer)\s+([^.]+)/gi,
      /in\s+my\s+(opinion|view|experience)\s*[:\-]?\s*([^.]+)/gi,
      /experts?\s+(say|recommend|suggest|believe)\s+([^.]+)/gi,
      /most\s+people\s+(think|believe|feel)\s+([^.]+)/gi,
      /according\s+to\s+([^,]+)\s*[:\-]?\s*([^.]+)/gi
    ];
    
    opinionPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const text = match[0].trim();
        if (text.length > 10 && text.length < 200) {
          opinions.push({ text });
        }
      }
    });
    
    return this._dedupe(opinions, 'text').slice(0, 5);
  }

  /**
   * Extract examples
   */
  extractExamples(rawData) {
    const examples = [];
    const text = this._getText(rawData);
    
    const examplePatterns = [
      /for\s+example\s*[:\-]?\s*([^.]+)/gi,
      /for\s+instance\s*[:\-]?\s*([^.]+)/gi,
      /such\s+as\s+([^.]+)/gi,
      /like\s+([^.]+specifically|when)[^.]+/gi,
      /case\s+study\s*[:\-]?\s*([^.]+)/gi
    ];
    
    examplePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const example = (match[1] || match[0]).trim();
        if (example.length > 10 && example.length < 300) {
          examples.push({ text: example, type: 'example' });
        }
      }
    });
    
    return this._dedupe(examples, 'text').slice(0, 5);
  }

  /**
   * Extract statistics
   */
  extractStatistics(rawData) {
    const statistics = [];
    const text = this._getText(rawData);
    
    const statPatterns = [
      /\d+%/gi,
      /\d+x/gi,
      /\d+\s+(million|billion|thousand)/gi,
      /\$\d+/gi,
      /\d+\s+(hours|days|weeks|months|years)\s+(?:of|per|every)/gi
    ];
    
    statPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const stat = match[0].trim();
        if (stat.length > 1 && stat.length < 30) {
          statistics.push({ text: stat, type: 'statistic' });
        }
      }
    });
    
    return this._dedupe(statistics, 'text').slice(0, 10);
  }

  /**
   * Extract products
   */
  extractProducts(rawData) {
    const products = [];
    const text = this._getText(rawData);
    
    const productPatterns = [
      /([A-Z][a-z]+(?:\s+[A-Z]?[a-z]+)*)\s+(?:app|tool|software|platform|service)/gi,
      /(?:new|latest|popular)\s+([a-z]+(?:\s+[a-z]+)*)\s+(?:app|tool|software)/gi
    ];
    
    productPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const product = (match[1] || match[0]).trim();
        if (product.length > 2 && product.length < 50) {
          products.push({ name: product, type: 'product' });
        }
      }
    });
    
    return this._dedupe(products, 'name').slice(0, 10);
  }

  /**
   * Extract companies
   */
  extractCompanies(rawData) {
    const companies = [];
    const text = this._getText(rawData);
    
    const companyPatterns = [
      /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Inc|Corp|LLC|Ltd|Company|Co\.)\b/gi,
      /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:says|launched|announced|released)/gi
    ];
    
    companyPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const company = (match[1] || match[0]).trim();
        if (company.length > 2 && company.length < 50) {
          companies.push({ name: company, type: 'company' });
        }
      }
    });
    
    return this._dedupe(companies, 'name').slice(0, 10);
  }

  /**
   * Extract people
   */
  extractPeople(rawData) {
    const people = [];
    const text = this._getText(rawData);
    
    const peoplePatterns = [
      /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:says|explains|shares|recommends|believes)/gi,
      /\b([A-Z][a-z]+)\s+(?:CEO|CTO|CFO|Founder|CEO|Director|Expert|Analyst)\b/gi
    ];
    
    peoplePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const person = (match[1] || match[0]).trim();
        if (person.length > 2 && person.length < 40) {
          people.push({ name: person, type: 'person' });
        }
      }
    });
    
    return this._dedupe(people, 'name').slice(0, 10);
  }

  /**
   * Extract hashtags
   */
  extractHashtags(rawData) {
    const hashtags = [];
    const text = this._getText(rawData);
    
    const hashtagPattern = /#(\w+)/g;
    let match;
    while ((match = hashtagPattern.exec(text)) !== null) {
      hashtags.push(match[1]);
    }
    
    return [...new Set(hashtags)].slice(0, 20);
  }

  /**
   * Helper: Get all text from raw data
   */
  _getText(rawData) {
    if (typeof rawData === 'string') return rawData;
    if (!rawData) return '';
    
    let text = '';
    
    if (rawData.results) {
      text += rawData.results.map(r => `${r.title} ${r.snippet}`).join(' ');
    }
    
    if (rawData.RelatedTopics) {
      text += rawData.RelatedTopics.map(t => `${t.Text} ${t.Topics?.map(x => x.Text).join(' ')}`).join(' ');
    }
    
    if (rawData.Definition) {
      text += rawData.Definition;
    }
    
    if (rawData.AbstractText) {
      text += rawData.AbstractText;
    }
    
    return text;
  }

  /**
   * Helper: Dedupe array by property
   */
  _dedupe(arr, prop) {
    const seen = new Set();
    return arr.filter(item => {
      const key = prop ? item[prop] : item;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  /**
   * Helper: Dedupe questions
   */
  _dedupeQuestions(questions) {
    const seen = new Set();
    return questions.filter(q => {
      const key = q.text.toLowerCase().substring(0, 30);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  /**
   * Check if entity is likely a company
   */
  isCompany(name) {
    const known = ['Inc', 'Corp', 'LLC', 'Ltd', 'Co', 'Company', 'Technologies', 'Solutions', 'Systems', 'Labs', 'Ventures', 'Capital', 'Partners', 'Media', 'Group', 'Holdings'];
    return known.some(suffix => name.includes(suffix));
  }

  /**
   * Check if entity is likely a person
   */
  isPerson(name) {
    const known = ['CEO', 'CTO', 'CFO', 'Founder', 'CEO', 'Director', 'Expert', 'Analyst', 'says', 'explains'];
    return known.some(suffix => name.includes(suffix));
  }

  /**
   * Check if entity is likely a product
   */
  isProduct(name) {
    const known = ['App', 'Tool', 'Software', 'Platform', 'Service', 'Plugin', 'Extension', 'API', 'SDK'];
    return known.some(suffix => name.includes(suffix));
  }

  /**
   * Build entity patterns
   */
  _buildEntityPatterns() {
    return {
      products: /(?:app|tool|software|platform|service|product)/i,
      companies: /(?:Inc|Corp|LLC|Ltd|Company|Co\.)/i,
      people: /(?:CEO|CTO|Founder|Director|Expert)s?\s+(?:of|at)/i
    };
  }

  /**
   * Build question patterns
   */
  _buildQuestionPatterns() {
    return [
      /\b(what|how|why|when|where|is|can|should|does)\s+[^?]+\?/gi
    ];
  }

  /**
   * Build trend patterns
   */
  _buildTrendPatterns() {
    return [
      /\b(trending|viral|popular|latest|new|emerging|upcoming)/i,
      /\b202[0-9]\b/
    ];
  }
}

export default ResearchExtractor;
