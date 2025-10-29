// Advanced Content Extraction Service with Smart Algorithms

import { MatchedContent, CodeSnippet, ContentSection } from './advancedContentMatcher';

// Advanced search algorithms
export class SearchAlgorithm {
  // TF-IDF (Term Frequency-Inverse Document Frequency) scoring
  static calculateTFIDF(query: string, content: string, allContents: string[]): number {
    const queryTerms = query.toLowerCase().split(/\s+/);
    let score = 0;

    queryTerms.forEach(term => {
      // Term Frequency
      const tf = (content.toLowerCase().match(new RegExp(term, 'g')) || []).length / content.split(/\s+/).length;
      
      // Inverse Document Frequency
      const docsWithTerm = allContents.filter(doc => doc.toLowerCase().includes(term)).length;
      const idf = Math.log(allContents.length / (docsWithTerm || 1));
      
      score += tf * idf;
    });

    return score;
  }

  // BM25 ranking algorithm (used by search engines)
  static calculateBM25(query: string, content: string, avgDocLength: number, k1 = 1.5, b = 0.75): number {
    const queryTerms = query.toLowerCase().split(/\s+/);
    const contentTerms = content.toLowerCase().split(/\s+/);
    const docLength = contentTerms.length;
    let score = 0;

    queryTerms.forEach(term => {
      const termFreq = contentTerms.filter(t => t === term).length;
      const numerator = termFreq * (k1 + 1);
      const denominator = termFreq + k1 * (1 - b + b * (docLength / avgDocLength));
      score += (numerator / denominator);
    });

    return score;
  }

  // Semantic similarity using word embeddings simulation
  static calculateSemanticSimilarity(query: string, content: string): number {
    const queryWords = new Set(query.toLowerCase().split(/\s+/));
    const contentWords = new Set(content.toLowerCase().split(/\s+/));
    
    // Jaccard similarity
    const intersection = new Set([...queryWords].filter(x => contentWords.has(x)));
    const union = new Set([...queryWords, ...contentWords]);
    
    return intersection.size / union.size;
  }

  // N-gram matching for partial word matches
  static nGramSimilarity(str1: string, str2: string, n = 3): number {
    const getNGrams = (str: string, size: number): Set<string> => {
      const ngrams = new Set<string>();
      for (let i = 0; i <= str.length - size; i++) {
        ngrams.add(str.slice(i, i + size));
      }
      return ngrams;
    };

    const ngrams1 = getNGrams(str1.toLowerCase(), n);
    const ngrams2 = getNGrams(str2.toLowerCase(), n);
    
    const intersection = new Set([...ngrams1].filter(x => ngrams2.has(x)));
    const union = new Set([...ngrams1, ...ngrams2]);
    
    return intersection.size / union.size;
  }
}

// Enhanced content extractor with intelligent parsing
export class AdvancedContentExtractor {
  // Extract structured content from HTML
  static extractStructuredContent(html: string, url: string): MatchedContent | null {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    if (!doc) return null;

    const title = this.extractTitle(doc);
    const sections = this.extractSections(doc);
    const codeSnippets = this.extractCodeSnippets(doc);
    const metadata = this.extractMetadata(doc);
    const topics = this.extractTopics(doc);
    
    // Determine source from URL
    let source = 'Unknown';
    if (url.includes('alphacodingskills.com')) source = 'AlphaCodingSkills';
    else if (url.includes('geeksforgeeks.org')) source = 'GeeksForGeeks';
    else if (url.includes('leetcode.com')) source = 'LeetCode';
    else if (url.includes('w3schools.com')) source = 'W3Schools';
    else if (url.includes('tutorialspoint.com')) source = 'TutorialsPoint';
    else if (url.includes('javatpoint.com')) source = 'JavaTPoint';

    return {
      title: title || 'Untitled',
      content: this.extractMainContent(doc),
      source,
      url,
      code: codeSnippets,
      sections,
      topics,
      relevanceScore: 0,
      metadata
    };
  }

  private static extractTitle(doc: Document): string {
    const h1 = doc.querySelector('h1');
    const title = doc.querySelector('title');
    const metaTitle = doc.querySelector('meta[property="og:title"]');
    
    return (
      h1?.textContent?.trim() ||
      (metaTitle as HTMLMetaElement)?.content?.trim() ||
      title?.textContent?.trim() ||
      'Untitled Article'
    );
  }

  private static extractMainContent(doc: Document): string {
    // Try multiple selectors for main content
    const selectors = [
      'article',
      '[role="main"]',
      '.main-content',
      '.article-content',
      '.post-content',
      '.entry-content',
      '#content',
      'main'
    ];

    for (const selector of selectors) {
      const element = doc.querySelector(selector);
      if (element) {
        // Remove scripts, styles, ads
        const clone = element.cloneNode(true) as HTMLElement;
        clone.querySelectorAll('script, style, .ad, .advertisement, nav, aside').forEach(el => el.remove());
        
        const text = clone.textContent || '';
        if (text.length > 100) {
          return text.trim().slice(0, 500);
        }
      }
    }

    return doc.body?.textContent?.trim().slice(0, 500) || '';
  }

  private static extractSections(doc: Document): ContentSection[] {
    const sections: ContentSection[] = [];
    const headings = doc.querySelectorAll('h2, h3, h4');

    headings.forEach((heading) => {
      const headingText = heading.textContent?.trim() || '';
      if (!headingText) return;

      let content = '';
      let currentElement = heading.nextElementSibling;
      
      // Collect content until next heading
      while (currentElement && !currentElement.matches('h2, h3, h4')) {
        if (currentElement.matches('p, div, span, li')) {
          content += currentElement.textContent?.trim() + '\n';
        }
        currentElement = currentElement.nextElementSibling;
      }

      if (content.trim()) {
        const type = this.determineContentType(content, currentElement);
        sections.push({
          heading: headingText,
          content: content.trim(),
          type
        });
      }
    });

    return sections;
  }

  private static determineContentType(content: string, element: Element | null): 'text' | 'list' | 'table' | 'note' {
    if (element?.querySelector('ul, ol')) return 'list';
    if (element?.querySelector('table')) return 'table';
    if (content.toLowerCase().includes('note:') || content.toLowerCase().includes('important:')) return 'note';
    return 'text';
  }

  private static extractCodeSnippets(doc: Document): CodeSnippet[] {
    const snippets: CodeSnippet[] = [];
    
    // Common code block selectors
    const codeBlocks = doc.querySelectorAll('pre code, .code-block, .snippet, .highlight, pre');

    codeBlocks.forEach((block, index) => {
      const code = block.textContent?.trim() || '';
      if (code.length < 10) return; // Skip very short snippets

      // Detect language
      const language = this.detectLanguage(block, code);
      
      // Find explanation (usually in nearby p tag or comment)
      const explanation = this.findExplanation(block);
      
      // Find output (usually after "Output:" text)
      const output = this.findOutput(block);

      // Find title (usually in preceding heading or caption)
      const title = this.findCodeTitle(block) || `Code Example ${snippets.length + 1}`;

      snippets.push({
        code,
        language,
        explanation,
        output,
        title
      });
    });

    return snippets;
  }

  private static detectLanguage(element: Element, code: string): string {
    // Check class names
    const className = element.className;
    const languageMatch = className.match(/language-(\w+)|lang-(\w+)|(\w+)-code/);
    if (languageMatch) {
      return languageMatch[1] || languageMatch[2] || languageMatch[3];
    }

    // Detect from code patterns
    if (code.includes('def ') && code.includes(':')) return 'python';
    if (code.includes('function') || code.includes('=>')) return 'javascript';
    if (code.includes('public class') || code.includes('public static void')) return 'java';
    if (code.includes('#include') || code.includes('printf')) return 'c';
    if (code.includes('std::') || code.includes('cout <<')) return 'cpp';
    if (code.includes('SELECT') && code.includes('FROM')) return 'sql';
    if (code.includes('<?php')) return 'php';
    if (code.includes('<html') || code.includes('<div')) return 'html';
    if (code.includes('{') && code.includes('}') && code.includes(';')) return 'javascript';

    return 'text';
  }

  private static findExplanation(codeBlock: Element): string | undefined {
    // Look for explanation in nearby elements
    let current = codeBlock.nextElementSibling;
    let attempts = 0;
    
    while (current && attempts < 3) {
      if (current.matches('p, .explanation, .note')) {
        const text = current.textContent?.trim();
        if (text && text.length > 20 && text.length < 500) {
          return text;
        }
      }
      current = current.nextElementSibling;
      attempts++;
    }

    // Check previous elements
    current = codeBlock.previousElementSibling;
    attempts = 0;
    
    while (current && attempts < 2) {
      if (current.matches('p')) {
        const text = current.textContent?.trim();
        if (text && text.length > 20 && text.length < 300) {
          return text;
        }
      }
      current = current.previousElementSibling;
      attempts++;
    }

    return undefined;
  }

  private static findOutput(codeBlock: Element): string | undefined {
    let current = codeBlock.nextElementSibling;
    let attempts = 0;
    
    while (current && attempts < 5) {
      const text = current.textContent?.trim() || '';
      if (text.toLowerCase().includes('output:') || 
          text.toLowerCase().includes('result:') ||
          current.matches('.output, .result')) {
        const outputText = text.replace(/^(output:|result:)/i, '').trim();
        if (outputText.length > 0 && outputText.length < 500) {
          return outputText;
        }
      }
      current = current.nextElementSibling;
      attempts++;
    }

    return undefined;
  }

  private static findCodeTitle(codeBlock: Element): string | undefined {
    // Check previous heading
    let current = codeBlock.previousElementSibling;
    let attempts = 0;
    
    while (current && attempts < 3) {
      if (current.matches('h1, h2, h3, h4, h5, h6, .code-title, figcaption')) {
        const title = current.textContent?.trim();
        if (title && title.length > 0 && title.length < 100) {
          return title;
        }
      }
      current = current.previousElementSibling;
      attempts++;
    }

    return undefined;
  }

  private static extractMetadata(doc: Document): MatchedContent['metadata'] {
    const metadata: MatchedContent['metadata'] = {};

    // Extract author
    const authorMeta = doc.querySelector('meta[name="author"]') as HTMLMetaElement;
    const authorElement = doc.querySelector('.author, [itemprop="author"]');
    metadata.author = authorMeta?.content || authorElement?.textContent?.trim();

    // Extract last updated
    const updatedMeta = doc.querySelector('meta[property="article:modified_time"]') as HTMLMetaElement;
    const timeElement = doc.querySelector('time[datetime]') as HTMLTimeElement;
    metadata.lastUpdated = updatedMeta?.content || timeElement?.dateTime;

    // Estimate difficulty
    metadata.difficulty = this.estimateDifficulty(doc);

    // Estimate read time
    const wordCount = doc.body.textContent?.split(/\s+/).length || 0;
    const minutes = Math.ceil(wordCount / 200);
    metadata.readTime = `${minutes} min read`;

    return metadata;
  }

  private static estimateDifficulty(doc: Document): 'beginner' | 'intermediate' | 'advanced' {
    const text = doc.body.textContent?.toLowerCase() || '';
    
    const advancedKeywords = ['advanced', 'complex', 'optimization', 'algorithm', 'concurrent', 'asynchronous'];
    const beginnerKeywords = ['introduction', 'basic', 'beginner', 'tutorial', 'getting started', 'hello world'];
    
    const advancedCount = advancedKeywords.filter(k => text.includes(k)).length;
    const beginnerCount = beginnerKeywords.filter(k => text.includes(k)).length;
    
    if (advancedCount > beginnerCount) return 'advanced';
    if (beginnerCount > 0) return 'beginner';
    return 'intermediate';
  }

  private static extractTopics(doc: Document): string[] {
    const topics = new Set<string>();
    
    // Extract from meta keywords
    const keywordsMeta = doc.querySelector('meta[name="keywords"]') as HTMLMetaElement;
    if (keywordsMeta?.content) {
      keywordsMeta.content.split(',').forEach(k => topics.add(k.trim()));
    }

    // Extract from tags/categories
    doc.querySelectorAll('.tag, .category, [rel="tag"]').forEach(el => {
      const text = el.textContent?.trim();
      if (text) topics.add(text);
    });

    // Extract from headings (potential topics)
    doc.querySelectorAll('h2, h3').forEach((heading, index) => {
      if (index < 5) { // Limit to first 5 headings
        const text = heading.textContent?.trim();
        if (text && text.length < 50) topics.add(text);
      }
    });

    return Array.from(topics).slice(0, 10);
  }
}

// CORS proxy fetcher with fallback and error handling
async function fetchWithProxy(url: string): Promise<string> {
  // Try multiple CORS proxies in order with updated, more reliable proxies
  const proxies = [
    // AllOrigins - Most reliable
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    // Codetabs - Backup option
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    // ThingProxy - Third option
    `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(url)}`,
    // CORS Anywhere (public instances)
    `https://cors-anywhere.herokuapp.com/${url}`
  ];

  let lastError: any = null;

  for (let i = 0; i < proxies.length; i++) {
    const proxyUrl = proxies[i];
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const text = await response.text();
        if (text && text.length > 100) { // Ensure we got actual content
          console.log(`Successfully fetched via proxy ${i + 1}`);
          return text;
        }
      }
      
      lastError = `Proxy returned status ${response.status}`;
    } catch (error: any) {
      lastError = error;
      if (error.name === 'AbortError') {
        console.warn(`Proxy ${i + 1} timeout, trying next...`);
      } else {
        console.warn(`Proxy ${i + 1} failed: ${error.message}, trying next...`);
      }
      continue;
    }
  }
  
  // If all proxies fail, return empty string instead of throwing to allow other sources to continue
  console.warn(`All CORS proxies failed for URL: ${url}. Last error:`, lastError);
  return '';
}

// Enhanced multi-source search with advanced ranking
export async function advancedMultiSourceSearch(query: string): Promise<MatchedContent[]> {
  const results: MatchedContent[] = [];
  
  // Use existing AlphaCodingSkills scraper which already works
  try {
    const { extractAlphaCodingArticle } = await import('./alphacodingskills');
    const alphaResults = await extractAlphaCodingArticle(query);
    
    if (alphaResults) {
      // Convert AlphaCoding results to MatchedContent format
      const sections: ContentSection[] = alphaResults.sections.map(section => ({
        heading: section.heading,
        content: section.content,
        type: 'text' as const
      }));

      const codeSnippets: CodeSnippet[] = alphaResults.examples.map(example => ({
        code: example.code,
        language: example.language,
        explanation: example.explanation,
        output: example.output,
        title: example.title
      }));

      // Calculate relevance score
      const tfidfScore = SearchAlgorithm.calculateTFIDF(query, alphaResults.content, [alphaResults.content]);
      const bm25Score = SearchAlgorithm.calculateBM25(query, alphaResults.content, 500);
      const semanticScore = SearchAlgorithm.calculateSemanticSimilarity(query, alphaResults.content);
      const ngramScore = SearchAlgorithm.nGramSimilarity(query, alphaResults.title);

      const relevanceScore = (
        tfidfScore * 0.3 +
        bm25Score * 0.3 +
        semanticScore * 0.2 +
        ngramScore * 0.2
      ) * 100;

      results.push({
        title: alphaResults.title,
        content: alphaResults.content,
        source: 'AlphaCodingSkills',
        url: alphaResults.url,
        code: codeSnippets,
        sections: sections,
        topics: alphaResults.relatedTopics.map(t => t.title),
        relevanceScore,
        metadata: {
          difficulty: 'intermediate',
          readTime: `${Math.ceil(alphaResults.content.split(/\s+/).length / 200)} min read`
        }
      });
    }
  } catch (error) {
    console.error('AlphaCodingSkills fetch error:', error);
  }

  // Try to get content from GeeksForGeeks with better error handling
  try {
    const gfgUrl = buildGeeksForGeeksURL(query)[0];
    if (gfgUrl) {
      const html = await fetchWithProxy(gfgUrl);
      if (html && html.length > 100) { // Only process if we got actual content
        const content = AdvancedContentExtractor.extractStructuredContent(html, gfgUrl);
        if (content && content.content.length > 100) {
          const tfidfScore = SearchAlgorithm.calculateTFIDF(query, content.content, [content.content]);
          const bm25Score = SearchAlgorithm.calculateBM25(query, content.content, 500);
          const semanticScore = SearchAlgorithm.calculateSemanticSimilarity(query, content.content);
          const ngramScore = SearchAlgorithm.nGramSimilarity(query, content.title);

          content.relevanceScore = (
            tfidfScore * 0.3 +
            bm25Score * 0.3 +
            semanticScore * 0.2 +
            ngramScore * 0.2
          ) * 100;

          results.push(content);
        }
      } else {
        console.warn('GeeksForGeeks: No content received from proxies, skipping...');
      }
    }
  } catch (error) {
    console.warn('GeeksForGeeks fetch failed, continuing with other sources...', error);
  }

  // Try W3Schools
  try {
    const w3sUrls = buildW3SchoolsURL(query);
    if (w3sUrls.length > 0) {
      const html = await fetchWithProxy(w3sUrls[0]);
      if (html && html.length > 100) { // Only process if we got actual content
        const content = AdvancedContentExtractor.extractStructuredContent(html, w3sUrls[0]);
        if (content && content.content.length > 100) {
          const tfidfScore = SearchAlgorithm.calculateTFIDF(query, content.content, [content.content]);
          const bm25Score = SearchAlgorithm.calculateBM25(query, content.content, 500);
          const semanticScore = SearchAlgorithm.calculateSemanticSimilarity(query, content.content);
          const ngramScore = SearchAlgorithm.nGramSimilarity(query, content.title);

          content.relevanceScore = (
            tfidfScore * 0.3 +
            bm25Score * 0.3 +
            semanticScore * 0.2 +
            ngramScore * 0.2
          ) * 100;

          results.push(content);
        }
      } else {
        console.warn('W3Schools: No content received from proxies, skipping...');
      }
    }
  } catch (error) {
    console.warn('W3Schools fetch failed, continuing with other sources...', error);
  }

  // Sort by relevance score
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Remove duplicates based on title similarity
  const uniqueResults: MatchedContent[] = [];
  results.forEach(result => {
    const isDuplicate = uniqueResults.some(existing => 
      SearchAlgorithm.nGramSimilarity(result.title, existing.title) > 0.7
    );
    if (!isDuplicate) {
      uniqueResults.push(result);
    }
  });

  return uniqueResults.slice(0, 10); // Return top 10 results
}

// URL builders for different sources
function buildAlphaCodingURL(query: string): string[] {
  const urls: string[] = [];
  const languages = ['python', 'java', 'javascript', 'c', 'cpp', 'php', 'sql'];
  const normalizedQuery = query.toLowerCase().replace(/\s+/g, '-');
  
  languages.forEach(lang => {
    if (query.toLowerCase().includes(lang)) {
      urls.push(`https://www.alphacodingskills.com/${lang}/${lang}-${normalizedQuery}.php`);
    }
  });

  return urls;
}

function buildGeeksForGeeksURL(query: string): string[] {
  const normalized = query.toLowerCase().replace(/\s+/g, '-');
  return [`https://www.geeksforgeeks.org/${normalized}/`];
}

function buildW3SchoolsURL(query: string): string[] {
  const urls: string[] = [];
  const languages = ['python', 'java', 'js', 'sql', 'php', 'css', 'html'];
  
  languages.forEach(lang => {
    if (query.toLowerCase().includes(lang)) {
      const topic = query.toLowerCase().replace(lang, '').trim().replace(/\s+/g, '_');
      urls.push(`https://www.w3schools.com/${lang}/${lang}_${topic}.asp`);
    }
  });

  return urls;
}

function buildJavaTPointURL(query: string): string[] {
  const normalized = query.toLowerCase().replace(/\s+/g, '-');
  return [`https://www.javatpoint.com/${normalized}`];
}

function buildTutorialsPointURL(query: string): string[] {
  const words = query.toLowerCase().split(/\s+/);
  if (words.length > 0) {
    const topic = words.join('_');
    return [`https://www.tutorialspoint.com/${words[0]}/${topic}.htm`];
  }
  return [];
}
