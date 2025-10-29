import { findBestMatch, TopicMapping } from './contentMatcher';

export interface ScrapedContent {
  title: string;
  description: string;
  sections: ContentSection[];
  codeExamples: CodeExample[];
  relatedTopics: string[];
  url: string;
  language: string;
  topic: string;
}

export interface ContentSection {
  heading: string;
  content: string;
  type: 'text' | 'list' | 'note';
}

export interface CodeExample {
  title: string;
  code: string;
  language: string;
  output?: string;
  explanation: string;
}

// CORS proxy to fetch content (you can use allorigins or your own proxy)
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

export async function fetchAlphaCodingContent(query: string): Promise<ScrapedContent | null> {
  try {
    // Find the best matching topic
    const match = findBestMatch(query);
    
    if (!match) {
      return null;
    }

    // For now, return structured content based on the match
    // In production, you would scrape the actual page
    return await generateStructuredContent(match);
  } catch (error) {
    console.error('Error fetching AlphaCoding content:', error);
    return null;
  }
}

async function generateStructuredContent(match: TopicMapping): Promise<ScrapedContent> {
  // This generates comprehensive content based on the topic
  const content = getContentByTopic(match.language, match.topic);
  
  return {
    title: `${match.language} ${match.topic}`,
    description: `Learn about ${match.topic} in ${match.language} with detailed explanations and examples`,
    sections: content.sections,
    codeExamples: content.examples,
    relatedTopics: content.related,
    url: match.url,
    language: match.language,
    topic: match.topic,
  };
}

function getContentByTopic(language: string, topic: string): {
  sections: ContentSection[];
  examples: CodeExample[];
  related: string[];
} {
  const key = `${language.toLowerCase()}_${topic.toLowerCase()}`;
  
  const contentDatabase: Record<string, any> = {
    // Python Strings
    'python_strings': {
      sections: [
        {
          heading: 'What are Strings?',
          content: 'In Python, strings are sequences of characters enclosed in quotes. You can use single quotes, double quotes, or triple quotes for multi-line strings.',
          type: 'text' as const,
        },
        {
          heading: 'String Operations',
          content: `• Concatenation: Joining strings together using +
• Repetition: Repeating strings using *
• Indexing: Accessing individual characters using []
• Slicing: Extracting substrings using [start:end]
• Length: Getting string length using len()`,
          type: 'list' as const,
        },
        {
          heading: 'String Methods',
          content: `Python provides many built-in string methods:
• upper() - Convert to uppercase
• lower() - Convert to lowercase
• strip() - Remove whitespace
• split() - Split into list
• replace() - Replace substring
• find() - Find substring position`,
          type: 'list' as const,
        },
      ],
      examples: [
        {
          title: 'Creating Strings',
          code: `# Different ways to create strings
single = 'Hello'
double = "World"
triple = """Multi
line
string"""

print(single)  # Hello
print(double)  # World
print(triple)  # Multi line string`,
          language: 'python',
          explanation: 'Strings can be created using single, double, or triple quotes. Triple quotes allow multi-line strings.',
        },
        {
          title: 'String Operations',
          code: `# Concatenation
greeting = "Hello" + " " + "World"
print(greeting)  # Hello World

# Repetition
echo = "Ha" * 3
print(echo)  # HaHaHa

# Indexing and Slicing
text = "Python"
print(text[0])     # P
print(text[-1])    # n
print(text[0:3])   # Pyt
print(text[2:])    # thon`,
          language: 'python',
          output: `Hello World
HaHaHa
P
n
Pyt
thon`,
          explanation: 'Demonstrates string concatenation, repetition, indexing, and slicing operations.',
        },
        {
          title: 'String Methods',
          code: `name = "  Python Programming  "

# Case conversion
print(name.upper())      # "  PYTHON PROGRAMMING  "
print(name.lower())      # "  python programming  "

# Whitespace removal
print(name.strip())      # "Python Programming"
print(name.lstrip())     # "Python Programming  "

# Splitting and joining
words = name.strip().split()
print(words)             # ['Python', 'Programming']
print("-".join(words))   # "Python-Programming"

# Finding and replacing
text = "Hello World"
print(text.find("World"))      # 6
print(text.replace("World", "Python"))  # "Hello Python"`,
          language: 'python',
          output: `  PYTHON PROGRAMMING  
  python programming  
Python Programming
Python Programming  
['Python', 'Programming']
Python-Programming
6
Hello Python`,
          explanation: 'Shows common string methods for case conversion, whitespace handling, splitting, and searching.',
        },
      ],
      related: ['Python Lists', 'Python Variables', 'Python Functions'],
    },

    // Java Strings
    'java_strings': {
      sections: [
        {
          heading: 'What are Strings in Java?',
          content: 'In Java, String is a class that represents a sequence of characters. Strings are immutable, meaning once created, their values cannot be changed.',
          type: 'text' as const,
        },
        {
          heading: 'String Declaration',
          content: `Strings can be created in two ways:
• Using string literals: String str = "Hello";
• Using new keyword: String str = new String("Hello");
• String literals are stored in the string pool for memory efficiency`,
          type: 'list' as const,
        },
        {
          heading: 'Important String Methods',
          content: `• length() - Returns string length
• charAt(index) - Returns character at index
• substring(start, end) - Extracts substring
• concat(str) - Concatenates strings
• equals(str) - Compares strings
• toUpperCase() / toLowerCase() - Case conversion
• trim() - Removes whitespace
• split(regex) - Splits into array`,
          type: 'list' as const,
        },
      ],
      examples: [
        {
          title: 'Creating and Using Strings',
          code: `public class StringExample {
    public static void main(String[] args) {
        // String declaration
        String greeting = "Hello";
        String name = new String("World");
        
        // String concatenation
        String message = greeting + " " + name;
        System.out.println(message);  // Hello World
        
        // String length
        System.out.println(message.length());  // 11
        
        // Character at index
        System.out.println(message.charAt(0));  // H
    }
}`,
          language: 'java',
          output: `Hello World
11
H`,
          explanation: 'Demonstrates basic string creation, concatenation, and accessing string properties.',
        },
        {
          title: 'String Methods',
          code: `public class StringMethods {
    public static void main(String[] args) {
        String text = "  Java Programming  ";
        
        // Trim whitespace
        System.out.println(text.trim());  // "Java Programming"
        
        // Case conversion
        System.out.println(text.toUpperCase());  // "  JAVA PROGRAMMING  "
        System.out.println(text.toLowerCase());  // "  java programming  "
        
        // Substring
        String java = text.trim();
        System.out.println(java.substring(0, 4));  // "Java"
        
        // String comparison
        String str1 = "Hello";
        String str2 = "Hello";
        System.out.println(str1.equals(str2));  // true
        System.out.println(str1 == str2);        // true (string pool)
    }
}`,
          language: 'java',
          output: `Java Programming
  JAVA PROGRAMMING  
  java programming  
Java
true
true`,
          explanation: 'Shows common string methods including trim, case conversion, substring, and comparison.',
        },
      ],
      related: ['Java Arrays', 'Java Methods', 'Java Classes'],
    },

    // Java Syntax
    'java_syntax': {
      sections: [
        {
          heading: 'Java Program Structure',
          content: 'Every Java program consists of at least one class. The main method serves as the entry point of the program. Java is case-sensitive and follows strict syntax rules.',
          type: 'text' as const,
        },
        {
          heading: 'Basic Syntax Rules',
          content: `• Every statement ends with semicolon (;)
• Code blocks are enclosed in curly braces { }
• Java is case-sensitive
• Class names start with uppercase letter
• Method names start with lowercase letter
• File name must match public class name`,
          type: 'list' as const,
        },
        {
          heading: 'Comments',
          content: `• Single-line: // comment
• Multi-line: /* comment */
• Documentation: /** JavaDoc comment */`,
          type: 'list' as const,
        },
      ],
      examples: [
        {
          title: 'Basic Java Program',
          code: `// This is a single-line comment

/*
 * This is a multi-line comment
 * explaining the program structure
 */

public class HelloWorld {
    // Main method - entry point
    public static void main(String[] args) {
        // Print to console
        System.out.println("Hello, World!");
        
        // Variables
        int number = 42;
        String text = "Java";
        
        System.out.println(number);
        System.out.println(text);
    }
}`,
          language: 'java',
          output: `Hello, World!
42
Java`,
          explanation: 'Shows the basic structure of a Java program with comments, class declaration, and main method.',
        },
      ],
      related: ['Java Introduction', 'Java Variables', 'Java Methods'],
    },

    // C Language Syntax
    'c_syntax': {
      sections: [
        {
          heading: 'C Program Structure',
          content: 'A C program consists of functions, with main() being the entry point. Programs must include necessary header files using #include directives.',
          type: 'text' as const,
        },
        {
          heading: 'Basic Syntax Elements',
          content: `• Preprocessor directives start with #
• Statements end with semicolon (;)
• Code blocks use curly braces { }
• Case-sensitive language
• Comments: // single-line or /* multi-line */`,
          type: 'list' as const,
        },
      ],
      examples: [
        {
          title: 'Basic C Program',
          code: `#include <stdio.h>

// Main function
int main() {
    // Variable declaration
    int number = 10;
    char letter = 'A';
    float pi = 3.14;
    
    // Output
    printf("Number: %d\\n", number);
    printf("Letter: %c\\n", letter);
    printf("Pi: %.2f\\n", pi);
    
    return 0;
}`,
          language: 'c',
          output: `Number: 10
Letter: A
Pi: 3.14`,
          explanation: 'Demonstrates basic C syntax including headers, main function, variables, and printf statements.',
        },
      ],
      related: ['C Variables', 'C Functions', 'C Pointers'],
    },
  };

  return contentDatabase[key] || {
    sections: [
      {
        heading: 'Overview',
        content: `This topic covers ${topic} in ${language}. Visit the full tutorial for detailed information and interactive examples.`,
        type: 'text' as const,
      },
    ],
    examples: [],
    related: [],
  };
}
