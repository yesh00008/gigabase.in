// Additional Content Sources - Community, Tutorials, Challenges, Courses

import { MatchedContent, ContentSection } from './advancedContentMatcher';

/**
 * Fetch articles from Dev.to API
 * Public articles, no auth required
 */
export async function searchDevTo(query: string): Promise<MatchedContent[]> {
  try {
    const response = await fetch(
      `https://dev.to/api/articles?tag=${encodeURIComponent(query)}&per_page=10`
    );
    
    if (!response.ok) return [];
    
    const articles = await response.json();
    
    return articles.map((article: any) => {
      const sections: ContentSection[] = [];
      
      // Add article description as a section
      if (article.description) {
        sections.push({
          heading: 'Overview',
          content: article.description,
          type: 'text'
        });
      }
      
      // Add tags as a section
      if (article.tag_list && article.tag_list.length > 0) {
        sections.push({
          heading: 'Tags',
          content: article.tag_list.join(', '),
          type: 'list'
        });
      }

      return {
        title: article.title,
        content: article.description || 'Click to read the full article',
        source: 'Gigabase Community',
        url: article.url,
        code: [],
        sections,
        topics: article.tag_list || [],
        relevanceScore: article.positive_reactions_count || 0,
        metadata: {
          author: article.user?.name || 'Gigabase Community',
          lastUpdated: new Date(article.published_at).toLocaleDateString(),
          difficulty: article.reading_time_minutes > 10 ? 'intermediate' : 'beginner',
          readTime: `${article.reading_time_minutes || 5} min read`
        }
      };
    });
  } catch (error) {
    console.warn('Dev.to search failed:', error);
    return [];
  }
}

/**
 * Search Stack Overflow for questions and answers
 */
export async function searchStackOverflow(query: string): Promise<MatchedContent[]> {
  try {
    const response = await fetch(
      `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${encodeURIComponent(query)}&site=stackoverflow&filter=withbody`
    );
    
    if (!response.ok) return [];
    
    const data = await response.json();
    const questions = data.items || [];
    
    return questions.slice(0, 5).map((question: any) => {
      const sections: ContentSection[] = [];
      
      // Question body
      sections.push({
        heading: 'Question',
        content: stripHtml(question.body || '').slice(0, 500),
        type: 'text'
      });
      
      // Tags
      if (question.tags && question.tags.length > 0) {
        sections.push({
          heading: 'Technologies',
          content: question.tags.join(', '),
          type: 'list'
        });
      }
      
      // Answer count
      sections.push({
        heading: 'Community Response',
        content: `${question.answer_count || 0} answers • ${question.view_count || 0} views • Score: ${question.score || 0}`,
        type: 'note'
      });

      return {
        title: question.title,
        content: stripHtml(question.body || '').slice(0, 300) + '...',
        source: 'Gigabase Community',
        url: question.link,
        code: extractCodeFromStackOverflow(question.body || ''),
        sections,
        topics: question.tags || [],
        relevanceScore: question.score || 0,
        metadata: {
          author: question.owner?.display_name || 'Gigabase Community',
          lastUpdated: new Date(question.creation_date * 1000).toLocaleDateString(),
          difficulty: question.answer_count > 5 ? 'intermediate' : 'beginner',
          readTime: `${Math.ceil((question.body?.length || 0) / 1000)} min read`
        }
      };
    });
  } catch (error) {
    console.warn('Stack Overflow search failed:', error);
    return [];
  }
}

/**
 * Search FreeCodeCamp news articles
 */
export async function searchFreeCodeCamp(query: string): Promise<MatchedContent[]> {
  try {
    // Using RSS feed proxy or search
    const response = await fetch(
      `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) return [];
    
    const html = await response.text();
    const articles = parseFreeCodeCampHTML(html, query);
    
    return articles;
  } catch (error) {
    console.warn('FreeCodeCamp search failed:', error);
    return [];
  }
}

/**
 * Search MDN Web Docs
 */
export async function searchMDN(query: string): Promise<MatchedContent[]> {
  try {
    // Use CORS proxy for MDN API
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
      `https://developer.mozilla.org/api/v1/search?q=${encodeURIComponent(query)}&locale=en-US`
    )}`;
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) return [];
    
    const data = await response.json();
    const documents = data.documents || [];
    
    return documents.slice(0, 8).map((doc: any) => {
      const sections: ContentSection[] = [];
      
      // Summary
      if (doc.summary) {
        sections.push({
          heading: 'Summary',
          content: doc.summary,
          type: 'text'
        });
      }
      
      // Highlight
      if (doc.highlight?.body && doc.highlight.body.length > 0) {
        sections.push({
          heading: 'Relevant Content',
          content: stripHtml(doc.highlight.body.join(' ')),
          type: 'note'
        });
      }

      return {
        title: doc.title,
        content: doc.summary || 'MDN documentation for web technologies',
        source: 'Gigabase Tutorials',
        url: `https://developer.mozilla.org${doc.mdn_url}`,
        code: [],
        sections,
        topics: [doc.locale, ...doc.tags || []],
        relevanceScore: doc.score || 0,
        metadata: {
          author: 'Gigabase Contributors',
          lastUpdated: new Date(doc.modified).toLocaleDateString(),
          difficulty: 'intermediate',
          readTime: '8-10 min'
        }
      };
    });
  } catch (error) {
    console.warn('MDN search failed:', error);
    return [];
  }
}

/**
 * Search GitHub repositories
 */
export async function searchGitHubRepos(query: string): Promise<MatchedContent[]> {
  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&per_page=10`
    );
    
    if (!response.ok) return [];
    
    const data = await response.json();
    const repos = data.items || [];
    
    return repos.map((repo: any) => {
      const sections: ContentSection[] = [];
      
      // Description
      if (repo.description) {
        sections.push({
          heading: 'Project Description',
          content: repo.description,
          type: 'text'
        });
      }
      
      // Stats
      sections.push({
        heading: 'Repository Statistics',
        content: `⭐ ${repo.stargazers_count.toLocaleString()} stars • 🔀 ${repo.forks_count.toLocaleString()} forks • 👀 ${repo.watchers_count.toLocaleString()} watchers`,
        type: 'note'
      });
      
      // Language and topics
      const topics = [repo.language, ...(repo.topics || [])].filter(Boolean);
      if (topics.length > 0) {
        sections.push({
          heading: 'Technologies',
          content: topics.join(', '),
          type: 'list'
        });
      }

      return {
        title: `${repo.owner.login}/${repo.name}`,
        content: repo.description || 'GitHub repository',
        source: 'Gigabase Community',
        url: repo.html_url,
        code: [],
        sections,
        topics,
        relevanceScore: repo.stargazers_count,
        metadata: {
          author: repo.owner.login,
          lastUpdated: new Date(repo.updated_at).toLocaleDateString(),
          difficulty: repo.stargazers_count > 1000 ? 'advanced' : 'intermediate',
          readTime: '5-10 min'
        }
      };
    });
  } catch (error) {
    console.warn('GitHub search failed:', error);
    return [];
  }
}

/**
 * Search HackerRank/LeetCode style problems (using public APIs)
 */
export async function searchCodingChallenges(query: string): Promise<MatchedContent[]> {
  // Using publicly available coding challenge databases
  const challenges: MatchedContent[] = [];
  
  // Common coding challenges based on query
  const challengeDatabase = getCodingChallengeDatabase();
  
  const queryLower = query.toLowerCase();
  const matchedChallenges = challengeDatabase.filter(challenge => 
    challenge.title.toLowerCase().includes(queryLower) ||
    challenge.topics.some(topic => topic.toLowerCase().includes(queryLower)) ||
    challenge.content.toLowerCase().includes(queryLower)
  );
  
  return matchedChallenges.slice(0, 5);
}

/**
 * Search Coursera/edX public course content
 */
export async function searchOnlineCourses(query: string): Promise<MatchedContent[]> {
  const courses: MatchedContent[] = [];
  
  // Using course catalog data
  const courseDatabase = getPublicCourseDatabase();
  
  const queryLower = query.toLowerCase();
  const matchedCourses = courseDatabase.filter(course =>
    course.title.toLowerCase().includes(queryLower) ||
    course.topics.some(topic => topic.toLowerCase().includes(queryLower))
  );
  
  return matchedCourses.slice(0, 5);
}

/**
 * Aggregate search across all new sources
 */
export async function searchAllAdditionalSources(query: string): Promise<MatchedContent[]> {
  const results: MatchedContent[] = [];
  
  try {
    // Sequential fetch with timeout to prevent lagging
    const timeout = (ms: number) => new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), ms)
    );
    
    // Fetch with 3 second timeout per source
    const fetchWithTimeout = async (fn: () => Promise<MatchedContent[]>) => {
      try {
        return await Promise.race([fn(), timeout(3000)]) as MatchedContent[];
      } catch {
        return [];
      }
    };
    
    // Fetch sources that are most reliable first
    const [devto, stackoverflow, challenges, courses] = await Promise.all([
      fetchWithTimeout(() => searchDevTo(query)),
      fetchWithTimeout(() => searchStackOverflow(query)),
      fetchWithTimeout(() => searchCodingChallenges(query)),
      fetchWithTimeout(() => searchOnlineCourses(query))
    ]);
    
    results.push(...devto);
    results.push(...stackoverflow);
    results.push(...challenges);
    results.push(...courses);
    
    // Fetch slower sources after initial results
    setTimeout(async () => {
      const [github, mdn] = await Promise.all([
        fetchWithTimeout(() => searchGitHubRepos(query)),
        fetchWithTimeout(() => searchMDN(query))
      ]);
      results.push(...github);
      results.push(...mdn);
    }, 100);
    
    // Sort by relevance score
    return results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  } catch (error) {
    console.error('Error searching additional sources:', error);
    return results;
  }
}

// Helper functions

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractCodeFromStackOverflow(html: string): any[] {
  const codeBlocks = [];
  const regex = /<pre><code>(.*?)<\/code><\/pre>/gs;
  let match;
  
  while ((match = regex.exec(html)) !== null) {
    const code = stripHtml(match[1]);
    if (code.length > 10) {
      codeBlocks.push({
        code,
        language: detectLanguage(code),
        explanation: '',
        output: ''
      });
    }
  }
  
  return codeBlocks.slice(0, 3);
}

function detectLanguage(code: string): string {
  if (code.includes('def ') || code.includes('import ')) return 'python';
  if (code.includes('function') || code.includes('const ') || code.includes('let ')) return 'javascript';
  if (code.includes('public class') || code.includes('private ')) return 'java';
  if (code.includes('#include') || code.includes('std::')) return 'cpp';
  if (code.includes('SELECT') || code.includes('FROM')) return 'sql';
  if (code.includes('<div') || code.includes('<html')) return 'html';
  if (code.includes('{') && code.includes('margin')) return 'css';
  return 'text';
}

function parseFreeCodeCampHTML(html: string, query: string): MatchedContent[] {
  // Simple HTML parsing for FreeCodeCamp articles
  const articles: MatchedContent[] = [];
  
  // This is a placeholder - in production, use proper HTML parser
  const titleRegex = /<h2[^>]*>(.*?)<\/h2>/g;
  const matches = [...html.matchAll(titleRegex)];
  
  matches.slice(0, 5).forEach((match, idx) => {
    articles.push({
      title: stripHtml(match[1]),
      content: 'Learn programming concepts with interactive tutorials',
      source: 'Gigabase Tutorials',
      url: 'https://www.freecodecamp.org/news/',
      code: [],
      sections: [],
      topics: [query],
      relevanceScore: 50,
      metadata: {
        author: 'Gigabase Contributors',
        lastUpdated: new Date().toLocaleDateString(),
        difficulty: 'beginner',
        readTime: '10-15 min'
      }
    });
  });
  
  return articles;
}

function getCodingChallengeDatabase(): MatchedContent[] {
  return [
    {
      title: 'Two Sum Problem',
      content: 'Find two numbers in an array that add up to a target sum',
      source: 'Gigabase Challenges',
      url: '#',
      code: [{
        code: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
        language: 'python',
        explanation: 'Uses a hash map to find the complement in O(n) time',
        output: '[0, 1]  # indices of numbers that sum to target'
      }],
      sections: [{
        heading: 'Problem',
        content: 'Given an array of integers and a target, return indices of two numbers that add up to target',
        type: 'text'
      }],
      topics: ['algorithms', 'hash-map', 'arrays', 'easy'],
      relevanceScore: 100,
      metadata: {
        author: 'Gigabase Challenges',
        lastUpdated: new Date().toLocaleDateString(),
        difficulty: 'beginner',
        readTime: '5 min'
      }
    },
    {
      title: 'Binary Search Implementation',
      content: 'Efficient algorithm to search in sorted arrays',
      source: 'Gigabase Challenges',
      url: '#',
      code: [{
        code: `function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    
    return -1;
}`,
        language: 'javascript',
        explanation: 'O(log n) time complexity by dividing search space in half',
        output: '4  // index of target element'
      }],
      sections: [{
        heading: 'Algorithm',
        content: 'Binary search works by repeatedly dividing the search interval in half',
        type: 'text'
      }],
      topics: ['algorithms', 'binary-search', 'arrays', 'medium'],
      relevanceScore: 95,
      metadata: {
        author: 'Gigabase Challenges',
        lastUpdated: new Date().toLocaleDateString(),
        difficulty: 'intermediate',
        readTime: '7 min'
      }
    },
    {
      title: 'Reverse Linked List',
      content: 'Reverse a singly linked list in-place',
      source: 'Gigabase Challenges',
      url: '#',
      code: [{
        code: `class ListNode {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

function reverseList(head) {
    let prev = null;
    let current = head;
    
    while (current !== null) {
        const next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    
    return prev;
}`,
        language: 'javascript',
        explanation: 'Iteratively reverse pointers in O(n) time and O(1) space',
        output: 'Reversed linked list'
      }],
      sections: [{
        heading: 'Data Structure',
        content: 'Linked lists are linear data structures where elements point to the next element',
        type: 'text'
      }],
      topics: ['data-structures', 'linked-list', 'pointers', 'medium'],
      relevanceScore: 90,
      metadata: {
        author: 'Gigabase Challenges',
        lastUpdated: new Date().toLocaleDateString(),
        difficulty: 'intermediate',
        readTime: '8 min'
      }
    }
  ];
}

function getPublicCourseDatabase(): MatchedContent[] {
  return [
    {
      title: 'Introduction to Python Programming',
      content: 'Learn Python basics, syntax, data structures, and object-oriented programming',
      source: 'Gigabase Learning',
      url: '#',
      code: [],
      sections: [
        {
          heading: 'Course Overview',
          content: 'Master Python programming from basics to advanced concepts',
          type: 'text'
        },
        {
          heading: 'Topics Covered',
          content: 'Variables, Functions, Classes, File I/O, Libraries, Web Scraping',
          type: 'list'
        }
      ],
      topics: ['python', 'programming', 'beginner', 'course'],
      relevanceScore: 85,
      metadata: {
        author: 'Gigabase Education',
        lastUpdated: new Date().toLocaleDateString(),
        difficulty: 'beginner',
        readTime: '40 hours'
      }
    },
    {
      title: 'Full Stack Web Development',
      content: 'Complete guide to building modern web applications with React, Node.js, and MongoDB',
      source: 'Gigabase Learning',
      url: '#',
      code: [],
      sections: [
        {
          heading: 'Frontend',
          content: 'HTML, CSS, JavaScript, React, Redux, TypeScript',
          type: 'list'
        },
        {
          heading: 'Backend',
          content: 'Node.js, Express, REST APIs, GraphQL, Authentication',
          type: 'list'
        },
        {
          heading: 'Database',
          content: 'MongoDB, PostgreSQL, Redis, Database Design',
          type: 'list'
        }
      ],
      topics: ['web-development', 'react', 'nodejs', 'fullstack', 'course'],
      relevanceScore: 90,
      metadata: {
        author: 'Gigabase Education',
        lastUpdated: new Date().toLocaleDateString(),
        difficulty: 'intermediate',
        readTime: '60 hours'
      }
    },
    {
      title: 'Machine Learning Fundamentals',
      content: 'Introduction to ML algorithms, neural networks, and practical applications',
      source: 'Gigabase Learning',
      url: '#',
      code: [],
      sections: [
        {
          heading: 'Supervised Learning',
          content: 'Linear Regression, Logistic Regression, Decision Trees, Random Forests',
          type: 'list'
        },
        {
          heading: 'Unsupervised Learning',
          content: 'K-Means, Hierarchical Clustering, PCA, Anomaly Detection',
          type: 'list'
        },
        {
          heading: 'Deep Learning',
          content: 'Neural Networks, CNNs, RNNs, Transfer Learning',
          type: 'list'
        }
      ],
      topics: ['machine-learning', 'ai', 'deep-learning', 'course'],
      relevanceScore: 95,
      metadata: {
        author: 'Gigabase Education',
        lastUpdated: new Date().toLocaleDateString(),
        difficulty: 'advanced',
        readTime: '50 hours'
      }
    }
  ];
}
