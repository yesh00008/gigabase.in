// ArXiv API Service
const ARXIV_BASE_URL = "https://export.arxiv.org/api/query";

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export interface ArXivPaper {
  id: string;
  title: string;
  summary: string;
  authors: string[];
  published: string;
  link: string;
  pdf_link: string;
  categories: string[];
}

export const searchArXiv = async (query: string): Promise<ArXivPaper[]> => {
  const cacheKey = `arxiv_${query}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `${ARXIV_BASE_URL}?search_query=all:${encodeURIComponent(query)}&start=0&max_results=5&sortBy=relevance&sortOrder=descending`
    );
    
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");
    
    const entries = Array.from(xml.querySelectorAll("entry"));
    const papers: ArXivPaper[] = entries.map((entry) => {
      const id = entry.querySelector("id")?.textContent || "";
      const title = entry.querySelector("title")?.textContent?.trim() || "";
      const summary = entry.querySelector("summary")?.textContent?.trim() || "";
      const published = entry.querySelector("published")?.textContent || "";
      const authors = Array.from(entry.querySelectorAll("author name")).map(
        (node) => node.textContent || ""
      );
      const categories = Array.from(entry.querySelectorAll("category")).map(
        (cat) => cat.getAttribute("term") || ""
      );
      
      return {
        id,
        title,
        summary,
        authors,
        published,
        link: id,
        pdf_link: id.replace("/abs/", "/pdf/"),
        categories,
      };
    });
    
    cache.set(cacheKey, { data: papers, timestamp: Date.now() });
    return papers;
  } catch (error) {
    console.error("ArXiv API error:", error);
    return [];
  }
};
