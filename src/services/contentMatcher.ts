// Advanced content matcher for programming queries
export interface TopicMapping {
  keywords: string[];
  url: string;
  language: string;
  topic: string;
  category: string;
}

// Comprehensive topic mappings for AlphaCodingSkills
export const topicMappings: TopicMapping[] = [
  // Python Topics
  { keywords: ['python', 'string', 'strings'], url: 'https://www.alphacodingskills.com/python/python-strings.php', language: 'Python', topic: 'Strings', category: 'Python' },
  { keywords: ['python', 'syntax'], url: 'https://www.alphacodingskills.com/python/python-syntax.php', language: 'Python', topic: 'Syntax', category: 'Python' },
  { keywords: ['python', 'variable', 'variables'], url: 'https://www.alphacodingskills.com/python/python-variables.php', language: 'Python', topic: 'Variables', category: 'Python' },
  { keywords: ['python', 'list', 'lists'], url: 'https://www.alphacodingskills.com/python/python-lists.php', language: 'Python', topic: 'Lists', category: 'Python' },
  { keywords: ['python', 'tuple', 'tuples'], url: 'https://www.alphacodingskills.com/python/python-tuples.php', language: 'Python', topic: 'Tuples', category: 'Python' },
  { keywords: ['python', 'dictionary', 'dictionaries', 'dict'], url: 'https://www.alphacodingskills.com/python/python-dictionaries.php', language: 'Python', topic: 'Dictionaries', category: 'Python' },
  { keywords: ['python', 'set', 'sets'], url: 'https://www.alphacodingskills.com/python/python-sets.php', language: 'Python', topic: 'Sets', category: 'Python' },
  { keywords: ['python', 'loop', 'loops', 'for', 'while'], url: 'https://www.alphacodingskills.com/python/python-loops.php', language: 'Python', topic: 'Loops', category: 'Python' },
  { keywords: ['python', 'function', 'functions'], url: 'https://www.alphacodingskills.com/python/python-functions.php', language: 'Python', topic: 'Functions', category: 'Python' },
  { keywords: ['python', 'class', 'classes', 'oop'], url: 'https://www.alphacodingskills.com/python/python-classes.php', language: 'Python', topic: 'Classes & Objects', category: 'Python' },
  { keywords: ['python', 'array', 'arrays'], url: 'https://www.alphacodingskills.com/python/python-arrays.php', language: 'Python', topic: 'Arrays', category: 'Python' },
  { keywords: ['python', 'file', 'files', 'file handling'], url: 'https://www.alphacodingskills.com/python/python-file-handling.php', language: 'Python', topic: 'File Handling', category: 'Python' },

  // Java Topics
  { keywords: ['java', 'introduction', 'intro'], url: 'https://www.alphacodingskills.com/java/java-introduction.php', language: 'Java', topic: 'Introduction', category: 'Java' },
  { keywords: ['java', 'syntax'], url: 'https://www.alphacodingskills.com/java/java-syntax.php', language: 'Java', topic: 'Syntax', category: 'Java' },
  { keywords: ['java', 'string', 'strings'], url: 'https://www.alphacodingskills.com/java/java-strings.php', language: 'Java', topic: 'Strings', category: 'Java' },
  { keywords: ['java', 'variable', 'variables'], url: 'https://www.alphacodingskills.com/java/java-variables.php', language: 'Java', topic: 'Variables', category: 'Java' },
  { keywords: ['java', 'array', 'arrays'], url: 'https://www.alphacodingskills.com/java/java-arrays.php', language: 'Java', topic: 'Arrays', category: 'Java' },
  { keywords: ['java', 'loop', 'loops', 'for', 'while'], url: 'https://www.alphacodingskills.com/java/java-loops.php', language: 'Java', topic: 'Loops', category: 'Java' },
  { keywords: ['java', 'method', 'methods'], url: 'https://www.alphacodingskills.com/java/java-methods.php', language: 'Java', topic: 'Methods', category: 'Java' },
  { keywords: ['java', 'class', 'classes', 'oop'], url: 'https://www.alphacodingskills.com/java/java-classes.php', language: 'Java', topic: 'Classes & Objects', category: 'Java' },
  { keywords: ['java', 'inheritance'], url: 'https://www.alphacodingskills.com/java/java-inheritance.php', language: 'Java', topic: 'Inheritance', category: 'Java' },
  { keywords: ['java', 'interface', 'interfaces'], url: 'https://www.alphacodingskills.com/java/java-interface.php', language: 'Java', topic: 'Interface', category: 'Java' },
  { keywords: ['java', 'exception', 'exceptions', 'error'], url: 'https://www.alphacodingskills.com/java/java-exceptions.php', language: 'Java', topic: 'Exceptions', category: 'Java' },

  // C Language Topics
  { keywords: ['c', 'language', 'syntax'], url: 'https://www.alphacodingskills.com/c/c-syntax.php', language: 'C', topic: 'Syntax', category: 'C' },
  { keywords: ['c', 'string', 'strings'], url: 'https://www.alphacodingskills.com/c/c-strings.php', language: 'C', topic: 'Strings', category: 'C' },
  { keywords: ['c', 'variable', 'variables'], url: 'https://www.alphacodingskills.com/c/c-variables.php', language: 'C', topic: 'Variables', category: 'C' },
  { keywords: ['c', 'array', 'arrays'], url: 'https://www.alphacodingskills.com/c/c-arrays.php', language: 'C', topic: 'Arrays', category: 'C' },
  { keywords: ['c', 'pointer', 'pointers'], url: 'https://www.alphacodingskills.com/c/c-pointers.php', language: 'C', topic: 'Pointers', category: 'C' },
  { keywords: ['c', 'function', 'functions'], url: 'https://www.alphacodingskills.com/c/c-functions.php', language: 'C', topic: 'Functions', category: 'C' },
  { keywords: ['c', 'structure', 'structures', 'struct'], url: 'https://www.alphacodingskills.com/c/c-structures.php', language: 'C', topic: 'Structures', category: 'C' },

  // JavaScript Topics
  { keywords: ['javascript', 'js', 'syntax'], url: 'https://www.alphacodingskills.com/javascript/javascript-syntax.php', language: 'JavaScript', topic: 'Syntax', category: 'JavaScript' },
  { keywords: ['javascript', 'js', 'string', 'strings'], url: 'https://www.alphacodingskills.com/javascript/javascript-strings.php', language: 'JavaScript', topic: 'Strings', category: 'JavaScript' },
  { keywords: ['javascript', 'js', 'variable', 'variables'], url: 'https://www.alphacodingskills.com/javascript/javascript-variables.php', language: 'JavaScript', topic: 'Variables', category: 'JavaScript' },
  { keywords: ['javascript', 'js', 'array', 'arrays'], url: 'https://www.alphacodingskills.com/javascript/javascript-arrays.php', language: 'JavaScript', topic: 'Arrays', category: 'JavaScript' },
  { keywords: ['javascript', 'js', 'object', 'objects'], url: 'https://www.alphacodingskills.com/javascript/javascript-objects.php', language: 'JavaScript', topic: 'Objects', category: 'JavaScript' },
  { keywords: ['javascript', 'js', 'function', 'functions'], url: 'https://www.alphacodingskills.com/javascript/javascript-functions.php', language: 'JavaScript', topic: 'Functions', category: 'JavaScript' },
  { keywords: ['javascript', 'js', 'loop', 'loops'], url: 'https://www.alphacodingskills.com/javascript/javascript-loops.php', language: 'JavaScript', topic: 'Loops', category: 'JavaScript' },

  // C++ Topics
  { keywords: ['c++', 'cpp', 'syntax'], url: 'https://www.alphacodingskills.com/cpp/cpp-syntax.php', language: 'C++', topic: 'Syntax', category: 'C++' },
  { keywords: ['c++', 'cpp', 'string', 'strings'], url: 'https://www.alphacodingskills.com/cpp/cpp-strings.php', language: 'C++', topic: 'Strings', category: 'C++' },
  { keywords: ['c++', 'cpp', 'array', 'arrays'], url: 'https://www.alphacodingskills.com/cpp/cpp-arrays.php', language: 'C++', topic: 'Arrays', category: 'C++' },
  { keywords: ['c++', 'cpp', 'vector', 'vectors'], url: 'https://www.alphacodingskills.com/cpp/cpp-vectors.php', language: 'C++', topic: 'Vectors', category: 'C++' },
  { keywords: ['c++', 'cpp', 'class', 'classes'], url: 'https://www.alphacodingskills.com/cpp/cpp-classes.php', language: 'C++', topic: 'Classes', category: 'C++' },
  { keywords: ['c++', 'cpp', 'pointer', 'pointers'], url: 'https://www.alphacodingskills.com/cpp/cpp-pointers.php', language: 'C++', topic: 'Pointers', category: 'C++' },
];

export function findBestMatch(query: string): TopicMapping | null {
  const queryLower = query.toLowerCase();
  const words = queryLower.split(/\s+/);
  
  let bestMatch: TopicMapping | null = null;
  let maxScore = 0;

  for (const mapping of topicMappings) {
    let score = 0;
    
    // Count how many keywords from the mapping appear in the query
    for (const keyword of mapping.keywords) {
      if (words.includes(keyword) || queryLower.includes(keyword)) {
        score++;
      }
    }

    // Bonus points if all keywords match
    if (mapping.keywords.every(kw => words.includes(kw) || queryLower.includes(kw))) {
      score += 5;
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = mapping;
    }
  }

  // Only return a match if we have at least 2 keyword matches
  return maxScore >= 2 ? bestMatch : null;
}

export function getRelatedTopics(language: string): TopicMapping[] {
  return topicMappings.filter(m => m.language.toLowerCase() === language.toLowerCase());
}

export function getAllLanguages(): string[] {
  const languages = new Set(topicMappings.map(m => m.language));
  return Array.from(languages).sort();
}
