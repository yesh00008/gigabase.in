// Advanced Analytics & Intelligence System

export interface SearchAnalytics {
  queryComplexity: number;
  searchIntensity: number;
  semanticDepth: number;
  topicCoverage: string[];
  confidenceScore: number;
  recommendedFilters: string[];
  queryIntent: string;
  searchQuality: number;
}

export interface ContentQuality {
  readabilityScore: number;
  technicalDepth: number;
  comprehensiveness: number;
  codeQuality: number;
  visualElements: number;
  interactivityScore: number;
}

export class AdvancedAnalytics {
  
  /**
   * Analyze query to understand user intent and complexity
   */
  static analyzeQuery(query: string): SearchAnalytics {
    const words = query.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words);
    
    // Calculate query complexity
    const queryComplexity = this.calculateQueryComplexity(query);
    
    // Determine search intensity (how specific/broad)
    const searchIntensity = this.calculateSearchIntensity(words);
    
    // Calculate semantic depth
    const semanticDepth = this.calculateSemanticDepth(query);
    
    // Extract topics
    const topicCoverage = this.extractTopics(query);
    
    // Calculate confidence score
    const confidenceScore = this.calculateConfidenceScore(query, words.length);
    
    // Recommend filters
    const recommendedFilters = this.recommendFilters(query);
    
    // Detect query intent
    const queryIntent = this.detectQueryIntent(query);
    
    // Calculate overall search quality
    const searchQuality = (queryComplexity + searchIntensity + semanticDepth + confidenceScore) / 4;
    
    return {
      queryComplexity,
      searchIntensity,
      semanticDepth,
      topicCoverage,
      confidenceScore,
      recommendedFilters,
      queryIntent,
      searchQuality
    };
  }

  /**
   * Analyze content quality and relevance
   */
  static analyzeContentQuality(content: string): ContentQuality {
    const readabilityScore = this.calculateReadability(content);
    const technicalDepth = this.assessTechnicalDepth(content);
    const comprehensiveness = this.assessComprehensiveness(content);
    const codeQuality = this.assessCodeQuality(content);
    const visualElements = this.countVisualElements(content);
    const interactivityScore = this.assessInteractivity(content);
    
    return {
      readabilityScore,
      technicalDepth,
      comprehensiveness,
      codeQuality,
      visualElements,
      interactivityScore
    };
  }

  /**
   * Generate smart recommendations based on search context
   */
  static generateRecommendations(query: string, results: any[]): string[] {
    const recommendations: string[] = [];
    const analytics = this.analyzeQuery(query);
    
    // Based on query intent
    if (analytics.queryIntent === 'learning') {
      recommendations.push('Try our Learning Paths for structured guidance');
      recommendations.push('Check Video Tutorials for visual learning');
    } else if (analytics.queryIntent === 'problem-solving') {
      recommendations.push('Browse Code Snippets for ready-to-use solutions');
      recommendations.push('Explore Stack Overflow discussions');
    } else if (analytics.queryIntent === 'research') {
      recommendations.push('Search Research Papers for academic insights');
      recommendations.push('Review comprehensive documentation');
    }
    
    // Based on query complexity
    if (analytics.queryComplexity < 30) {
      recommendations.push('Try adding more specific keywords');
    } else if (analytics.queryComplexity > 80) {
      recommendations.push('Consider breaking down into simpler queries');
    }
    
    // Based on result count
    if (results.length < 5) {
      recommendations.push('Try broader search terms');
      recommendations.push('Check spelling and syntax');
    } else if (results.length > 50) {
      recommendations.push('Narrow down with specific filters');
      recommendations.push('Add technical terms for precision');
    }
    
    return recommendations.slice(0, 4);
  }

  /**
   * Calculate trend score for topics
   */
  static calculateTrendScore(topic: string): number {
    const trendingTopics = {
      'ai': 95, 'machine learning': 92, 'deep learning': 90,
      'react': 88, 'nextjs': 85, 'typescript': 87,
      'python': 84, 'rust': 82, 'go': 80,
      'kubernetes': 86, 'docker': 85, 'cloud': 83,
      'blockchain': 78, 'web3': 76, 'crypto': 75,
      'cybersecurity': 81, 'devops': 79, 'cicd': 77
    };
    
    const lowerTopic = topic.toLowerCase();
    for (const [key, score] of Object.entries(trendingTopics)) {
      if (lowerTopic.includes(key)) {
        return score;
      }
    }
    
    return 50; // Default trend score
  }

  /**
   * Generate search insights
   */
  static generateSearchInsights(query: string, results: any[]): {
    insight: string;
    icon: string;
    color: string;
  }[] {
    const insights: { insight: string; icon: string; color: string }[] = [];
    const analytics = this.analyzeQuery(query);
    
    // Query quality insight
    if (analytics.searchQuality > 80) {
      insights.push({
        insight: `Excellent search query! ${analytics.searchQuality.toFixed(0)}% quality score`,
        icon: 'award',
        color: 'green'
      });
    } else if (analytics.searchQuality > 50) {
      insights.push({
        insight: `Good query (${analytics.searchQuality.toFixed(0)}% quality). Try adding specific keywords`,
        icon: 'check',
        color: 'blue'
      });
    } else {
      insights.push({
        insight: `Query can be improved. Consider being more specific`,
        icon: 'info',
        color: 'orange'
      });
    }
    
    // Result diversity insight
    if (results.length > 0) {
      const diversity = this.calculateResultDiversity(results);
      if (diversity > 70) {
        insights.push({
          insight: `High diversity: ${diversity.toFixed(0)}% varied content sources`,
          icon: 'grid',
          color: 'purple'
        });
      }
    }
    
    // Topic trend insight
    analytics.topicCoverage.forEach(topic => {
      const trendScore = this.calculateTrendScore(topic);
      if (trendScore > 85) {
        insights.push({
          insight: `"${topic}" is trending (${trendScore}% popularity)`,
          icon: 'trending-up',
          color: 'red'
        });
      }
    });
    
    return insights.slice(0, 3);
  }

  // ============= PRIVATE HELPER METHODS =============

  private static calculateQueryComplexity(query: string): number {
    const words = query.split(/\s+/);
    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
    const uniqueRatio = new Set(words).size / words.length;
    const hasCodeSyntax = /[{}()\[\]<>;,.]/.test(query);
    const hasQuotes = /".*"/.test(query);
    
    let complexity = 0;
    complexity += Math.min(avgWordLength * 8, 30); // Max 30 points
    complexity += uniqueRatio * 30; // Max 30 points
    complexity += words.length * 2; // Max 20 points for 10 words
    complexity += hasCodeSyntax ? 10 : 0;
    complexity += hasQuotes ? 10 : 0;
    
    return Math.min(complexity, 100);
  }

  private static calculateSearchIntensity(words: string[]): number {
    const intensityKeywords = [
      'how', 'what', 'why', 'when', 'where', 'which',
      'best', 'guide', 'tutorial', 'learn', 'master',
      'advanced', 'beginner', 'example', 'code'
    ];
    
    const technicalTerms = [
      'algorithm', 'function', 'class', 'method', 'array',
      'api', 'database', 'server', 'client', 'framework'
    ];
    
    let intensity = 50; // Base intensity
    
    words.forEach(word => {
      const lower = word.toLowerCase();
      if (intensityKeywords.includes(lower)) intensity += 5;
      if (technicalTerms.includes(lower)) intensity += 8;
    });
    
    return Math.min(intensity, 100);
  }

  private static calculateSemanticDepth(query: string): number {
    const sentences = query.split(/[.!?]+/).filter(s => s.trim());
    const words = query.split(/\s+/);
    
    let depth = 0;
    
    // Sentence structure depth
    depth += Math.min(sentences.length * 15, 30);
    
    // Word count depth
    depth += Math.min(words.length * 3, 30);
    
    // Technical terminology
    const technicalPatterns = /\b(algorithm|optimization|implementation|architecture|paradigm|methodology)\b/gi;
    const matches = query.match(technicalPatterns);
    depth += matches ? Math.min(matches.length * 10, 40) : 0;
    
    return Math.min(depth, 100);
  }

  private static extractTopics(query: string): string[] {
    const topics: string[] = [];
    const topicPatterns = {
      'programming languages': /\b(python|javascript|java|c\+\+|rust|go|ruby|php|swift|kotlin)\b/gi,
      'web development': /\b(react|vue|angular|nextjs|html|css|frontend|backend)\b/gi,
      'data science': /\b(machine learning|deep learning|ai|neural network|data analysis)\b/gi,
      'databases': /\b(sql|nosql|mongodb|postgresql|mysql|redis)\b/gi,
      'devops': /\b(docker|kubernetes|cicd|aws|azure|cloud)\b/gi,
      'mobile': /\b(android|ios|react native|flutter|mobile app)\b/gi
    };
    
    for (const [category, pattern] of Object.entries(topicPatterns)) {
      if (pattern.test(query)) {
        topics.push(category);
      }
    }
    
    return topics.length > 0 ? topics : ['general programming'];
  }

  private static calculateConfidenceScore(query: string, wordCount: number): number {
    let confidence = 50; // Base confidence
    
    // Well-formed query
    if (wordCount >= 3 && wordCount <= 10) confidence += 20;
    
    // Contains question words
    if (/\b(how|what|why|when|where)\b/i.test(query)) confidence += 15;
    
    // Contains technical terms
    if (/\b(function|class|method|api|algorithm)\b/i.test(query)) confidence += 15;
    
    return Math.min(confidence, 100);
  }

  private static recommendFilters(query: string): string[] {
    const filters: string[] = [];
    const lower = query.toLowerCase();
    
    if (lower.includes('tutorial') || lower.includes('learn')) {
      filters.push('Tutorials', 'Beginner-Friendly');
    }
    
    if (lower.includes('advanced') || lower.includes('deep')) {
      filters.push('Advanced', 'Expert-Level');
    }
    
    if (lower.includes('code') || lower.includes('example')) {
      filters.push('Code Examples', 'Practical');
    }
    
    if (lower.includes('research') || lower.includes('paper')) {
      filters.push('Research Papers', 'Academic');
    }
    
    return filters.slice(0, 3);
  }

  private static detectQueryIntent(query: string): string {
    const lower = query.toLowerCase();
    
    if (/\b(learn|tutorial|guide|course|teach)\b/.test(lower)) {
      return 'learning';
    }
    
    if (/\b(how to|solve|fix|debug|error)\b/.test(lower)) {
      return 'problem-solving';
    }
    
    if (/\b(research|paper|study|analysis|theory)\b/.test(lower)) {
      return 'research';
    }
    
    if (/\b(best|top|compare|vs|versus)\b/.test(lower)) {
      return 'comparison';
    }
    
    if (/\b(code|example|snippet|implementation)\b/.test(lower)) {
      return 'code-reference';
    }
    
    return 'general-information';
  }

  private static calculateReadability(content: string): number {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim());
    const words = content.split(/\s+/);
    const avgSentenceLength = words.length / (sentences.length || 1);
    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
    
    // Flesch Reading Ease approximation
    const readability = 206.835 - 1.015 * avgSentenceLength - 84.6 * (avgWordLength / 5);
    
    return Math.max(0, Math.min(readability, 100));
  }

  private static assessTechnicalDepth(content: string): number {
    const technicalTerms = [
      'algorithm', 'complexity', 'optimization', 'implementation',
      'architecture', 'framework', 'library', 'api', 'protocol',
      'asynchronous', 'synchronous', 'concurrent', 'parallel'
    ];
    
    let depth = 0;
    const lower = content.toLowerCase();
    
    technicalTerms.forEach(term => {
      if (lower.includes(term)) depth += 5;
    });
    
    // Code blocks increase depth
    const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
    depth += codeBlocks.length * 10;
    
    return Math.min(depth, 100);
  }

  private static assessComprehensiveness(content: string): number {
    const words = content.split(/\s+/).length;
    const sections = content.split(/\n\n+/).length;
    const lists = (content.match(/^[-*]\s/gm) || []).length;
    const headings = (content.match(/^#+\s/gm) || []).length;
    
    let score = 0;
    score += Math.min(words / 50, 30); // Up to 30 points for word count
    score += Math.min(sections * 5, 25); // Up to 25 points for sections
    score += Math.min(lists * 2, 20); // Up to 20 points for lists
    score += Math.min(headings * 5, 25); // Up to 25 points for structure
    
    return Math.min(score, 100);
  }

  private static assessCodeQuality(content: string): number {
    const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
    if (codeBlocks.length === 0) return 0;
    
    let quality = 0;
    
    codeBlocks.forEach(block => {
      // Has language specification
      if (/```\w+/.test(block)) quality += 10;
      
      // Has comments
      if (/\/\/|\/\*|\*\/|#/.test(block)) quality += 10;
      
      // Proper indentation
      if (/\n\s{2,}/.test(block)) quality += 10;
      
      // Has function definitions
      if (/function|def|const|let|var|class/.test(block)) quality += 10;
    });
    
    return Math.min(quality / codeBlocks.length, 100);
  }

  private static countVisualElements(content: string): number {
    let count = 0;
    
    // Images
    count += (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
    
    // Tables
    count += (content.match(/\|.*\|/g) || []).length / 3;
    
    // Diagrams/Charts indicators
    count += (content.match(/\b(diagram|chart|graph|visualization)\b/gi) || []).length;
    
    return Math.min(count * 10, 100);
  }

  private static assessInteractivity(content: string): number {
    let score = 0;
    const lower = content.toLowerCase();
    
    // Interactive elements
    if (lower.includes('try it') || lower.includes('example')) score += 20;
    if (lower.includes('exercise') || lower.includes('practice')) score += 20;
    if (lower.includes('demo') || lower.includes('playground')) score += 20;
    if (lower.includes('quiz') || lower.includes('test')) score += 20;
    if (lower.includes('challenge') || lower.includes('project')) score += 20;
    
    return Math.min(score, 100);
  }

  private static calculateResultDiversity(results: any[]): number {
    if (results.length === 0) return 0;
    
    const sources = new Set(results.map(r => r.source || 'unknown'));
    const types = new Set(results.map(r => r.type || 'unknown'));
    
    const sourceDiversity = (sources.size / Math.max(results.length * 0.3, 1)) * 100;
    const typeDiversity = (types.size / Math.max(results.length * 0.3, 1)) * 100;
    
    return Math.min((sourceDiversity + typeDiversity) / 2, 100);
  }
}

/**
 * Performance Monitoring & Optimization
 */
export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map();

  static recordSearchTime(query: string, timeMs: number): void {
    if (!this.metrics.has(query)) {
      this.metrics.set(query, []);
    }
    this.metrics.get(query)!.push(timeMs);
  }

  static getAverageSearchTime(query: string): number {
    const times = this.metrics.get(query);
    if (!times || times.length === 0) return 0;
    
    return times.reduce((a, b) => a + b, 0) / times.length;
  }

  static getPerformanceReport(): {
    totalSearches: number;
    avgTime: number;
    fastestTime: number;
    slowestTime: number;
  } {
    let totalSearches = 0;
    let totalTime = 0;
    let fastest = Infinity;
    let slowest = 0;

    this.metrics.forEach(times => {
      totalSearches += times.length;
      times.forEach(time => {
        totalTime += time;
        fastest = Math.min(fastest, time);
        slowest = Math.max(slowest, time);
      });
    });

    return {
      totalSearches,
      avgTime: totalTime / totalSearches || 0,
      fastestTime: fastest === Infinity ? 0 : fastest,
      slowestTime: slowest
    };
  }
}

/**
 * Smart Caching System
 */
export class SmartCache {
  private static cache: Map<string, { data: any; timestamp: number; hits: number }> = new Map();
  private static readonly MAX_CACHE_SIZE = 100;
  private static readonly CACHE_TTL = 15 * 60 * 1000; // 15 minutes

  static get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > this.CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }

    entry.hits++;
    return entry.data;
  }

  static set(key: string, data: any): void {
    // Evict least recently used if cache is full
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const lruKey = this.findLRUKey();
      if (lruKey) this.cache.delete(lruKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hits: 0
    });
  }

  private static findLRUKey(): string | null {
    let lruKey: string | null = null;
    let lruTimestamp = Infinity;

    this.cache.forEach((value, key) => {
      if (value.timestamp < lruTimestamp) {
        lruTimestamp = value.timestamp;
        lruKey = key;
      }
    });

    return lruKey;
  }

  static getCacheStats(): {
    size: number;
    hitRate: number;
    mostPopular: string | null;
  } {
    let totalHits = 0;
    let maxHits = 0;
    let mostPopular: string | null = null;

    this.cache.forEach((value, key) => {
      totalHits += value.hits;
      if (value.hits > maxHits) {
        maxHits = value.hits;
        mostPopular = key;
      }
    });

    return {
      size: this.cache.size,
      hitRate: totalHits / this.cache.size || 0,
      mostPopular
    };
  }
}
