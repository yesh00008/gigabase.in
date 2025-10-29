// Real-time Collaboration & Social Learning Features

export interface CollaborativeNote {
  id: string;
  author: string;
  content: string;
  timestamp: number;
  tags: string[];
  likes: number;
  replies: CollaborativeNote[];
}

export interface StudyGroup {
  id: string;
  name: string;
  topic: string;
  members: string[];
  resources: string[];
  goals: string[];
  progress: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export class CollaborativeFeatures {
  private static notes: Map<string, CollaborativeNote[]> = new Map();
  private static studyGroups: Map<string, StudyGroup> = new Map();
  private static achievements: Map<string, Achievement[]> = new Map();

  /**
   * Add collaborative note to content
   */
  static addNote(contentId: string, note: Omit<CollaborativeNote, 'id' | 'timestamp' | 'likes' | 'replies'>): CollaborativeNote {
    const newNote: CollaborativeNote = {
      ...note,
      id: this.generateId(),
      timestamp: Date.now(),
      likes: 0,
      replies: []
    };

    if (!this.notes.has(contentId)) {
      this.notes.set(contentId, []);
    }

    this.notes.get(contentId)!.push(newNote);
    return newNote;
  }

  /**
   * Get all notes for content
   */
  static getNotes(contentId: string): CollaborativeNote[] {
    return this.notes.get(contentId) || [];
  }

  /**
   * Create study group
   */
  static createStudyGroup(group: Omit<StudyGroup, 'id' | 'progress'>): StudyGroup {
    const newGroup: StudyGroup = {
      ...group,
      id: this.generateId(),
      progress: 0
    };

    this.studyGroups.set(newGroup.id, newGroup);
    return newGroup;
  }

  /**
   * Find study groups by topic
   */
  static findStudyGroups(topic: string): StudyGroup[] {
    const groups: StudyGroup[] = [];
    
    this.studyGroups.forEach(group => {
      if (group.topic.toLowerCase().includes(topic.toLowerCase())) {
        groups.push(group);
      }
    });

    return groups;
  }

  /**
   * Award achievement
   */
  static awardAchievement(userId: string, achievement: Omit<Achievement, 'id' | 'earnedDate'>): Achievement {
    const newAchievement: Achievement = {
      ...achievement,
      id: this.generateId(),
      earnedDate: Date.now()
    };

    if (!this.achievements.has(userId)) {
      this.achievements.set(userId, []);
    }

    this.achievements.get(userId)!.push(newAchievement);
    return newAchievement;
  }

  /**
   * Get user achievements
   */
  static getUserAchievements(userId: string): Achievement[] {
    return this.achievements.get(userId) || [];
  }

  /**
   * Get achievement suggestions based on activity
   */
  static suggestAchievements(searchCount: number, topicsExplored: number): Achievement[] {
    const suggestions: Achievement[] = [];

    if (searchCount >= 10 && searchCount < 50) {
      suggestions.push({
        id: 'explorer_10',
        title: 'Knowledge Explorer',
        description: 'Performed 10 searches',
        icon: '🔍',
        earnedDate: 0,
        rarity: 'common'
      });
    }

    if (searchCount >= 50) {
      suggestions.push({
        id: 'seeker_50',
        title: 'Knowledge Seeker',
        description: 'Performed 50 searches',
        icon: '🎯',
        earnedDate: 0,
        rarity: 'rare'
      });
    }

    if (topicsExplored >= 5) {
      suggestions.push({
        id: 'polymath',
        title: 'Polymath',
        description: 'Explored 5+ different topics',
        icon: '🌟',
        earnedDate: 0,
        rarity: 'epic'
      });
    }

    return suggestions;
  }

  private static generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Gamification System
 */
export class GamificationEngine {
  private static userPoints: Map<string, number> = new Map();
  private static userLevel: Map<string, number> = new Map();
  private static streaks: Map<string, { current: number; longest: number; lastActivity: number }> = new Map();

  /**
   * Award points for actions
   */
  static awardPoints(userId: string, points: number, action: string): {
    points: number;
    totalPoints: number;
    levelUp: boolean;
    newLevel?: number;
  } {
    const currentPoints = this.userPoints.get(userId) || 0;
    const newTotal = currentPoints + points;
    this.userPoints.set(userId, newTotal);

    // Check for level up
    const currentLevel = this.userLevel.get(userId) || 1;
    const newLevel = this.calculateLevel(newTotal);
    const levelUp = newLevel > currentLevel;

    if (levelUp) {
      this.userLevel.set(userId, newLevel);
    }

    return {
      points,
      totalPoints: newTotal,
      levelUp,
      newLevel: levelUp ? newLevel : undefined
    };
  }

  /**
   * Update streak
   */
  static updateStreak(userId: string): {
    current: number;
    longest: number;
    milestone: boolean;
  } {
    const now = Date.now();
    const streak = this.streaks.get(userId) || {
      current: 0,
      longest: 0,
      lastActivity: 0
    };

    const daysSinceLastActivity = (now - streak.lastActivity) / (1000 * 60 * 60 * 24);

    if (daysSinceLastActivity <= 1.5) {
      // Continue streak
      streak.current++;
    } else if (daysSinceLastActivity > 1.5) {
      // Reset streak
      streak.current = 1;
    }

    streak.longest = Math.max(streak.longest, streak.current);
    streak.lastActivity = now;

    this.streaks.set(userId, streak);

    const milestone = streak.current % 7 === 0; // Milestone every week

    return {
      current: streak.current,
      longest: streak.longest,
      milestone
    };
  }

  /**
   * Get leaderboard
   */
  static getLeaderboard(limit: number = 10): {
    rank: number;
    userId: string;
    points: number;
    level: number;
  }[] {
    const leaderboard: { rank: number; userId: string; points: number; level: number }[] = [];

    const sortedUsers = Array.from(this.userPoints.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);

    sortedUsers.forEach(([userId, points], index) => {
      leaderboard.push({
        rank: index + 1,
        userId,
        points,
        level: this.userLevel.get(userId) || 1
      });
    });

    return leaderboard;
  }

  /**
   * Get user stats
   */
  static getUserStats(userId: string): {
    points: number;
    level: number;
    rank: number;
    streak: { current: number; longest: number };
    pointsToNextLevel: number;
  } {
    const points = this.userPoints.get(userId) || 0;
    const level = this.userLevel.get(userId) || 1;
    const streak = this.streaks.get(userId) || { current: 0, longest: 0, lastActivity: 0 };

    // Calculate rank
    const allUsers = Array.from(this.userPoints.entries())
      .sort((a, b) => b[1] - a[1]);
    const rank = allUsers.findIndex(([id]) => id === userId) + 1;

    // Points to next level
    const nextLevelPoints = this.pointsForLevel(level + 1);
    const pointsToNextLevel = nextLevelPoints - points;

    return {
      points,
      level,
      rank,
      streak: { current: streak.current, longest: streak.longest },
      pointsToNextLevel
    };
  }

  private static calculateLevel(points: number): number {
    // Level formula: level = floor(sqrt(points / 100))
    return Math.floor(Math.sqrt(points / 100)) + 1;
  }

  private static pointsForLevel(level: number): number {
    // Inverse of level formula
    return Math.pow(level - 1, 2) * 100;
  }
}

/**
 * Social Learning Features
 */
export class SocialLearning {
  private static questions: Map<string, {
    id: string;
    author: string;
    question: string;
    answers: { author: string; content: string; votes: number }[];
    tags: string[];
    timestamp: number;
  }[]> = new Map();

  /**
   * Ask a question about content
   */
  static askQuestion(
    contentId: string,
    author: string,
    question: string,
    tags: string[]
  ): string {
    const questionId = `q_${Date.now()}`;

    if (!this.questions.has(contentId)) {
      this.questions.set(contentId, []);
    }

    this.questions.get(contentId)!.push({
      id: questionId,
      author,
      question,
      answers: [],
      tags,
      timestamp: Date.now()
    });

    return questionId;
  }

  /**
   * Answer a question
   */
  static answerQuestion(
    contentId: string,
    questionId: string,
    author: string,
    content: string
  ): boolean {
    const questions = this.questions.get(contentId);
    if (!questions) return false;

    const question = questions.find(q => q.id === questionId);
    if (!question) return false;

    question.answers.push({
      author,
      content,
      votes: 0
    });

    return true;
  }

  /**
   * Get questions for content
   */
  static getQuestions(contentId: string): any[] {
    return this.questions.get(contentId) || [];
  }

  /**
   * Generate discussion prompts
   */
  static generateDiscussionPrompts(topic: string): string[] {
    const prompts = [
      `What are the best practices for ${topic}?`,
      `How do you approach ${topic} in production environments?`,
      `What are common pitfalls when learning ${topic}?`,
      `Can you share your experience with ${topic}?`,
      `What resources helped you master ${topic}?`
    ];

    return prompts;
  }

  /**
   * Find study buddies based on interests
   */
  static findStudyBuddies(interests: string[], skillLevel: string): {
    name: string;
    commonInterests: string[];
    skillLevel: string;
    match: number;
  }[] {
    // Simulated study buddy matching
    const buddies = [
      {
        name: 'Alex Chen',
        commonInterests: interests.slice(0, 2),
        skillLevel,
        match: 85
      },
      {
        name: 'Sarah Johnson',
        commonInterests: interests.slice(1, 3),
        skillLevel,
        match: 78
      },
      {
        name: 'David Martinez',
        commonInterests: [interests[0]],
        skillLevel,
        match: 72
      }
    ];

    return buddies.sort((a, b) => b.match - a.match);
  }
}

/**
 * Live Collaboration Tools
 */
export class LiveCollaboration {
  private static activeSessions: Map<string, {
    id: string;
    topic: string;
    participants: string[];
    startTime: number;
    sharedNotes: string[];
  }> = new Map();

  /**
   * Create collaboration session
   */
  static createSession(topic: string, creator: string): string {
    const sessionId = `session_${Date.now()}`;

    this.activeSessions.set(sessionId, {
      id: sessionId,
      topic,
      participants: [creator],
      startTime: Date.now(),
      sharedNotes: []
    });

    return sessionId;
  }

  /**
   * Join session
   */
  static joinSession(sessionId: string, userId: string): boolean {
    const session = this.activeSessions.get(sessionId);
    if (!session) return false;

    if (!session.participants.includes(userId)) {
      session.participants.push(userId);
    }

    return true;
  }

  /**
   * Add shared note
   */
  static addSharedNote(sessionId: string, note: string): boolean {
    const session = this.activeSessions.get(sessionId);
    if (!session) return false;

    session.sharedNotes.push(note);
    return true;
  }

  /**
   * Get active sessions by topic
   */
  static getActiveSessions(topic?: string): any[] {
    const sessions: any[] = [];

    this.activeSessions.forEach(session => {
      if (!topic || session.topic.toLowerCase().includes(topic.toLowerCase())) {
        sessions.push({
          id: session.id,
          topic: session.topic,
          participants: session.participants.length,
          duration: Math.floor((Date.now() - session.startTime) / 1000 / 60) // minutes
        });
      }
    });

    return sessions;
  }
}

/**
 * Progress Tracking & Analytics
 */
export class ProgressTracker {
  private static progress: Map<string, {
    topicsLearned: Set<string>;
    articlesRead: number;
    videosWatched: number;
    codeSnippetsUsed: number;
    projectsCompleted: number;
    quizzesAttempted: number;
    weeklyGoals: { goal: string; completed: boolean }[];
  }> = new Map();

  /**
   * Update user progress
   */
  static updateProgress(
    userId: string,
    metric: 'articlesRead' | 'videosWatched' | 'codeSnippetsUsed' | 'projectsCompleted' | 'quizzesAttempted',
    topic?: string
  ): void {
    if (!this.progress.has(userId)) {
      this.progress.set(userId, {
        topicsLearned: new Set(),
        articlesRead: 0,
        videosWatched: 0,
        codeSnippetsUsed: 0,
        projectsCompleted: 0,
        quizzesAttempted: 0,
        weeklyGoals: []
      });
    }

    const userProgress = this.progress.get(userId)!;
    userProgress[metric]++;

    if (topic) {
      userProgress.topicsLearned.add(topic);
    }
  }

  /**
   * Get user progress summary
   */
  static getProgressSummary(userId: string): {
    topicsLearned: number;
    totalActivities: number;
    weeklyProgress: number;
    achievementRate: number;
  } {
    const userProgress = this.progress.get(userId);
    if (!userProgress) {
      return {
        topicsLearned: 0,
        totalActivities: 0,
        weeklyProgress: 0,
        achievementRate: 0
      };
    }

    const totalActivities =
      userProgress.articlesRead +
      userProgress.videosWatched +
      userProgress.codeSnippetsUsed +
      userProgress.projectsCompleted +
      userProgress.quizzesAttempted;

    const completedGoals = userProgress.weeklyGoals.filter(g => g.completed).length;
    const achievementRate = userProgress.weeklyGoals.length > 0
      ? (completedGoals / userProgress.weeklyGoals.length) * 100
      : 0;

    return {
      topicsLearned: userProgress.topicsLearned.size,
      totalActivities,
      weeklyProgress: Math.min((totalActivities / 20) * 100, 100), // Goal: 20 activities per week
      achievementRate
    };
  }

  /**
   * Set weekly goals
   */
  static setWeeklyGoals(userId: string, goals: string[]): void {
    if (!this.progress.has(userId)) {
      this.progress.set(userId, {
        topicsLearned: new Set(),
        articlesRead: 0,
        videosWatched: 0,
        codeSnippetsUsed: 0,
        projectsCompleted: 0,
        quizzesAttempted: 0,
        weeklyGoals: []
      });
    }

    const userProgress = this.progress.get(userId)!;
    userProgress.weeklyGoals = goals.map(goal => ({
      goal,
      completed: false
    }));
  }

  /**
   * Complete weekly goal
   */
  static completeGoal(userId: string, goalIndex: number): boolean {
    const userProgress = this.progress.get(userId);
    if (!userProgress || !userProgress.weeklyGoals[goalIndex]) return false;

    userProgress.weeklyGoals[goalIndex].completed = true;
    return true;
  }
}
