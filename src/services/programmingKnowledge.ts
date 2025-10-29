export interface ProgrammingResource {
  url: string;
  title: string;
  category: string;
  description: string;
}

export const programmingResources: ProgrammingResource[] = [
  // Awesome Lists (1-10)
  { url: "https://github.com/sindresorhus/awesome", title: "Awesome", category: "Awesome Lists", description: "📚 The ultimate awesome list of awesome lists (350k+ stars)" },
  { url: "https://github.com/bayandin/awesome-awesomeness", title: "Awesome Awesomeness", category: "Awesome Lists", description: "Curated list of awesome lists" },
  { url: "https://github.com/awesome-selfhosted/awesome-selfhosted", title: "Awesome Self-hosted", category: "Awesome Lists", description: "Self-hosted software" },
  { url: "https://github.com/trimstray/the-book-of-secret-knowledge", title: "The Book of Secret Knowledge", category: "Awesome Lists", description: "Collection of inspiring lists, manuals, cheatsheets" },
  { url: "https://github.com/avelino/awesome-go", title: "Awesome Go", category: "Awesome Lists", description: "Go frameworks, libraries and software" },
  { url: "https://github.com/vinta/awesome-python", title: "Awesome Python", category: "Awesome Lists", description: "Python frameworks, libraries, software and resources" },
  { url: "https://github.com/sorrycc/awesome-javascript", title: "Awesome JavaScript", category: "Awesome Lists", description: "JavaScript resources" },
  { url: "https://github.com/enaqx/awesome-react", title: "Awesome React", category: "Awesome Lists", description: "React resources" },
  { url: "https://github.com/vuejs/awesome-vue", title: "Awesome Vue", category: "Awesome Lists", description: "Vue.js resources" },
  { url: "https://github.com/akullpp/awesome-java", title: "Awesome Java", category: "Awesome Lists", description: "Java frameworks and libraries" },

  // Algorithm & Data Structures (11-30)
  { url: "https://github.com/TheAlgorithms/Python", title: "The Algorithms - Python", category: "Algorithms & DS", description: "All Algorithms implemented in Python" },
  { url: "https://github.com/TheAlgorithms/Java", title: "The Algorithms - Java", category: "Algorithms & DS", description: "All Algorithms implemented in Java" },
  { url: "https://github.com/TheAlgorithms/C-Plus-Plus", title: "The Algorithms - C++", category: "Algorithms & DS", description: "Algorithms in C++" },
  { url: "https://github.com/TheAlgorithms/JavaScript", title: "The Algorithms - JavaScript", category: "Algorithms & DS", description: "Algorithms in JavaScript" },
  { url: "https://github.com/TheAlgorithms/Go", title: "The Algorithms - Go", category: "Algorithms & DS", description: "Algorithms in Go" },
  { url: "https://github.com/TheAlgorithms/Rust", title: "The Algorithms - Rust", category: "Algorithms & DS", description: "Algorithms in Rust" },
  { url: "https://github.com/TheAlgorithms/C", title: "The Algorithms - C", category: "Algorithms & DS", description: "Algorithms in C" },
  { url: "https://github.com/TheAlgorithms/C-Sharp", title: "The Algorithms - C#", category: "Algorithms & DS", description: "Algorithms in C#" },
  { url: "https://github.com/TheAlgorithms/Ruby", title: "The Algorithms - Ruby", category: "Algorithms & DS", description: "Algorithms in Ruby" },
  { url: "https://github.com/trekhleb/javascript-algorithms", title: "JavaScript Algorithms", category: "Algorithms & DS", description: "Algorithms and data structures in JavaScript (190k+ stars)" },
  { url: "https://github.com/kdn251/interviews", title: "Interviews", category: "Algorithms & DS", description: "Everything you need to prepare for technical interviews" },
  { url: "https://github.com/jwasham/coding-interview-university", title: "Coding Interview University", category: "Algorithms & DS", description: "Complete computer science study plan" },
  { url: "https://github.com/yangshun/tech-interview-handbook", title: "Tech Interview Handbook", category: "Algorithms & DS", description: "Curated coding interview preparation materials" },
  { url: "https://github.com/donnemartin/system-design-primer", title: "System Design Primer", category: "Algorithms & DS", description: "Learn system design (270k+ stars)" },
  { url: "https://github.com/SarkerMushfiq/Data-Structure-and-Algorithms", title: "Data Structure and Algorithms", category: "Algorithms & DS", description: "Comprehensive DSA guide" },
  { url: "https://github.com/sachuverma/DataStructures-Algorithms", title: "DataStructures-Algorithms", category: "Algorithms & DS", description: "DSA resources and solutions" },
  { url: "https://github.com/jeffdiers/coding-interview-problems", title: "Coding Interview Problems", category: "Algorithms & DS", description: "Coding interview problems categorized" },
  { url: "https://github.com/mission-peace/interview", title: "Interview", category: "Algorithms & DS", description: "Interview questions implementation" },
  { url: "https://github.com/MaximAbramchuck/awesome-interview-questions", title: "Awesome Interview Questions", category: "Algorithms & DS", description: "List of interview questions" },
  { url: "https://github.com/checkcheckzz/system-design-interview", title: "System Design Interview", category: "Algorithms & DS", description: "System design interview questions" },
];

export interface AlphaCodingSkillsAnswer {
  question: string;
  answer: string;
  code?: string;
  language?: string;
}

export async function searchAlphaCodingSkills(query: string): Promise<AlphaCodingSkillsAnswer | null> {
  try {
    // For now, return a placeholder since we can't directly scrape without a CORS proxy
    // In production, you'd need a backend proxy to fetch this content
    return {
      question: query,
      answer: "AlphaCodingSkills integration requires a backend proxy to fetch content due to CORS restrictions. Please implement a backend API endpoint to fetch and parse the content.",
      code: "// Example code would be fetched from AlphaCodingSkills",
      language: "javascript"
    };
  } catch (error) {
    console.error("Error fetching from AlphaCodingSkills:", error);
    return null;
  }
}

export function searchProgrammingKnowledge(query: string): ProgrammingResource[] {
  const lowerQuery = query.toLowerCase();
  return programmingResources.filter(resource =>
    resource.title.toLowerCase().includes(lowerQuery) ||
    resource.description.toLowerCase().includes(lowerQuery) ||
    resource.category.toLowerCase().includes(lowerQuery)
  );
}

export function getProgrammingResourcesByCategory(category: string): ProgrammingResource[] {
  return programmingResources.filter(resource => resource.category === category);
}

export function getAllCategories(): string[] {
  const categories = new Set(programmingResources.map(r => r.category));
  return Array.from(categories);
}

export function getAllProgrammingResources(): ProgrammingResource[] {
  return programmingResources;
}
