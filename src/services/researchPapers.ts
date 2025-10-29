// Enhanced Research Paper and Academic Content Integration

import { MatchedContent, CodeSnippet, ContentSection } from './advancedContentMatcher';

// Research paper sources
interface ResearchPaper {
  title: string;
  authors: string[];
  abstract: string;
  url: string;
  publicationDate: string;
  citations?: number;
  pdfUrl?: string;
  source: 'arxiv' | 'pubmed' | 'scholar' | 'semantic';
}

// Enhanced search with research papers
export async function searchResearchPapers(query: string): Promise<MatchedContent[]> {
  const results: MatchedContent[] = [];

  // Search arXiv for computer science papers
  try {
    const arxivResults = await searchArxiv(query);
    results.push(...arxivResults);
  } catch (error) {
    console.warn('arXiv search failed, continuing...');
  }

  // Search PubMed for medical/biology papers
  try {
    const pubmedResults = await searchPubMed(query);
    results.push(...pubmedResults);
  } catch (error) {
    console.warn('PubMed search failed, continuing...');
  }

  // Search Google Scholar-like sources
  try {
    const scholarResults = await searchScholar(query);
    results.push(...scholarResults);
  } catch (error) {
    console.warn('Scholar search failed, continuing...');
  }

  return results;
}

// arXiv API integration
async function searchArxiv(query: string): Promise<MatchedContent[]> {
  const searchUrl = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=10&sortBy=relevance&sortOrder=descending`;
  
  try {
    const response = await fetch(searchUrl);
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    const entries = xmlDoc.querySelectorAll('entry');
    const results: MatchedContent[] = [];
    
    entries.forEach(entry => {
      const title = entry.querySelector('title')?.textContent?.trim() || '';
      const summary = entry.querySelector('summary')?.textContent?.trim() || '';
      const published = entry.querySelector('published')?.textContent?.trim() || '';
      const id = entry.querySelector('id')?.textContent?.trim() || '';
      
      // Extract authors
      const authors: string[] = [];
      entry.querySelectorAll('author name').forEach(author => {
        const name = author.textContent?.trim();
        if (name) authors.push(name);
      });

      // Extract categories/topics
      const categories: string[] = [];
      entry.querySelectorAll('category').forEach(cat => {
        const term = cat.getAttribute('term');
        if (term) categories.push(term);
      });

      // Create sections from abstract
      const sections: ContentSection[] = [
        {
          heading: 'Abstract',
          content: summary,
          type: 'text'
        }
      ];

      if (authors.length > 0) {
        sections.push({
          heading: 'Authors',
          content: authors.join(', '),
          type: 'text'
        });
      }

      results.push({
        title: title.replace(/\n/g, ' '),
        content: summary.slice(0, 300) + '...',
        source: 'Gigabase Research',
        url: id,
        sections,
        topics: categories,
        relevanceScore: 85,
        metadata: {
          author: authors[0],
          lastUpdated: published,
          difficulty: 'advanced',
          readTime: '15 min read'
        }
      });
    });

    return results;
  } catch (error) {
    console.error('arXiv search error:', error);
    return [];
  }
}

// PubMed API integration
async function searchPubMed(query: string): Promise<MatchedContent[]> {
  const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=5&retmode=json`;
  
  try {
    const response = await fetch(searchUrl);
    const data = await response.json();
    const ids = data.esearchresult?.idlist || [];
    
    if (ids.length === 0) return [];

    // Fetch details for each paper
    const detailsUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`;
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();
    
    const results: MatchedContent[] = [];
    
    ids.forEach((id: string) => {
      const paper = detailsData.result?.[id];
      if (!paper) return;

      const title = paper.title || 'Untitled';
      const authors = paper.authors?.map((a: any) => a.name).join(', ') || 'Unknown';
      const pubdate = paper.pubdate || '';
      const source = paper.source || 'PubMed';

      results.push({
        title,
        content: `Research article from ${source}. Published: ${pubdate}`,
        source: 'Gigabase Research',
        url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
        sections: [{
          heading: 'Publication Info',
          content: `Authors: ${authors}\nPublished: ${pubdate}\nSource: ${source}`,
          type: 'text'
        }],
        topics: [source, 'medical', 'research'],
        relevanceScore: 80,
        metadata: {
          author: authors.split(',')[0],
          lastUpdated: pubdate,
          difficulty: 'advanced',
          readTime: '12 min read'
        }
      });
    });

    return results;
  } catch (error) {
    console.error('PubMed search error:', error);
    return [];
  }
}

// Enhanced scholarly search
async function searchScholar(query: string): Promise<MatchedContent[]> {
  // This would integrate with Google Scholar API or alternatives
  // For now, returning empty array as it requires API keys
  return [];
}

// Extract PDF content (when available)
export async function extractPDFContent(pdfUrl: string): Promise<string> {
  // This would use PDF.js or similar library to extract text
  // Placeholder for now
  return '';
}

// Citation analysis
export function analyzeCitations(papers: ResearchPaper[]): Map<string, number> {
  const citationMap = new Map<string, number>();
  
  papers.forEach(paper => {
    if (paper.citations) {
      citationMap.set(paper.title, paper.citations);
    }
  });

  return citationMap;
}

// Extract key findings from research papers
export function extractKeyFindings(content: string): string[] {
  const findings: string[] = [];
  
  // Look for common patterns in academic papers
  const patterns = [
    /we found that ([^.]+)\./gi,
    /our results show ([^.]+)\./gi,
    /we demonstrate ([^.]+)\./gi,
    /we propose ([^.]+)\./gi,
    /we present ([^.]+)\./gi,
    /conclusion[s]?:?\s+([^.]+)\./gi,
  ];

  patterns.forEach(pattern => {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[1].length > 20 && match[1].length < 200) {
        findings.push(match[1].trim());
      }
    }
  });

  return findings.slice(0, 5); // Return top 5 findings
}
