// Advanced content matching with fuzzy search and multiple sources

export interface ContentSource {
  name: string;
  url: string;
  priority: number;
}

export interface MatchedContent {
  title: string;
  content: string;
  source: string;
  url: string;
  code?: CodeSnippet[];
  sections?: ContentSection[];
  topics: string[];
  relevanceScore: number;
  metadata?: {
    author?: string;
    lastUpdated?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    readTime?: string;
  };
}

export interface CodeSnippet {
  code: string;
  language: string;
  explanation?: string;
  output?: string;
  title?: string;
}

export interface ContentSection {
  heading: string;
  content: string;
  type: 'text' | 'list' | 'table' | 'note';
  subSections?: ContentSection[];
}

// Fuzzy string matching - Levenshtein distance
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

function similarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
  return (longer.length - distance) / longer.length;
}

// Extract keywords from query
function extractKeywords(query: string): { languages: string[]; topics: string[]; keywords: string[] } {
  const queryLower = query.toLowerCase();
  
  const languageMap: Record<string, string[]> = {
    python: ['python', 'py', 'pyton', 'phyton'],
    java: ['java', 'jva', 'jawa'],
    javascript: ['javascript', 'js', 'jscript', 'ecmascript'],
    typescript: ['typescript', 'ts'],
    cpp: ['c++', 'cpp', 'cplusplus', 'c plus plus'],
    c: ['c language', ' c ', 'clang'],
    csharp: ['c#', 'csharp', 'c sharp'],
    ruby: ['ruby', 'rb'],
    php: ['php', 'hypertext'],
    swift: ['swift', 'ios'],
    kotlin: ['kotlin', 'android'],
    go: ['golang', 'go lang', ' go '],
    rust: ['rust', 'rs'],
    sql: ['sql', 'mysql', 'postgresql', 'database'],
    html: ['html', 'html5', 'markup'],
    css: ['css', 'css3', 'styling'],
    r: [' r ', 'rstats'],
    scala: ['scala'],
    perl: ['perl'],
    matlab: ['matlab'],
  };

  const topicMap: Record<string, string[]> = {
    'string': ['string', 'strings', 'str', 'text'],
    'array': ['array', 'arrays', 'list', 'lists'],
    'loop': ['loop', 'loops', 'iteration', 'for', 'while'],
    'function': ['function', 'functions', 'method', 'methods'],
    'class': ['class', 'classes', 'object', 'oop'],
    'variable': ['variable', 'variables', 'var'],
    'syntax': ['syntax', 'grammar', 'structure'],
    'operator': ['operator', 'operators', 'operation'],
    'conditional': ['if', 'else', 'switch', 'case', 'conditional'],
    'exception': ['exception', 'error', 'try', 'catch'],
    'file': ['file', 'io', 'input', 'output'],
    'data-structure': ['data structure', 'ds', 'stack', 'queue', 'tree'],
    'algorithm': ['algorithm', 'algo', 'sorting', 'searching'],
  };

  const languages: string[] = [];
  const topics: string[] = [];
  const keywords: string[] = queryLower.split(/\s+/).filter(w => w.length > 2);

  // Match languages with fuzzy matching
  for (const [lang, variations] of Object.entries(languageMap)) {
    for (const variation of variations) {
      if (queryLower.includes(variation) || similarity(queryLower, variation) > 0.8) {
        if (!languages.includes(lang)) {
          languages.push(lang);
        }
      }
    }
  }

  // Match topics with fuzzy matching
  for (const [topic, variations] of Object.entries(topicMap)) {
    for (const variation of variations) {
      if (queryLower.includes(variation) || similarity(queryLower, variation) > 0.75) {
        if (!topics.includes(topic)) {
          topics.push(topic);
        }
      }
    }
  }

  return { languages, topics, keywords };
}

// Generate AlphaCodingSkills URLs
function generateAlphaCodingURLs(languages: string[], topics: string[]): string[] {
  const urls: string[] = [];
  const baseUrl = 'https://www.alphacodingskills.com';

  const topicUrlMap: Record<string, string> = {
    'string': 'string',
    'array': 'array',
    'loop': 'loops',
    'function': 'functions',
    'class': 'classes',
    'variable': 'variables',
    'syntax': 'syntax',
    'operator': 'operators',
    'conditional': 'if-else',
    'exception': 'exception-handling',
    'file': 'file-handling',
    'introduction': 'introduction',
    'tutorial': 'tutorial',
  };

  for (const lang of languages) {
    // Add main tutorial page
    urls.push(`${baseUrl}/${lang}/${lang}-tutorial.php`);
    urls.push(`${baseUrl}/${lang}/${lang}-introduction.php`);
    urls.push(`${baseUrl}/${lang}/${lang}-syntax.php`);

    // Add topic-specific pages
    for (const topic of topics) {
      const topicUrl = topicUrlMap[topic] || topic;
      urls.push(`${baseUrl}/${lang}/${lang}-${topicUrl}.php`);
    }
  }

  return urls;
}

// Extract content from HTML
function extractContentFromHTML(html: string): { title: string; content: string; code: CodeSnippet[] } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Extract title
  const titleElement = doc.querySelector('h1') || doc.querySelector('title');
  const title = titleElement?.textContent?.trim() || 'Programming Tutorial';

  // Extract main content
  const contentElements = doc.querySelectorAll('p, h2, h3, h4, ul, ol, pre, code');
  let content = '';
  const codeSnippets: CodeSnippet[] = [];

  contentElements.forEach((el) => {
    if (el.tagName === 'PRE' || el.tagName === 'CODE') {
      const codeText = el.textContent?.trim() || '';
      if (codeText.length > 10) {
        codeSnippets.push({
          code: codeText,
          language: detectLanguage(codeText),
        });
      }
    } else {
      const text = el.textContent?.trim();
      if (text && text.length > 0) {
        content += text + '\n\n';
      }
    }
  });

  return { title, content: content.trim(), code: codeSnippets };
}

// Detect programming language from code
function detectLanguage(code: string): string {
  if (code.includes('def ') || code.includes('import ') || code.includes('print(')) return 'python';
  if (code.includes('class ') && code.includes('public ') && code.includes('{')) return 'java';
  if (code.includes('function ') || code.includes('const ') || code.includes('let ')) return 'javascript';
  if (code.includes('#include') || code.includes('cout <<')) return 'cpp';
  if (code.includes('func ') || code.includes('package main')) return 'go';
  return 'plaintext';
}

// Fetch content with CORS proxy
async function fetchWithProxy(url: string): Promise<string> {
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
  
  try {
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error('Fetch error:', error);
    return '';
  }
}

// Main content fetching function
export async function fetchAdvancedContent(query: string): Promise<MatchedContent[]> {
  const { languages, topics, keywords } = extractKeywords(query);
  
  if (languages.length === 0 && topics.length === 0) {
    return [];
  }

  const urls = generateAlphaCodingURLs(languages, topics);
  const results: MatchedContent[] = [];

  // Fetch content from multiple URLs in parallel
  const fetchPromises = urls.slice(0, 5).map(async (url) => {
    try {
      const html = await fetchWithProxy(url);
      if (!html) return null;

      const { title, content, code } = extractContentFromHTML(html);
      
      // Calculate relevance score
      let score = 0;
      const contentLower = content.toLowerCase();
      keywords.forEach(keyword => {
        if (contentLower.includes(keyword)) score += 10;
      });
      topics.forEach(topic => {
        if (contentLower.includes(topic)) score += 20;
      });

      if (content.length < 100) return null; // Skip if too short

      return {
        title: title.replace(/\*\*/g, ''),
        content: content.replace(/\*\*/g, ''),
        source: 'AlphaCodingSkills',
        url,
        code,
        topics,
        relevanceScore: score,
      };
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      return null;
    }
  });

  const fetchedResults = await Promise.all(fetchPromises);
  results.push(...fetchedResults.filter((r) => r !== null) as MatchedContent[]);

  // Sort by relevance score
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return results;
}

// Quick answer for common queries
export function getQuickAnswer(query: string): MatchedContent | null {
  const queryLower = query.toLowerCase();
  
  const quickAnswers: Record<string, MatchedContent> = {
    'python string': {
      title: 'Python Strings',
      content: `Strings in Python are sequences of characters enclosed in quotes. Python supports single quotes (''), double quotes (""), and triple quotes (''' ''' or """ """) for multi-line strings.

Key Features:
• Strings are immutable
• Support indexing and slicing
• Rich set of built-in methods
• Unicode support by default

Common Operations:
• Concatenation using +
• Repetition using *
• String formatting with f-strings
• String methods like upper(), lower(), strip(), split()`,
      source: 'AlphaCodingSkills',
      url: 'https://www.alphacodingskills.com/python/python-string.php',
      code: [
        {
          code: `# String creation
name = "Gigabase"
message = 'Hello, World!'
multi_line = """This is
a multi-line
string"""

# String operations
full_name = "John" + " " + "Doe"
repeated = "Ha" * 3  # "HaHaHa"

# String methods
text = "  Python Programming  "
print(text.strip())      # "Python Programming"
print(text.upper())      # "  PYTHON PROGRAMMING  "
print(text.split())      # ["Python", "Programming"]

# String formatting
age = 25
print(f"I am {age} years old")

# String slicing
word = "Python"
print(word[0:2])   # "Py"
print(word[-1])    # "n"`,
          language: 'python',
          explanation: 'Comprehensive string operations in Python'
        }
      ],
      topics: ['string'],
      relevanceScore: 100,
    },
    'java string': {
      title: 'Java Strings',
      content: `Strings in Java are objects that represent sequences of characters. The String class is part of java.lang package and is automatically imported.

Key Features:
• Strings are immutable (cannot be changed)
• String pool for memory efficiency
• Rich API with many methods
• Supports Unicode characters

Common Operations:
• Concatenation using + or concat()
• Comparison using equals() or compareTo()
• String manipulation methods
• Regular expression support`,
      source: 'AlphaCodingSkills',
      url: 'https://www.alphacodingskills.com/java/java-string.php',
      code: [
        {
          code: `// String creation
String name = "Gigabase";
String message = new String("Hello, World!");

// String concatenation
String fullName = "John" + " " + "Doe";
String greeting = "Hello, ".concat(name);

// String methods
String text = "  Java Programming  ";
System.out.println(text.trim());           // "Java Programming"
System.out.println(text.toUpperCase());    // "  JAVA PROGRAMMING  "
System.out.println(text.length());         // 20

// String comparison
String str1 = "Hello";
String str2 = "Hello";
System.out.println(str1.equals(str2));     // true
System.out.println(str1 == str2);          // true (string pool)

// String manipulation
String sentence = "The quick brown fox";
String[] words = sentence.split(" ");
System.out.println(sentence.substring(0, 3)); // "The"
System.out.println(sentence.charAt(0));       // 'T'`,
          language: 'java',
          explanation: 'Comprehensive string operations in Java'
        }
      ],
      topics: ['string'],
      relevanceScore: 100,
    },
  };

  // Check for exact matches or fuzzy matches
  for (const [key, answer] of Object.entries(quickAnswers)) {
    if (queryLower.includes(key) || similarity(queryLower, key) > 0.7) {
      return answer;
    }
  }

  return null;
}
