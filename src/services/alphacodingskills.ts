export interface AlphaCodingArticle {
  title: string;
  content: string;
  url: string;
  category: string;
  language: string;
  sections: ArticleSection[];
  examples: CodeExample[];
  relatedTopics: RelatedTopic[];
}

export interface ArticleSection {
  heading: string;
  content: string;
  code?: string;
  language?: string;
}

export interface CodeExample {
  title: string;
  code: string;
  language: string;
  explanation: string;
  output?: string;
}

export interface RelatedTopic {
  title: string;
  slug: string;
  description: string;
}

const topicMap: Record<string, { path: string; language: string }> = {
  // Programming Languages
  'python': { path: 'python', language: 'python' },
  'java': { path: 'java', language: 'java' },
  'javascript': { path: 'javascript', language: 'javascript' },
  'js': { path: 'javascript', language: 'javascript' },
  'typescript': { path: 'javascript', language: 'typescript' },
  'c++': { path: 'cpp', language: 'cpp' },
  'cpp': { path: 'cpp', language: 'cpp' },
  'c': { path: 'c', language: 'c' },
  'c#': { path: 'csharp', language: 'csharp' },
  'csharp': { path: 'csharp', language: 'csharp' },
  'ruby': { path: 'ruby', language: 'ruby' },
  'php': { path: 'php', language: 'php' },
  'swift': { path: 'swift', language: 'swift' },
  'kotlin': { path: 'kotlin', language: 'kotlin' },
  'go': { path: 'go', language: 'go' },
  'golang': { path: 'go', language: 'go' },
  'rust': { path: 'rust', language: 'rust' },
  'scala': { path: 'scala', language: 'scala' },
  'perl': { path: 'perl', language: 'perl' },
  'r': { path: 'r', language: 'r' },
  'matlab': { path: 'matlab', language: 'matlab' },
  
  // Web Technologies
  'html': { path: 'html', language: 'html' },
  'css': { path: 'css', language: 'css' },
  'sql': { path: 'sql', language: 'sql' },
  'mysql': { path: 'mysql', language: 'sql' },
  'postgresql': { path: 'postgresql', language: 'sql' },
  
  // Data Structures & Algorithms
  'algorithm': { path: 'algorithm', language: 'pseudocode' },
  'algorithms': { path: 'algorithm', language: 'pseudocode' },
  'data structure': { path: 'ds', language: 'pseudocode' },
  'data structures': { path: 'ds', language: 'pseudocode' },
};

export async function extractAlphaCodingArticle(query: string): Promise<AlphaCodingArticle | null> {
  try {
    const queryLower = query.toLowerCase();
    let topicInfo: { path: string; language: string } | null = null;

    // Find matching topic
    for (const [key, info] of Object.entries(topicMap)) {
      if (queryLower.includes(key)) {
        topicInfo = info;
        break;
      }
    }

    if (!topicInfo) {
      return null;
    }

    const baseUrl = 'https://www.alphacodingskills.com';
    const fullUrl = `${baseUrl}/${topicInfo.path}/index.php`;

    // Create comprehensive article content
    const article: AlphaCodingArticle = {
      title: `${capitalizeFirst(topicInfo.language)} Programming Tutorial - AlphaCodingSkills`,
      content: `Complete guide and interactive tutorials for ${capitalizeFirst(topicInfo.language)} programming. Learn from basics to advanced concepts with practical examples.`,
      url: fullUrl,
      category: 'Programming Tutorial',
      language: topicInfo.language,
      sections: generateSections(topicInfo.language, query),
      examples: generateExamples(topicInfo.language),
      relatedTopics: generateRelatedTopics(topicInfo.language),
    };

    return article;
  } catch (error) {
    console.error('Error creating AlphaCoding article:', error);
    return null;
  }
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateSections(language: string, query: string): ArticleSection[] {
  const sections: ArticleSection[] = [
    {
      heading: 'Introduction',
      content: `AlphaCodingSkills provides comprehensive ${language} programming tutorials with interactive examples and detailed explanations. This resource is designed for both beginners and experienced developers looking to enhance their ${language} skills.`,
    },
    {
      heading: 'What You Will Learn',
      content: `Fundamentals: Basic syntax, data types, and variables

Control Flow: Conditional statements and loops

Functions: Creating and using functions/methods

Object-Oriented Programming: Classes, objects, and inheritance

Advanced Topics: Decorators, generators, async programming

Best Practices: Code optimization and design patterns

Practical Projects: Real-world applications and examples`,
    },
    {
      heading: 'Interactive Learning',
      content: `The AlphaCodingSkills platform offers:

Live Code Editor: Write and run code directly in your browser

Step-by-Step Examples: Detailed explanations with code samples

Practice Exercises: Test your knowledge with coding challenges

Visual Diagrams: Understand concepts through visual representations

Quiz Questions: Self-assessment to track your progress`,
    },
    {
      heading: 'Topics Covered',
      content: getTopicsByLanguage(language),
    },
    {
      heading: 'Why Choose AlphaCodingSkills',
      content: `Free Access: All tutorials and examples are completely free

Comprehensive Coverage: From basics to advanced topics

Interactive Examples: Run code directly in your browser

Practical Focus: Real-world examples and use cases

Mobile Friendly: Learn on any device, anywhere

Regular Updates: Content updated with latest standards`,
    },
  ];

  return sections;
}

function getTopicsByLanguage(language: string): string {
  const commonTopics: Record<string, string> = {
    python: `• Python Installation and Setup
• Variables and Data Types
• Operators and Expressions
• Control Flow (if, elif, else)
• Loops (for, while)
• Functions and Lambda
• Lists, Tuples, Sets, Dictionaries
• String Manipulation
• File Handling
• Object-Oriented Programming
• Modules and Packages
• Exception Handling
• Regular Expressions
• Database Connectivity
• Web Scraping
• GUI Programming`,
    
    java: `• Java Environment Setup
• Variables and Data Types
• Operators
• Control Statements
• Arrays and Strings
• Methods
• Object-Oriented Concepts
• Inheritance and Polymorphism
• Interfaces and Abstract Classes
• Exception Handling
• Collections Framework
• File I/O
• Multithreading
• JDBC Database Connectivity
• JavaFX GUI
• Design Patterns`,
    
    javascript: `• JavaScript Basics
• Variables (var, let, const)
• Data Types
• Operators
• Control Flow
• Functions and Arrow Functions
• Arrays and Objects
• DOM Manipulation
• Events and Event Handling
• Promises and Async/Await
• ES6+ Features
• Closures and Scope
• Prototypes and Inheritance
• JSON and AJAX
• Modules
• Error Handling`,
  };

  return commonTopics[language] || `• Fundamentals and Syntax
• Data Types and Variables
• Control Structures
• Functions and Methods
• Object-Oriented Programming
• Error Handling
• Advanced Topics
• Best Practices`;
}

function generateExamples(language: string): CodeExample[] {
  const examples: Record<string, CodeExample[]> = {
    python: [
      {
        title: 'Hello World',
        code: `# Python Hello World
print("Hello, World!")

# Variables and Data Types
name = "Gigabase"
version = 1.0
is_active = True

print(f"Welcome to {name} v{version}")`,
        language: 'python',
        explanation: 'Basic Python syntax including print statements, variables, and string formatting.',
      },
      {
        title: 'Functions and Loops',
        code: `# Function definition
def greet(name):
    return f"Hello, {name}!"

# List iteration
names = ["Alice", "Bob", "Charlie"]
for name in names:
    print(greet(name))

# List comprehension
squares = [x**2 for x in range(1, 6)]
print(squares)  # [1, 4, 9, 16, 25]`,
        language: 'python',
        explanation: 'Demonstrates functions, loops, and list comprehensions in Python.',
      },
    ],
    java: [
      {
        title: 'Hello World',
        code: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Variables
        String name = "Gigabase";
        double version = 1.0;
        boolean isActive = true;
        
        System.out.println("Welcome to " + name + " v" + version);
    }
}`,
        language: 'java',
        explanation: 'Basic Java program structure with main method and variables.',
      },
    ],
    javascript: [
      {
        title: 'Hello World',
        code: `// JavaScript Hello World
console.log("Hello, World!");

// Variables
const name = "Gigabase";
let version = 1.0;
var isActive = true;

console.log(\`Welcome to \${name} v\${version}\`);

// Arrow Function
const greet = (name) => \`Hello, \${name}!\`;
console.log(greet("Developer"));`,
        language: 'javascript',
        explanation: 'Modern JavaScript with const/let, template literals, and arrow functions.',
      },
    ],
  };

  return examples[language] || [];
}

function generateRelatedTopics(language: string): RelatedTopic[] {
  const relatedTopics: Record<string, RelatedTopic[]> = {
    python: [
      { title: 'Python Introduction', slug: 'python-introduction', description: 'Getting started with Python programming' },
      { title: 'Python Syntax', slug: 'python-syntax', description: 'Learn Python syntax and basic structure' },
      { title: 'Python Variables', slug: 'python-variables', description: 'Understanding variables and data types' },
      { title: 'Python Functions', slug: 'python-functions', description: 'Creating and using functions' },
      { title: 'Python Classes', slug: 'python-classes', description: 'Object-oriented programming in Python' },
    ],
    java: [
      { title: 'Java Introduction', slug: 'java-introduction', description: 'Getting started with Java programming' },
      { title: 'Java Syntax', slug: 'java-syntax', description: 'Learn Java syntax and basic structure' },
      { title: 'Java Variables', slug: 'java-variables', description: 'Understanding variables and data types' },
      { title: 'Java Methods', slug: 'java-methods', description: 'Creating and using methods' },
      { title: 'Java Classes', slug: 'java-classes', description: 'Object-oriented programming in Java' },
    ],
    javascript: [
      { title: 'JavaScript Introduction', slug: 'javascript-introduction', description: 'Getting started with JavaScript' },
      { title: 'JavaScript Syntax', slug: 'javascript-syntax', description: 'Learn JavaScript syntax and basic structure' },
      { title: 'JavaScript Variables', slug: 'javascript-variables', description: 'Understanding var, let, and const' },
      { title: 'JavaScript Functions', slug: 'javascript-functions', description: 'Functions and arrow functions' },
      { title: 'JavaScript Objects', slug: 'javascript-objects', description: 'Working with objects and classes' },
    ],
  };

  return relatedTopics[language] || [];
}

export function isCodeRelatedQuery(query: string): boolean {
  const queryLower = query.toLowerCase();
  const codeKeywords = Object.keys(topicMap);
  
  return codeKeywords.some(keyword => queryLower.includes(keyword)) ||
    queryLower.includes('code') ||
    queryLower.includes('programming') ||
    queryLower.includes('function') ||
    queryLower.includes('class') ||
    queryLower.includes('algorithm');
}
