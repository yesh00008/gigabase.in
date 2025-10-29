// AI-Powered Personalization Engine

export interface UserProfile {
  interests: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  preferredSources: string[];
  searchHistory: string[];
  learningPath: string[];
  favoriteTopics: Map<string, number>;
}

export interface PersonalizedRecommendation {
  title: string;
  reason: string;
  confidence: number;
  type: 'article' | 'video' | 'course' | 'project' | 'book';
  difficulty: string;
  estimatedTime: string;
}

export class AIPersonalizationEngine {
  private static userProfile: UserProfile = {
    interests: [],
    skillLevel: 'intermediate',
    preferredSources: [],
    searchHistory: [],
    learningPath: [],
    favoriteTopics: new Map()
  };

  /**
   * Learn from user behavior
   */
  static updateProfile(query: string, clickedResults: string[]): void {
    // Update search history
    this.userProfile.searchHistory.push(query);
    if (this.userProfile.searchHistory.length > 50) {
      this.userProfile.searchHistory.shift();
    }

    // Extract interests from query
    const topics = this.extractTopics(query);
    topics.forEach(topic => {
      if (!this.userProfile.interests.includes(topic)) {
        this.userProfile.interests.push(topic);
      }
      
      const count = this.userProfile.favoriteTopics.get(topic) || 0;
      this.userProfile.favoriteTopics.set(topic, count + 1);
    });

    // Update preferred sources from clicked results
    clickedResults.forEach(source => {
      const count = this.userProfile.preferredSources.filter(s => s === source).length;
      if (count < 5) {
        this.userProfile.preferredSources.push(source);
      }
    });

    // Infer skill level
    this.inferSkillLevel();
  }

  /**
   * Generate personalized recommendations
   */
  static generatePersonalizedRecommendations(query: string): PersonalizedRecommendation[] {
    const recommendations: PersonalizedRecommendation[] = [];
    const topics = this.extractTopics(query);
    const userInterests = Array.from(this.userProfile.favoriteTopics.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic);

    // Recommendation 1: Based on search history patterns
    const relatedQueries = this.findRelatedQueries(query);
    if (relatedQueries.length > 0) {
      recommendations.push({
        title: `Explore: ${relatedQueries[0]}`,
        reason: 'Based on your search history',
        confidence: 85,
        type: 'article',
        difficulty: this.userProfile.skillLevel,
        estimatedTime: '10-15 min'
      });
    }

    // Recommendation 2: Skill progression
    const nextLevelContent = this.getNextLevelContent(query);
    if (nextLevelContent) {
      recommendations.push({
        title: nextLevelContent.title,
        reason: `Perfect for ${this.userProfile.skillLevel} developers`,
        confidence: 90,
        type: nextLevelContent.type,
        difficulty: this.getNextDifficulty(),
        estimatedTime: nextLevelContent.time
      });
    }

    // Recommendation 3: Complementary topics
    topics.forEach(topic => {
      const complementary = this.getComplementaryTopics(topic);
      complementary.forEach(comp => {
        recommendations.push({
          title: `Learn ${comp}`,
          reason: `Complements your interest in ${topic}`,
          confidence: 75,
          type: 'course',
          difficulty: this.userProfile.skillLevel,
          estimatedTime: '2-4 hours'
        });
      });
    });

    // Recommendation 4: Trending in your interests
    userInterests.forEach(interest => {
      const trending = this.getTrendingInTopic(interest);
      if (trending) {
        recommendations.push({
          title: trending,
          reason: `Trending in ${interest}`,
          confidence: 80,
          type: 'article',
          difficulty: this.userProfile.skillLevel,
          estimatedTime: '5-10 min'
        });
      }
    });

    // Recommendation 5: Project-based learning
    if (this.userProfile.skillLevel !== 'beginner') {
      recommendations.push({
        title: `Build a ${query} project`,
        reason: 'Hands-on practice reinforces learning',
        confidence: 88,
        type: 'project',
        difficulty: this.userProfile.skillLevel,
        estimatedTime: '4-8 hours'
      });
    }

    return recommendations.slice(0, 5);
  }

  /**
   * Personalize search results ranking
   */
  static personalizeRanking(results: any[], query: string): any[] {
    const scoredResults = results.map(result => {
      let personalScore = 0;

      // Boost based on user interests
      this.userProfile.interests.forEach(interest => {
        if (result.title?.toLowerCase().includes(interest.toLowerCase()) ||
            result.content?.toLowerCase().includes(interest.toLowerCase())) {
          personalScore += 15;
        }
      });

      // Boost based on skill level
      const contentLevel = this.inferContentLevel(result.content || result.title);
      if (contentLevel === this.userProfile.skillLevel) {
        personalScore += 20;
      }

      // Boost based on preferred sources
      if (this.userProfile.preferredSources.includes(result.source)) {
        personalScore += 10;
      }

      // Boost based on favorite topics
      this.userProfile.favoriteTopics.forEach((count, topic) => {
        if (result.title?.toLowerCase().includes(topic.toLowerCase())) {
          personalScore += count * 2;
        }
      });

      return {
        ...result,
        personalScore,
        totalScore: (result.relevanceScore || 0) + personalScore
      };
    });

    return scoredResults.sort((a, b) => b.totalScore - a.totalScore);
  }

  /**
   * Adaptive learning path generation
   */
  static generateLearningPath(goal: string): {
    phase: string;
    topics: string[];
    duration: string;
    prerequisites: string[];
  }[] {
    const currentLevel = this.userProfile.skillLevel;
    const path: {
      phase: string;
      topics: string[];
      duration: string;
      prerequisites: string[];
    }[] = [];

    // Phase 1: Foundation
    if (currentLevel === 'beginner') {
      path.push({
        phase: 'Foundation',
        topics: this.getFoundationTopics(goal),
        duration: '2-4 weeks',
        prerequisites: []
      });
    }

    // Phase 2: Core Concepts
    path.push({
      phase: 'Core Concepts',
      topics: this.getCoreTopics(goal),
      duration: '4-8 weeks',
      prerequisites: currentLevel === 'beginner' ? ['Foundation'] : []
    });

    // Phase 3: Advanced Topics
    if (currentLevel !== 'beginner') {
      path.push({
        phase: 'Advanced Topics',
        topics: this.getAdvancedTopics(goal),
        duration: '8-12 weeks',
        prerequisites: ['Core Concepts']
      });
    }

    // Phase 4: Specialization
    if (currentLevel === 'advanced' || currentLevel === 'expert') {
      path.push({
        phase: 'Specialization',
        topics: this.getSpecializationTopics(goal),
        duration: '12+ weeks',
        prerequisites: ['Advanced Topics']
      });
    }

    return path;
  }

  /**
   * Smart content filtering
   */
  static filterByPreferences(results: any[]): any[] {
    return results.filter(result => {
      const contentLevel = this.inferContentLevel(result.content || result.title);
      
      // Filter out content that's too advanced or too basic
      if (this.userProfile.skillLevel === 'beginner' && contentLevel === 'expert') {
        return false;
      }
      
      if (this.userProfile.skillLevel === 'expert' && contentLevel === 'beginner') {
        return false;
      }

      // Keep content that matches user interests
      const matchesInterests = this.userProfile.interests.some(interest =>
        result.title?.toLowerCase().includes(interest.toLowerCase()) ||
        result.content?.toLowerCase().includes(interest.toLowerCase())
      );

      return matchesInterests || this.userProfile.interests.length === 0;
    });
  }

  /**
   * Get user insights
   */
  static getUserInsights(): {
    topInterests: string[];
    learningVelocity: number;
    expertiseAreas: string[];
    recommendedNextSteps: string[];
    strengthAreas: string[];
    growthAreas: string[];
  } {
    const topInterests = Array.from(this.userProfile.favoriteTopics.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic);

    const learningVelocity = this.calculateLearningVelocity();
    const expertiseAreas = this.identifyExpertiseAreas();
    const recommendedNextSteps = this.getNextSteps();
    const strengthAreas = this.identifyStrengths();
    const growthAreas = this.identifyGrowthAreas();

    return {
      topInterests,
      learningVelocity,
      expertiseAreas,
      recommendedNextSteps,
      strengthAreas,
      growthAreas
    };
  }

  // ============= PRIVATE HELPER METHODS =============

  private static extractTopics(query: string): string[] {
    const topics: string[] = [];
    const keywords = query.toLowerCase().split(/\s+/);

    const topicMap: { [key: string]: string[] } = {
      'python': ['python', 'django', 'flask', 'pandas', 'numpy'],
      'javascript': ['javascript', 'js', 'node', 'react', 'vue', 'angular'],
      'web': ['html', 'css', 'frontend', 'backend', 'fullstack'],
      'data': ['data', 'ml', 'ai', 'machine learning', 'deep learning'],
      'mobile': ['android', 'ios', 'mobile', 'flutter', 'react native'],
      'devops': ['docker', 'kubernetes', 'ci/cd', 'aws', 'azure', 'cloud']
    };

    keywords.forEach(keyword => {
      for (const [category, terms] of Object.entries(topicMap)) {
        if (terms.some(term => keyword.includes(term))) {
          if (!topics.includes(category)) {
            topics.push(category);
          }
        }
      }
    });

    return topics;
  }

  private static inferSkillLevel(): void {
    const recentQueries = this.userProfile.searchHistory.slice(-10);
    let complexitySum = 0;

    recentQueries.forEach(query => {
      const words = query.split(/\s+/);
      const hasAdvancedTerms = /advanced|expert|architecture|optimization|scalability/.test(query.toLowerCase());
      const hasBeginnerTerms = /beginner|tutorial|introduction|basics|learn/.test(query.toLowerCase());

      if (hasAdvancedTerms) complexitySum += 3;
      else if (hasBeginnerTerms) complexitySum += 0.5;
      else complexitySum += 1.5;

      if (words.length > 5) complexitySum += 0.5;
    });

    const avgComplexity = complexitySum / recentQueries.length;

    if (avgComplexity < 1) this.userProfile.skillLevel = 'beginner';
    else if (avgComplexity < 2) this.userProfile.skillLevel = 'intermediate';
    else if (avgComplexity < 2.5) this.userProfile.skillLevel = 'advanced';
    else this.userProfile.skillLevel = 'expert';
  }

  private static findRelatedQueries(query: string): string[] {
    const related: string[] = [];
    const queryTerms = new Set(query.toLowerCase().split(/\s+/));

    this.userProfile.searchHistory.forEach(historyQuery => {
      if (historyQuery === query) return;

      const historyTerms = new Set(historyQuery.toLowerCase().split(/\s+/));
      const intersection = new Set([...queryTerms].filter(x => historyTerms.has(x)));

      if (intersection.size >= 2) {
        related.push(historyQuery);
      }
    });

    return related.slice(0, 3);
  }

  private static getNextLevelContent(query: string): { title: string; type: any; time: string } | null {
    const levelMap = {
      'beginner': { title: `Intermediate ${query} Concepts`, type: 'course' as const, time: '3-5 hours' },
      'intermediate': { title: `Advanced ${query} Techniques`, type: 'course' as const, time: '5-8 hours' },
      'advanced': { title: `Expert ${query} Mastery`, type: 'course' as const, time: '8-12 hours' },
      'expert': { title: `Cutting-edge ${query} Research`, type: 'article' as const, time: '2-4 hours' }
    };

    return levelMap[this.userProfile.skillLevel] || null;
  }

  private static getNextDifficulty(): string {
    const progression = {
      'beginner': 'intermediate',
      'intermediate': 'advanced',
      'advanced': 'expert',
      'expert': 'research-level'
    };

    return progression[this.userProfile.skillLevel] || 'intermediate';
  }

  private static getComplementaryTopics(topic: string): string[] {
    const complementaryMap: { [key: string]: string[] } = {
      'python': ['flask', 'django', 'data analysis'],
      'javascript': ['typescript', 'react', 'node.js'],
      'web': ['accessibility', 'performance', 'SEO'],
      'data': ['statistics', 'visualization', 'big data'],
      'mobile': ['UX design', 'app architecture', 'testing'],
      'devops': ['monitoring', 'security', 'automation']
    };

    return complementaryMap[topic] || [];
  }

  private static getTrendingInTopic(topic: string): string | null {
    const trending: { [key: string]: string } = {
      'python': 'Python 3.12 New Features',
      'javascript': 'React 19 and Server Components',
      'web': 'Web Components and Shadow DOM',
      'data': 'Large Language Models (LLMs)',
      'mobile': 'Flutter 3.0 Cross-platform Development',
      'devops': 'GitOps and Infrastructure as Code'
    };

    return trending[topic] || null;
  }

  private static inferContentLevel(text: string): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    const lower = text.toLowerCase();

    const expertTerms = ['architecture', 'optimization', 'scalability', 'distributed', 'microservices'];
    const advancedTerms = ['design pattern', 'performance', 'asynchronous', 'concurrency'];
    const beginnerTerms = ['introduction', 'basics', 'getting started', 'tutorial'];

    if (expertTerms.some(term => lower.includes(term))) return 'expert';
    if (advancedTerms.some(term => lower.includes(term))) return 'advanced';
    if (beginnerTerms.some(term => lower.includes(term))) return 'beginner';

    return 'intermediate';
  }

  private static getFoundationTopics(goal: string): string[] {
    return [
      `Introduction to ${goal}`,
      'Basic Syntax and Structure',
      'Core Concepts',
      'Common Patterns'
    ];
  }

  private static getCoreTopics(goal: string): string[] {
    return [
      `${goal} Best Practices`,
      'Design Patterns',
      'Testing and Debugging',
      'Performance Optimization'
    ];
  }

  private static getAdvancedTopics(goal: string): string[] {
    return [
      `${goal} Architecture`,
      'Scalability Strategies',
      'Advanced Techniques',
      'Real-world Applications'
    ];
  }

  private static getSpecializationTopics(goal: string): string[] {
    return [
      `${goal} Research Areas`,
      'Cutting-edge Developments',
      'Industry Applications',
      'Open Source Contributions'
    ];
  }

  private static calculateLearningVelocity(): number {
    if (this.userProfile.searchHistory.length < 5) return 50;

    const recentDays = 7;
    const recentSearches = this.userProfile.searchHistory.slice(-20);
    const uniqueTopics = new Set(recentSearches.flatMap(q => this.extractTopics(q)));

    const velocity = (uniqueTopics.size / recentDays) * 10;
    return Math.min(velocity * 10, 100);
  }

  private static identifyExpertiseAreas(): string[] {
    return Array.from(this.userProfile.favoriteTopics.entries())
      .filter(([_, count]) => count >= 5)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([topic]) => topic);
  }

  private static getNextSteps(): string[] {
    const steps: string[] = [];
    const topInterests = Array.from(this.userProfile.favoriteTopics.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([topic]) => topic);

    topInterests.forEach(interest => {
      steps.push(`Master advanced ${interest} concepts`);
      steps.push(`Build a real-world ${interest} project`);
    });

    return steps.slice(0, 4);
  }

  private static identifyStrengths(): string[] {
    return Array.from(this.userProfile.favoriteTopics.entries())
      .filter(([_, count]) => count >= 3)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic);
  }

  private static identifyGrowthAreas(): string[] {
    const allTopics = ['python', 'javascript', 'web', 'data', 'mobile', 'devops'];
    const currentInterests = this.userProfile.interests;

    return allTopics.filter(topic => !currentInterests.includes(topic)).slice(0, 3);
  }
}
