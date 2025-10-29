// Advanced Resources - Video Tutorials, Books, Documentation, Code Snippets

import { MatchedContent, ContentSection } from './advancedContentMatcher';

/**
 * Search YouTube for programming tutorials (using public API)
 */
export async function searchVideoTutorials(query: string): Promise<MatchedContent[]> {
  try {
    // Using YouTube's search without API key (RSS feed alternative)
    const searchQuery = encodeURIComponent(`${query} programming tutorial`);
    
    // Simulate video results (in production, use YouTube Data API)
    const videos = getPopularVideoDatabase(query);
    
    return videos.slice(0, 6).map(video => ({
      title: video.title,
      content: video.description,
      source: 'Gigabase Video Tutorials',
      url: video.url,
      code: [],
      sections: [{
        heading: 'Video Details',
        content: `Duration: ${video.duration}\nViews: ${video.views}\nLevel: ${video.level}`,
        type: 'note'
      }],
      topics: video.topics,
      relevanceScore: video.relevance,
      metadata: {
        author: video.channel,
        lastUpdated: video.published,
        difficulty: video.level,
        readTime: video.duration
      }
    }));
  } catch (error) {
    console.warn('Video search failed:', error);
    return [];
  }
}

/**
 * Search programming books and documentation
 */
export async function searchBooksAndDocs(query: string): Promise<MatchedContent[]> {
  try {
    const books = getProgrammingBooksDatabase(query);
    
    return books.slice(0, 5).map(book => {
      const sections: ContentSection[] = [];
      
      if (book.summary) {
        sections.push({
          heading: 'Book Summary',
          content: book.summary,
          type: 'text'
        });
      }
      
      if (book.chapters && book.chapters.length > 0) {
        sections.push({
          heading: 'Key Topics Covered',
          content: book.chapters.join('\n• '),
          type: 'list'
        });
      }
      
      sections.push({
        heading: 'Book Details',
        content: `Pages: ${book.pages}\nPublisher: ${book.publisher}\nYear: ${book.year}`,
        type: 'note'
      });

      return {
        title: book.title,
        content: book.description,
        source: 'Gigabase Library',
        url: book.url,
        code: [],
        sections,
        topics: book.topics,
        relevanceScore: book.relevance,
        metadata: {
          author: book.author,
          lastUpdated: book.year,
          difficulty: book.level,
          readTime: `${book.pages} pages`
        }
      };
    });
  } catch (error) {
    console.warn('Books search failed:', error);
    return [];
  }
}

/**
 * Search code snippets and examples
 */
export async function searchCodeSnippets(query: string): Promise<MatchedContent[]> {
  try {
    const snippets = getCodeSnippetsDatabase(query);
    
    return snippets.slice(0, 8).map(snippet => ({
      title: snippet.title,
      content: snippet.description,
      source: 'Gigabase Code Library',
      url: '#',
      code: [{
        code: snippet.code,
        language: snippet.language,
        explanation: snippet.explanation,
        output: snippet.output,
        title: snippet.title
      }],
      sections: [{
        heading: 'Use Cases',
        content: snippet.useCases.join('\n• '),
        type: 'list'
      }],
      topics: snippet.topics,
      relevanceScore: snippet.relevance,
      metadata: {
        author: 'Gigabase Contributors',
        lastUpdated: new Date().toLocaleDateString(),
        difficulty: snippet.difficulty,
        readTime: '2-5 min'
      }
    }));
  } catch (error) {
    console.warn('Code snippets search failed:', error);
    return [];
  }
}

/**
 * Get curated learning paths
 */
export async function getLearningPaths(query: string): Promise<MatchedContent[]> {
  try {
    const paths = getLearningPathsDatabase(query);
    
    return paths.slice(0, 3).map(path => {
      const sections: ContentSection[] = [];
      
      path.modules.forEach((module, idx) => {
        sections.push({
          heading: `${idx + 1}. ${module.title}`,
          content: `${module.description}\nDuration: ${module.duration}\nTopics: ${module.topics.join(', ')}`,
          type: 'text'
        });
      });

      return {
        title: path.title,
        content: path.description,
        source: 'Gigabase Learning Paths',
        url: '#',
        code: [],
        sections,
        topics: path.topics,
        relevanceScore: path.relevance,
        metadata: {
          author: 'Gigabase Education Team',
          lastUpdated: new Date().toLocaleDateString(),
          difficulty: path.level,
          readTime: path.totalDuration
        }
      };
    });
  } catch (error) {
    console.warn('Learning paths search failed:', error);
    return [];
  }
}

/**
 * Get AI-powered recommendations
 */
export async function getAIRecommendations(query: string): Promise<MatchedContent[]> {
  try {
    const recommendations = getSmartRecommendations(query);
    
    return recommendations.map(rec => ({
      title: rec.title,
      content: rec.reasoning,
      source: 'Gigabase AI Recommendations',
      url: rec.url,
      code: [],
      sections: [{
        heading: 'Why This Resource?',
        content: rec.whyRecommended,
        type: 'note'
      }, {
        heading: 'Next Steps',
        content: rec.nextSteps.join('\n'),
        type: 'list'
      }],
      topics: rec.topics,
      relevanceScore: rec.confidence,
      metadata: {
        author: 'Gigabase AI',
        lastUpdated: new Date().toLocaleDateString(),
        difficulty: rec.level,
        readTime: rec.estimatedTime
      }
    }));
  } catch (error) {
    console.warn('AI recommendations failed:', error);
    return [];
  }
}

/**
 * Search all advanced resources
 */
export async function searchAllAdvancedResources(query: string): Promise<MatchedContent[]> {
  const timeout = (ms: number) => new Promise<MatchedContent[]>(resolve => 
    setTimeout(() => resolve([]), ms)
  );

  const fetchWithTimeout = async (fn: () => Promise<MatchedContent[]>, ms: number = 3000) => {
    try {
      return await Promise.race([fn(), timeout(ms)]) as MatchedContent[];
    } catch {
      return [];
    }
  };

  try {
    // Fast sources first
    const [videos, snippets, paths] = await Promise.all([
      fetchWithTimeout(() => searchVideoTutorials(query)),
      fetchWithTimeout(() => searchCodeSnippets(query)),
      fetchWithTimeout(() => getLearningPaths(query))
    ]);

    // Slower sources
    const [books, aiRecs] = await Promise.all([
      fetchWithTimeout(() => searchBooksAndDocs(query)),
      fetchWithTimeout(() => getAIRecommendations(query))
    ]);

    return [...videos, ...snippets, ...paths, ...books, ...aiRecs];
  } catch (error) {
    console.warn('Advanced resources search failed:', error);
    return [];
  }
}

// ============= DATABASES =============

function getPopularVideoDatabase(query: string): any[] {
  const videos = [
    {
      title: 'Complete Python Tutorial - From Beginner to Advanced',
      description: 'Comprehensive Python programming course covering basics to advanced topics',
      url: 'https://youtube.com',
      duration: '4 hours',
      views: '2.5M views',
      level: 'beginner',
      channel: 'Programming with Mosh',
      published: '2024',
      topics: ['python', 'programming', 'beginner'],
      relevance: 95
    },
    {
      title: 'JavaScript ES6+ Features Explained',
      description: 'Modern JavaScript features including async/await, destructuring, and modules',
      url: 'https://youtube.com',
      duration: '2.5 hours',
      views: '1.8M views',
      level: 'intermediate',
      channel: 'Traversy Media',
      published: '2024',
      topics: ['javascript', 'es6', 'web'],
      relevance: 92
    },
    {
      title: 'React Full Course for Beginners',
      description: 'Learn React from scratch with hooks, context API, and real projects',
      url: 'https://youtube.com',
      duration: '6 hours',
      views: '3.2M views',
      level: 'beginner',
      channel: 'freeCodeCamp',
      published: '2024',
      topics: ['react', 'javascript', 'frontend'],
      relevance: 90
    },
    {
      title: 'Data Structures and Algorithms Complete Guide',
      description: 'Master DSA with visual explanations and coding examples',
      url: 'https://youtube.com',
      duration: '8 hours',
      views: '1.5M views',
      level: 'intermediate',
      channel: 'Abdul Bari',
      published: '2024',
      topics: ['algorithms', 'data-structures', 'computer-science'],
      relevance: 88
    },
    {
      title: 'Machine Learning A-Z: Hands-On Python',
      description: 'Complete machine learning course with Python and scikit-learn',
      url: 'https://youtube.com',
      duration: '12 hours',
      views: '2.1M views',
      level: 'advanced',
      channel: 'Krish Naik',
      published: '2024',
      topics: ['machine-learning', 'ai', 'python'],
      relevance: 93
    },
    {
      title: 'SQL Database Design and Optimization',
      description: 'Learn SQL database design, queries, and performance optimization',
      url: 'https://youtube.com',
      duration: '3 hours',
      views: '980K views',
      level: 'intermediate',
      channel: 'Caleb Curry',
      published: '2024',
      topics: ['sql', 'database', 'backend'],
      relevance: 85
    }
  ];

  return videos.filter(v => 
    v.topics.some(t => t.toLowerCase().includes(query.toLowerCase())) ||
    v.title.toLowerCase().includes(query.toLowerCase())
  );
}

function getProgrammingBooksDatabase(query: string): any[] {
  const books = [
    {
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      author: 'Robert C. Martin',
      description: 'Learn to write code that is clean, maintainable, and efficient',
      summary: 'This book teaches principles and best practices for writing clean code that is easy to read, understand, and maintain.',
      chapters: [
        'Meaningful Names',
        'Functions',
        'Comments',
        'Formatting',
        'Objects and Data Structures',
        'Error Handling',
        'Unit Tests',
        'Classes',
        'Systems',
        'Emergence'
      ],
      pages: 464,
      publisher: 'Prentice Hall',
      year: '2008',
      url: '#',
      topics: ['clean-code', 'best-practices', 'software-engineering'],
      level: 'intermediate',
      relevance: 95
    },
    {
      title: 'Introduction to Algorithms (CLRS)',
      author: 'Thomas H. Cormen, Charles E. Leiserson',
      description: 'Comprehensive guide to algorithms and data structures',
      summary: 'The definitive computer science textbook on algorithms, covering sorting, searching, graph algorithms, and more.',
      chapters: [
        'Foundations',
        'Sorting and Order Statistics',
        'Data Structures',
        'Advanced Design and Analysis',
        'Graph Algorithms',
        'Selected Topics'
      ],
      pages: 1312,
      publisher: 'MIT Press',
      year: '2009',
      url: '#',
      topics: ['algorithms', 'data-structures', 'computer-science'],
      level: 'advanced',
      relevance: 98
    },
    {
      title: 'JavaScript: The Good Parts',
      author: 'Douglas Crockford',
      description: 'Understanding JavaScript\'s best features and avoiding pitfalls',
      summary: 'A concise guide to the essential features of JavaScript that work well and should be used.',
      chapters: [
        'Good Parts',
        'Grammar',
        'Objects',
        'Functions',
        'Inheritance',
        'Arrays',
        'Methods',
        'Style',
        'Beautiful Features'
      ],
      pages: 176,
      publisher: "O'Reilly Media",
      year: '2008',
      url: '#',
      topics: ['javascript', 'web-development', 'programming'],
      level: 'intermediate',
      relevance: 90
    },
    {
      title: 'Python Crash Course',
      author: 'Eric Matthes',
      description: 'Hands-on, project-based introduction to programming with Python',
      summary: 'A fast-paced, thorough introduction to programming with Python that will have you writing programs in no time.',
      chapters: [
        'Getting Started',
        'Variables and Simple Data Types',
        'Lists',
        'Working with Lists',
        'If Statements',
        'Dictionaries',
        'User Input and While Loops',
        'Functions',
        'Classes',
        'Files and Exceptions'
      ],
      pages: 544,
      publisher: 'No Starch Press',
      year: '2019',
      url: '#',
      topics: ['python', 'programming', 'beginner'],
      level: 'beginner',
      relevance: 92
    },
    {
      title: 'Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      description: 'The big ideas behind reliable, scalable, and maintainable systems',
      summary: 'Essential reading for software engineers and architects working with distributed data systems.',
      chapters: [
        'Reliable, Scalable, and Maintainable Applications',
        'Data Models',
        'Storage and Retrieval',
        'Encoding and Evolution',
        'Replication',
        'Partitioning',
        'Transactions',
        'The Trouble with Distributed Systems'
      ],
      pages: 616,
      publisher: "O'Reilly Media",
      year: '2017',
      url: '#',
      topics: ['distributed-systems', 'databases', 'architecture'],
      level: 'advanced',
      relevance: 94
    }
  ];

  return books.filter(b =>
    b.topics.some(t => t.toLowerCase().includes(query.toLowerCase())) ||
    b.title.toLowerCase().includes(query.toLowerCase()) ||
    b.description.toLowerCase().includes(query.toLowerCase())
  );
}

function getCodeSnippetsDatabase(query: string): any[] {
  const snippets = [
    {
      title: 'Debounce Function Implementation',
      description: 'Optimize performance by limiting function execution rate',
      code: `function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Usage
const searchInput = document.getElementById('search');
const debouncedSearch = debounce((value) => {
  console.log('Searching for:', value);
  // API call here
}, 500);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});`,
      language: 'javascript',
      explanation: 'Debouncing delays function execution until after a specified time has passed since the last call. Perfect for search inputs, resize events, and scroll handlers.',
      output: 'Function will only execute 500ms after user stops typing',
      useCases: [
        'Search input optimization',
        'Window resize handlers',
        'API call rate limiting',
        'Scroll event optimization'
      ],
      topics: ['javascript', 'performance', 'optimization'],
      difficulty: 'intermediate',
      relevance: 95
    },
    {
      title: 'Quick Sort Algorithm',
      description: 'Efficient O(n log n) sorting algorithm using divide and conquer',
      code: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)

# Usage
numbers = [64, 34, 25, 12, 22, 11, 90]
sorted_numbers = quick_sort(numbers)
print(sorted_numbers)`,
      language: 'python',
      explanation: 'QuickSort partitions the array around a pivot and recursively sorts the subarrays. Average time complexity: O(n log n).',
      output: '[11, 12, 22, 25, 34, 64, 90]',
      useCases: [
        'Large dataset sorting',
        'In-place sorting needs',
        'Average-case performance critical scenarios',
        'Unstable sort acceptable'
      ],
      topics: ['algorithms', 'sorting', 'python'],
      difficulty: 'intermediate',
      relevance: 90
    },
    {
      title: 'Custom React Hook - useLocalStorage',
      description: 'Persist state in browser localStorage with React hooks',
      code: `import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function 
        ? value(storedValue) 
        : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// Usage in component
function App() {
  const [name, setName] = useLocalStorage('name', 'John');
  
  return (
    <input 
      value={name} 
      onChange={(e) => setName(e.target.value)} 
    />
  );
}`,
      language: 'typescript',
      explanation: 'This custom hook synchronizes React state with localStorage, providing persistent state across page reloads.',
      output: 'State persists across browser sessions',
      useCases: [
        'User preferences storage',
        'Form data persistence',
        'Shopping cart state',
        'Theme/settings storage'
      ],
      topics: ['react', 'hooks', 'state-management'],
      difficulty: 'intermediate',
      relevance: 92
    },
    {
      title: 'Binary Search Tree Implementation',
      description: 'Efficient data structure for fast search, insert, and delete operations',
      code: `class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const newNode = new TreeNode(value);
    
    if (!this.root) {
      this.root = newNode;
      return this;
    }

    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          return this;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return this;
        }
        current = current.right;
      }
    }
  }

  search(value) {
    let current = this.root;
    while (current) {
      if (value === current.value) return true;
      current = value < current.value ? current.left : current.right;
    }
    return false;
  }
}

// Usage
const bst = new BinarySearchTree();
bst.insert(10).insert(5).insert(15).insert(3);
console.log(bst.search(5));  // true
console.log(bst.search(20)); // false`,
      language: 'javascript',
      explanation: 'BST provides O(log n) average-case performance for search, insert, and delete operations when balanced.',
      output: 'true\nfalse',
      useCases: [
        'Database indexing',
        'Fast searching in sorted data',
        'Priority queues',
        'Expression parsing'
      ],
      topics: ['data-structures', 'trees', 'algorithms'],
      difficulty: 'intermediate',
      relevance: 88
    },
    {
      title: 'Async/Await Error Handling Wrapper',
      description: 'Clean error handling for async functions without try-catch blocks',
      code: `const asyncHandler = (fn) => async (...args) => {
  try {
    return [await fn(...args), null];
  } catch (error) {
    return [null, error];
  }
};

// Usage
const fetchUserData = async (userId) => {
  const response = await fetch(\`/api/users/\${userId}\`);
  if (!response.ok) throw new Error('User not found');
  return response.json();
};

// Use the handler
const getUserData = asyncHandler(fetchUserData);

// In your code
const [data, error] = await getUserData(123);

if (error) {
  console.error('Failed to fetch user:', error);
  // Handle error
} else {
  console.log('User data:', data);
  // Use data
}`,
      language: 'javascript',
      explanation: 'This pattern eliminates repetitive try-catch blocks by wrapping async functions and returning a tuple of [data, error].',
      output: 'Clean error handling without try-catch everywhere',
      useCases: [
        'API calls',
        'Database operations',
        'File system operations',
        'Any async error-prone operations'
      ],
      topics: ['javascript', 'async', 'error-handling'],
      difficulty: 'advanced',
      relevance: 93
    },
    {
      title: 'Memoization for Performance Optimization',
      description: 'Cache expensive function results to improve performance',
      code: `function memoize(fn) {
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      console.log('Returning cached result');
      return cache.get(key);
    }
    
    console.log('Computing result');
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Example: Expensive Fibonacci calculation
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoizedFib = memoize(fibonacci);

console.time('First call');
console.log(memoizedFib(40)); // Slow
console.timeEnd('First call');

console.time('Second call');
console.log(memoizedFib(40)); // Instant!
console.timeEnd('Second call');`,
      language: 'javascript',
      explanation: 'Memoization stores results of expensive function calls and returns cached results for same inputs, dramatically improving performance.',
      output: 'First call: ~1000ms\nSecond call: ~0.1ms (1000x faster!)',
      useCases: [
        'Recursive calculations',
        'API response caching',
        'Complex computations',
        'React component rendering optimization'
      ],
      topics: ['performance', 'optimization', 'caching'],
      difficulty: 'advanced',
      relevance: 91
    }
  ];

  return snippets.filter(s =>
    s.topics.some(t => t.toLowerCase().includes(query.toLowerCase())) ||
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.description.toLowerCase().includes(query.toLowerCase())
  );
}

function getLearningPathsDatabase(query: string): any[] {
  const paths = [
    {
      title: 'Full Stack JavaScript Developer Path',
      description: 'Complete roadmap from beginner to full-stack JavaScript developer',
      totalDuration: '6-8 months',
      level: 'beginner',
      topics: ['javascript', 'react', 'nodejs', 'fullstack'],
      relevance: 95,
      modules: [
        {
          title: 'JavaScript Fundamentals',
          description: 'Master core JavaScript concepts: variables, functions, objects, arrays, and ES6+ features',
          duration: '4 weeks',
          topics: ['variables', 'functions', 'es6', 'async']
        },
        {
          title: 'Frontend Development with React',
          description: 'Build interactive UIs with React, hooks, context, and state management',
          duration: '6 weeks',
          topics: ['react', 'jsx', 'hooks', 'redux']
        },
        {
          title: 'Backend Development with Node.js',
          description: 'Create RESTful APIs with Express, authentication, and database integration',
          duration: '6 weeks',
          topics: ['nodejs', 'express', 'mongodb', 'rest-api']
        },
        {
          title: 'Database Management',
          description: 'Learn SQL and NoSQL databases, schema design, and queries',
          duration: '4 weeks',
          topics: ['mongodb', 'postgresql', 'database-design']
        },
        {
          title: 'DevOps & Deployment',
          description: 'Deploy applications using Docker, CI/CD, and cloud platforms',
          duration: '3 weeks',
          topics: ['docker', 'aws', 'ci-cd', 'deployment']
        }
      ]
    },
    {
      title: 'Machine Learning Engineer Path',
      description: 'Comprehensive path from ML basics to production-ready AI systems',
      totalDuration: '9-12 months',
      level: 'intermediate',
      topics: ['machine-learning', 'ai', 'python', 'deep-learning'],
      relevance: 92,
      modules: [
        {
          title: 'Python for Data Science',
          description: 'NumPy, Pandas, Matplotlib for data manipulation and visualization',
          duration: '3 weeks',
          topics: ['python', 'numpy', 'pandas', 'matplotlib']
        },
        {
          title: 'Statistics & Mathematics',
          description: 'Linear algebra, calculus, probability, and statistics for ML',
          duration: '6 weeks',
          topics: ['statistics', 'linear-algebra', 'probability']
        },
        {
          title: 'Classical Machine Learning',
          description: 'Supervised and unsupervised learning algorithms with scikit-learn',
          duration: '8 weeks',
          topics: ['regression', 'classification', 'clustering', 'scikit-learn']
        },
        {
          title: 'Deep Learning & Neural Networks',
          description: 'CNNs, RNNs, transformers with TensorFlow and PyTorch',
          duration: '10 weeks',
          topics: ['neural-networks', 'tensorflow', 'pytorch', 'cnn', 'rnn']
        },
        {
          title: 'MLOps & Production',
          description: 'Deploy and monitor ML models in production environments',
          duration: '4 weeks',
          topics: ['mlops', 'model-deployment', 'monitoring']
        }
      ]
    },
    {
      title: 'Data Structures & Algorithms Mastery',
      description: 'Master DSA for technical interviews and competitive programming',
      totalDuration: '4-6 months',
      level: 'intermediate',
      topics: ['algorithms', 'data-structures', 'problem-solving'],
      relevance: 90,
      modules: [
        {
          title: 'Time & Space Complexity',
          description: 'Big O notation, complexity analysis, and optimization techniques',
          duration: '2 weeks',
          topics: ['big-o', 'complexity', 'analysis']
        },
        {
          title: 'Arrays & Strings',
          description: 'Two pointers, sliding window, and common array problems',
          duration: '3 weeks',
          topics: ['arrays', 'strings', 'two-pointers']
        },
        {
          title: 'Linked Lists & Trees',
          description: 'Singly/doubly linked lists, binary trees, BST, and traversals',
          duration: '4 weeks',
          topics: ['linked-lists', 'trees', 'bst', 'traversals']
        },
        {
          title: 'Graphs & Dynamic Programming',
          description: 'BFS, DFS, shortest paths, and DP patterns',
          duration: '6 weeks',
          topics: ['graphs', 'dynamic-programming', 'bfs', 'dfs']
        },
        {
          title: 'Advanced Topics',
          description: 'Heaps, tries, segment trees, and advanced algorithms',
          duration: '4 weeks',
          topics: ['heaps', 'tries', 'segment-trees', 'advanced']
        }
      ]
    }
  ];

  return paths.filter(p =>
    p.topics.some(t => t.toLowerCase().includes(query.toLowerCase())) ||
    p.title.toLowerCase().includes(query.toLowerCase())
  );
}

function getSmartRecommendations(query: string): any[] {
  const recommendations = [
    {
      title: 'Start with JavaScript Fundamentals',
      reasoning: 'Based on your search, mastering JavaScript basics is essential before diving into frameworks',
      whyRecommended: 'JavaScript is the foundation for modern web development. Understanding core concepts like closures, prototypes, and async programming will make learning React, Node.js, and other frameworks much easier.',
      nextSteps: [
        '1. Complete "JavaScript: The Good Parts" book',
        '2. Practice with 50+ coding challenges on LeetCode',
        '3. Build 3 small projects (calculator, todo app, weather app)',
        '4. Learn ES6+ features thoroughly'
      ],
      url: '#',
      topics: ['javascript', 'fundamentals', 'learning-path'],
      level: 'beginner',
      estimatedTime: '2-3 months',
      confidence: 95
    },
    {
      title: 'Learn React After Solid JavaScript Foundation',
      reasoning: 'React builds on JavaScript fundamentals. Strong JS knowledge makes React easier to learn',
      whyRecommended: 'React is the most popular frontend library with excellent job prospects. However, jumping into React without solid JavaScript knowledge leads to confusion. Master JS first, then React will feel natural.',
      nextSteps: [
        '1. Ensure JavaScript proficiency (closures, promises, modules)',
        '2. Understand component-based architecture',
        '3. Start with functional components and hooks',
        '4. Build a real project (e-commerce or social media clone)'
      ],
      url: '#',
      topics: ['react', 'frontend', 'javascript'],
      level: 'intermediate',
      estimatedTime: '1-2 months',
      confidence: 92
    },
    {
      title: 'Practice Data Structures Daily',
      reasoning: 'DSA skills improve problem-solving and are critical for technical interviews',
      whyRecommended: 'Consistent practice with data structures and algorithms enhances your coding efficiency and prepares you for technical interviews at top companies.',
      nextSteps: [
        '1. Solve 2-3 LeetCode problems daily',
        '2. Focus on one topic per week (arrays, trees, graphs, etc.)',
        '3. Understand time/space complexity for all solutions',
        '4. Participate in weekly contests to test skills under pressure'
      ],
      url: '#',
      topics: ['algorithms', 'interview-prep', 'problem-solving'],
      level: 'intermediate',
      estimatedTime: 'Ongoing',
      confidence: 90
    }
  ];

  return recommendations.slice(0, 2);
}
