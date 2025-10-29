  import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Code2, BookOpen, Zap, Clock, Award, FileText, GraduationCap, Globe, Video, Library, Lightbulb, TrendingUp, Sparkles, ArrowUp } from "lucide-react";
import StarField from "@/components/StarField";
import SearchBar from "@/components/SearchBar";
import { advancedMultiSourceSearch } from "@/services/advancedExtractor";
import { MatchedContent } from "@/services/advancedContentMatcher";
import { searchResearchPapers } from "@/services/researchPapers";
import { UltraAdvancedSearchEngine } from "@/services/ultraAdvancedSearch";
import { searchAllAdditionalSources } from "@/services/additionalSources";
import { searchAllAdvancedResources } from "@/services/advancedResources";
import { HyperAdvancedAlgorithms } from "@/services/hyperAdvancedAlgorithms";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface SearchResult {
  pageid: number;
  title: string;
  snippet: string;
  timestamp: string;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [advancedContent, setAdvancedContent] = useState<MatchedContent[]>([]);
  const [researchPapers, setResearchPapers] = useState<MatchedContent[]>([]);
  const [additionalContent, setAdditionalContent] = useState<MatchedContent[]>([]);
  const [advancedResources, setAdvancedResources] = useState<MatchedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<{ id: number; title: string } | null>(null);
  const [articleContent, setArticleContent] = useState<string>("");
  const [articleLoading, setArticleLoading] = useState(false);

  // Check if query is a question
  const isQuestion = () => {
    const questionWords = ['what', 'why', 'how', 'when', 'where', 'who', 'which', 'can', 'does', 'is', 'are', 'do'];
    const lowerQuery = query.toLowerCase().trim();
    return questionWords.some(word => lowerQuery.startsWith(word)) || lowerQuery.includes('?');
  };

  const handleArticleClick = async (pageid: number, title: string) => {
    setSelectedArticle({ id: pageid, title });
    setArticleLoading(true);
    setArticleContent("");

    try {
      // Single optimized API call - fetch everything at once
      const [pageData, contentData] = await Promise.all([
        fetch(
          `https://en.wikipedia.org/w/api.php?action=query&pageids=${pageid}&prop=extracts|images&exintro=true&explaintext=true&format=json&origin=*&imlimit=50`,
          { priority: 'high', cache: 'force-cache' }
        ).then(res => res.json()),
        
        fetch(
          `https://en.wikipedia.org/w/api.php?action=parse&pageid=${pageid}&format=json&origin=*&prop=text&disabletoc=1&disableeditsection=1`,
          { priority: 'high', cache: 'force-cache' }
        ).then(res => res.json())
      ]);
      
      if (pageData.query && pageData.query.pages && pageData.query.pages[pageid]) {
        const page = pageData.query.pages[pageid];
        const summary = page.extract || '';
        const imagesList = page.images || [];
        
        // Get image URLs quickly (limit to first 10 for speed)
        const imageUrls: string[] = [];
        if (imagesList.length > 0) {
          const imageFileNames = imagesList
            .map((img: any) => img.title)
            .filter((title: string) => {
              const lower = title.toLowerCase();
              return !lower.includes('icon') && !lower.includes('logo') && 
                     !lower.includes('flag') && !lower.includes('.svg') &&
                     (lower.includes('.jpg') || lower.includes('.jpeg') || lower.includes('.png'));
            })
            .slice(0, 10); // Reduced from 20 to 10 for faster loading
          
          if (imageFileNames.length > 0) {
            const imageData = await fetch(
              `https://en.wikipedia.org/w/api.php?action=query&titles=${imageFileNames.join('|')}&prop=imageinfo&iiprop=url|size&iiurlwidth=800&format=json&origin=*`,
              { priority: 'high', cache: 'force-cache' }
            ).then(res => res.json());
            
            if (imageData.query && imageData.query.pages) {
              Object.values(imageData.query.pages).forEach((imgPage: any) => {
                if (imgPage.imageinfo && imgPage.imageinfo[0]) {
                  const info = imgPage.imageinfo[0];
                  if (info.width > 200 && info.height > 200) {
                    imageUrls.push(info.thumburl || info.url);
                  }
                }
              });
            }
          }
        }
        
        if (contentData.parse) {
          const htmlContent = contentData.parse.text["*"];
          
          // Fast parsing
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlContent, 'text/html');
          
          // Quick cleanup - remove unwanted elements
          const unwantedSelectors = [
            '.mw-editsection', '.navbox', '.sidebar', '.infobox', '.ambox', 
            '.hatnote', '.catlinks', '.metadata', '#toc', 'style', 'script', 
            '.reference', 'sup.reference', '.mw-ref', '.reflist'
          ];
          
          unwantedSelectors.forEach(selector => {
            doc.querySelectorAll(selector).forEach(el => el.remove());
          });
          
          // Remove unwanted sections
          const unwantedSections = ['See also', 'External links', 'References', 'Bibliography', 'Notes'];
          doc.querySelectorAll('h2, h3').forEach(heading => {
            const headingText = heading.textContent?.trim() || '';
            if (unwantedSections.some(section => headingText.includes(section))) {
              let next = heading.nextElementSibling;
              heading.remove();
              while (next && !['H1', 'H2'].includes(next.tagName)) {
                const toRemove = next;
                next = next.nextElementSibling;
                toRemove.remove();
              }
            }
          });
          
          // Remove links
          doc.querySelectorAll('a').forEach(link => {
            const text = link.textContent || '';
            link.replaceWith(doc.createTextNode(text));
          });
          
          // Remove existing images
          doc.querySelectorAll('img').forEach(img => img.remove());
          
          const contentDiv = doc.querySelector('.mw-parser-output') || doc.body;
          let mainContent = contentDiv.innerHTML;
          
          // Quick summary generation
          const generateQuickSummary = (htmlContent: string, extractSummary: string): string => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            const paragraphs = Array.from(tempDiv.querySelectorAll('p'))
              .map(p => p.textContent?.trim() || '')
              .filter(text => text.length > 50)
              .slice(0, 3); // Only use first 3 paragraphs
            
            let summaryText = extractSummary || paragraphs.join(' ');
            summaryText = summaryText.substring(0, 1000);
            
            if (!summaryText.endsWith('.')) {
              const lastPeriod = summaryText.lastIndexOf('.');
              summaryText = lastPeriod > 500 ? summaryText.substring(0, lastPeriod + 1) : summaryText + '...';
            }
            
            return summaryText || 'Summary not available.';
          };
          
          const quickSummary = generateQuickSummary(mainContent, summary);
          
          // Highlight keywords
          const keywords = query.toLowerCase().split(' ').filter(word => word.length > 2);
          keywords.forEach(keyword => {
            const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
            mainContent = mainContent.replace(regex, '<mark class="keyword-highlight">$1</mark>');
          });
          
          // Insert images inline (max 6 for faster rendering)
          if (imageUrls.length > 0) {
            const paragraphs = mainContent.split('</p>');
            const imageInsertPositions = Math.floor(paragraphs.length / (Math.min(imageUrls.length, 6) + 1));
            
            let imageIndex = 0;
            const newContent: string[] = [];
            
            paragraphs.forEach((para, index) => {
              newContent.push(para + (para.trim() ? '</p>' : ''));
              
              if (imageIndex < Math.min(imageUrls.length, 6) && 
                  index > 0 && 
                  index % Math.max(2, imageInsertPositions) === 0) {
                newContent.push(`
                  <figure class="article-inline-figure">
                    <img 
                      src="${imageUrls[imageIndex]}" 
                      alt="${title} - Image ${imageIndex + 1}"
                      loading="lazy"
                      decoding="async"
                      class="article-inline-image"
                      onerror="this.style.display='none'"
                    />
                  </figure>
                `);
                imageIndex++;
              }
            });
            
            mainContent = newContent.join('');
          }
          
          // Build article
          let formattedArticle = `
            <div class="article-wrapper">
              <div class="quick-summary mb-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <h3 class="text-lg font-semibold text-blue-300 mb-3">Quick Summary</h3>
                <p class="text-sm leading-relaxed text-gray-300">${quickSummary}</p>
              </div>
              <div class="main-article-content">
                ${mainContent}
              </div>
            </div>
          `;
          
          setArticleContent(formattedArticle);
        }
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      setArticleContent("<p class='text-red-400'>Error loading article content. Please try again.</p>");
    } finally {
      setArticleLoading(false);
    }
  };

  const handleBackToResults = () => {
    setSelectedArticle(null);
    setArticleContent("");
  };

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    setArticlesLoading(true);
    
    // Priority 1: Search Gigabase Knowledge Database (Wikipedia) - ULTRA FAST with caching
    // Increased limit to 30 to show more article cards
    fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        query
      )}&utf8=&format=json&origin=*&srlimit=30`,
      {
        priority: 'high',
        cache: 'force-cache'
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setResults(data?.query?.search || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    // Priority 2: Fetch advanced content (optimized with timeout)
    Promise.race([
      advancedMultiSourceSearch(query),
      new Promise<MatchedContent[]>((resolve) => setTimeout(() => resolve([]), 5000))
    ]).then((content) => {
      if (content.length > 0) {
        // Apply ensemble ranking only to first 10 items for performance
        const topContent = content.slice(0, 10);
        const rankedContent = topContent.map(item => {
          const ensembleScore = UltraAdvancedSearchEngine.calculateEnsembleScore(
            query,
            item.content + ' ' + item.title,
            topContent.map(c => c.content)
          );
          return { ...item, relevanceScore: ensembleScore };
        }).sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
        
        setAdvancedContent(rankedContent);
      }
    }).catch(() => {
      setAdvancedContent([]);
    });

    // Priority 3: Search academic articles ONLY IF IT'S A QUESTION (optimized)
    if (isQuestion()) {
      Promise.race([
        searchResearchPapers(query),
        new Promise<MatchedContent[]>((resolve) => setTimeout(() => resolve([]), 3000))
      ]).then((papers) => {
        if (papers.length > 0) {
          // Limit to top 5 for performance
          const topPapers = papers.slice(0, 5);
          setResearchPapers(topPapers);
        }
        setArticlesLoading(false);
      }).catch(() => {
        setResearchPapers([]);
        setArticlesLoading(false);
      });
    } else {
      setResearchPapers([]);
      setArticlesLoading(false);
    }

    // Skip additional sources and advanced resources (not needed)
    setAdditionalContent([]);
    setAdvancedResources([]);
  }, [query]);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <StarField />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header - Only show when NOT viewing an article */}
        {!selectedArticle && (
          <header className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
              <span>Back to Home</span>
            </button>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">Gigabase</h1>

            <SearchBar placeholder={query} />
          </header>
        )}

        {/* Show article content if selected, otherwise show search results */}
        {selectedArticle ? (
          <div className="space-y-6">
            {/* Back button */}
            <button
              onClick={handleBackToResults}
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm sm:text-base mb-6"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
              <span>Back to Results</span>
            </button>

            {/* Article Title - No Box */}
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-8">
              {selectedArticle.title}
            </h1>

            {/* Article content */}
            <div className="article-container">
              {articleLoading ? (
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                  <div className="h-4 bg-muted rounded w-4/6"></div>
                </div>
              ) : (
                <div 
                  className="prose prose-invert max-w-none prose-img:mx-auto prose-img:rounded-lg prose-img:shadow-lg"
                  style={{ textAlign: 'justify' }}
                  dangerouslySetInnerHTML={{ __html: articleContent }}
                />
              )}
            </div>

            {/* Scroll to Top Button - Fixed at bottom-right */}
            {!articleLoading && articleContent && (
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-6 right-6 p-4 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-110 z-50"
                aria-label="Scroll to top"
              >
                <ArrowUp size={24} />
              </button>
            )}
          </div>
        ) : (
          /* Search Results */
          <div className="space-y-6 sm:space-y-8">
          
          {/* Wikipedia Knowledge Base Articles - ALWAYS SHOW FIRST */}
          {results.length > 0 ? (
            <>
              <div className="space-y-6">
                <div className="flex items-center gap-2 px-2 sm:px-0">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl sm:text-2xl font-semibold text-white">Knowledge Base Articles</h2>
                  <span className="text-xs px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                    {results.length} {results.length === 1 ? 'Article' : 'Articles'}
                  </span>
                </div>
                <div className="grid gap-4 sm:gap-6">
                {results.slice(0, 30).map((result) => (
                  <button
                    key={result.pageid}
                    onClick={() => handleArticleClick(result.pageid, result.title)}
                    className="block w-full text-left glass-card border border-border/50 hover:border-accent rounded-xl p-4 sm:p-6 transition-all hover:shadow-lg hover:shadow-accent/10 backdrop-blur-md cursor-pointer"
                  >
                    <div className="flex-1 space-y-2">
                      <h2 className="text-lg sm:text-xl font-semibold text-foreground hover:text-accent transition-colors">
                        {result.title}
                      </h2>
                      <p
                        className="text-muted-foreground text-xs sm:text-sm leading-relaxed line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: result.snippet }}
                      />
                      <p className="text-xs text-muted-foreground">
                        Last updated: {new Date(result.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              </div>
            </>
          ) : null}

          {/* Research Papers Section - ONLY SHOW IF QUESTION */}
          {isQuestion() && researchPapers.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 px-2 sm:px-0">
                <FileText className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl sm:text-2xl font-semibold text-white">Academic Articles & Information</h2>
                <span className="text-xs px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                  {researchPapers.length} {researchPapers.length === 1 ? 'Article' : 'Articles'}
                </span>
              </div>

              <div className="grid gap-4 sm:gap-6">
                {researchPapers.map((paper, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedArticle({ id: 2000 + idx, title: paper.title });
                      setArticleContent(`
                        <div class="space-y-6">
                          ${paper.sections ? paper.sections.map(section => `
                            <div class="space-y-3">
                              <h3 class="text-xl font-semibold text-purple-300">${section.heading}</h3>
                              <p class="text-muted-foreground">${section.content}</p>
                            </div>
                          `).join('') : ''}
                        </div>
                      `);
                    }}
                    className="block w-full text-left glass-card border border-purple-500/30 hover:border-purple-400 rounded-xl p-4 sm:p-6 transition-all hover:shadow-lg hover:shadow-purple-500/10 backdrop-blur-md cursor-pointer"
                  >
                    <div className="flex-1 space-y-3">
                      <h3 className="text-lg sm:text-xl font-semibold text-purple-300 hover:text-purple-200 transition-colors">
                        {paper.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-medium">
                          <FileText className="w-3 h-3" />
                          Gigabase Research
                        </span>
                        {paper.metadata?.difficulty && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-medium">
                            <Award className="w-3 h-3" />
                            {paper.metadata.difficulty.charAt(0).toUpperCase() + paper.metadata.difficulty.slice(1)}
                          </span>
                        )}
                        {paper.metadata?.readTime && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-medium">
                            <Clock className="w-3 h-3" />
                            {paper.metadata.readTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* HIDE: Advanced Resources Section */}
          {false && advancedResources.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 px-2 sm:px-0">
                <Sparkles className="w-6 h-6 text-pink-400 animate-pulse" />
                <h2 className="text-xl sm:text-2xl font-semibold text-white">Advanced Learning Resources</h2>
                <span className="text-xs px-3 py-1.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 font-medium">
                  {advancedResources.length} {advancedResources.length === 1 ? 'Resource' : 'Resources'}
                </span>
              </div>

              <div className="grid gap-4 sm:gap-6">
                {advancedResources.map((content, contentIdx) => (
                  <button
                    key={contentIdx}
                    onClick={() => {
                      // Store the advanced resource content for display
                      setSelectedArticle({ id: contentIdx, title: content.title });
                      setArticleContent(`
                        <div class="space-y-6">
                          <p class="text-lg">${content.content}</p>
                          ${content.sections ? content.sections.map(section => `
                            <div class="space-y-3">
                              <h3 class="text-xl font-semibold text-pink-300">${section.heading}</h3>
                              <p class="text-muted-foreground">${section.content}</p>
                            </div>
                          `).join('') : ''}
                        </div>
                      `);
                    }}
                    className="block w-full text-left glass-card border border-pink-500/30 hover:border-pink-400 rounded-xl p-4 sm:p-6 transition-all hover:shadow-lg hover:shadow-pink-500/10 backdrop-blur-md cursor-pointer"
                  >
                    <div className="flex-1 space-y-3">
                      <h3 className="text-lg sm:text-xl font-semibold text-pink-300 hover:text-pink-200 transition-colors">
                        {content.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-medium">
                          {content.source === 'Gigabase Video Tutorials' && <Video className="w-3 h-3" />}
                          {content.source === 'Gigabase Library' && <Library className="w-3 h-3" />}
                          {content.source === 'Gigabase Code Library' && <Code2 className="w-3 h-3" />}
                          {content.source === 'Gigabase Learning Paths' && <TrendingUp className="w-3 h-3" />}
                          {content.source === 'Gigabase AI Recommendations' && <Lightbulb className="w-3 h-3" />}
                          {content.source}
                        </span>
                        {content.metadata?.difficulty && (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            content.metadata.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                            content.metadata.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                            'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}>
                            <Award className="w-3 h-3" />
                            {content.metadata.difficulty.charAt(0).toUpperCase() + content.metadata.difficulty.slice(1)}
                          </span>
                        )}
                        {content.metadata?.readTime && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-medium">
                            <Clock className="w-3 h-3" />
                            {content.metadata.readTime}
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed line-clamp-2">
                        {content.content}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* HIDE: Community & Developer Resources Section */}
          {false && additionalContent.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 px-2 sm:px-0">
                <Globe className="w-6 h-6 text-green-400" />
                <h2 className="text-xl sm:text-2xl font-semibold text-white">Community Resources & Articles</h2>
                <span className="text-xs px-3 py-1.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/30 font-medium">
                  {additionalContent.length} {additionalContent.length === 1 ? 'Resource' : 'Resources'}
                </span>
              </div>

              <div className="grid gap-4 sm:gap-6">
                {additionalContent.map((content, contentIdx) => (
                  <button
                    key={contentIdx}
                    onClick={() => {
                      setSelectedArticle({ id: 1000 + contentIdx, title: content.title });
                      setArticleContent(`
                        <div class="space-y-6">
                          <p class="text-lg">${content.content}</p>
                          ${content.sections ? content.sections.map(section => `
                            <div class="space-y-3">
                              <h3 class="text-xl font-semibold text-green-300">${section.heading}</h3>
                              <p class="text-muted-foreground">${section.content}</p>
                            </div>
                          `).join('') : ''}
                        </div>
                      `);
                    }}
                    className="block w-full text-left glass-card border border-green-500/30 hover:border-green-400 rounded-xl p-4 sm:p-6 transition-all hover:shadow-lg hover:shadow-green-500/10 backdrop-blur-md cursor-pointer"
                  >
                    <div className="flex-1 space-y-3">
                      <h3 className="text-lg sm:text-xl font-semibold text-green-300 hover:text-green-200 transition-colors">
                        {content.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium">
                          <Globe className="w-3 h-3" />
                          Gigabase Community
                        </span>
                        {content.metadata?.difficulty && (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            content.metadata.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                            content.metadata.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                            'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}>
                            <Award className="w-3 h-3" />
                            {content.metadata.difficulty.charAt(0).toUpperCase() + content.metadata.difficulty.slice(1)}
                          </span>
                        )}
                        {content.metadata?.readTime && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-medium">
                            <Clock className="w-3 h-3" />
                            {content.metadata.readTime}
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed line-clamp-2">
                        {content.content}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Academic Articles Section */}
          {researchPapers.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 px-2 sm:px-0">
                <FileText className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl sm:text-2xl font-semibold text-white">Academic Articles & Information</h2>
                <span className="text-xs px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                  {researchPapers.length} {researchPapers.length === 1 ? 'Article' : 'Articles'}
                </span>
              </div>

              <div className="grid gap-4 sm:gap-6">
                {researchPapers.map((paper, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedArticle({ id: 2000 + idx, title: paper.title });
                      setArticleContent(`
                        <div class="space-y-6">
                          ${paper.sections ? paper.sections.map(section => `
                            <div class="space-y-3">
                              <h3 class="text-xl font-semibold text-purple-300">${section.heading}</h3>
                              <p class="text-muted-foreground">${section.content}</p>
                            </div>
                          `).join('') : ''}
                        </div>
                      `);
                    }}
                    className="block w-full text-left glass-card border border-purple-500/30 hover:border-purple-400 rounded-xl p-4 sm:p-6 transition-all hover:shadow-lg hover:shadow-purple-500/10 backdrop-blur-md cursor-pointer"
                  >
                    <div className="flex-1 space-y-3">
                      <h3 className="text-lg sm:text-xl font-semibold text-purple-300 hover:text-purple-200 transition-colors">
                        {paper.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-medium">
                          <FileText className="w-3 h-3" />
                          Gigabase Research
                        </span>
                        {paper.metadata?.difficulty && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-medium">
                            <Award className="w-3 h-3" />
                            {paper.metadata.difficulty.charAt(0).toUpperCase() + paper.metadata.difficulty.slice(1)}
                          </span>
                        )}
                        {paper.metadata?.readTime && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-medium">
                            <Clock className="w-3 h-3" />
                            {paper.metadata.readTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* HIDE: Advanced Multi-Source Content Section */}
          {false && advancedContent.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 px-2 sm:px-0">
                <Zap className="w-6 h-6 text-yellow-400" />
                <h2 className="text-xl sm:text-2xl font-semibold text-white">Tutorial Results</h2>
                <span className="text-xs px-3 py-1.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 font-medium">
                  {advancedContent.length} {advancedContent.length === 1 ? 'Result' : 'Results'}
                </span>
              </div>

              {advancedContent.map((content, contentIdx) => (
                <article key={contentIdx} className="glass-card border border-yellow-500/30 rounded-2xl overflow-hidden backdrop-blur-md">
                  {/* Article Header */}
                  <div className="bg-gradient-to-r from-yellow-500/10 to-blue-500/10 border-b border-yellow-500/30 p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-3">
                          {content.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-sm font-medium">
                            <BookOpen className="w-4 h-4" />
                            Gigabase Tutorials
                          </span>
                          {content.metadata?.difficulty && (
                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                              content.metadata.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                              content.metadata.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                              'bg-red-500/20 text-red-300 border border-red-500/30'
                            }`}>
                              <Award className="w-4 h-4" />
                              {content.metadata.difficulty.charAt(0).toUpperCase() + content.metadata.difficulty.slice(1)}
                            </span>
                          )}
                          {content.metadata?.readTime && (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-sm font-medium">
                              <Clock className="w-4 h-4" />
                              {content.metadata.readTime}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-base leading-relaxed">
                      {content.content}
                    </p>
                  </div>

                  {/* Article Sections */}
                  {content.sections && content.sections.length > 0 && (
                    <div className="p-6 space-y-6 border-b border-yellow-500/20">
                      {content.sections.map((section, sectionIdx) => (
                        <div key={sectionIdx} className="space-y-3">
                          <h4 className="text-xl font-semibold text-blue-300 flex items-center gap-3">
                            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                            {section.heading}
                          </h4>
                          <div className={`pl-6 ${
                            section.type === 'note' ? 'border-l-4 border-yellow-500/50 bg-yellow-500/5 p-4 rounded-r-lg' :
                            section.type === 'list' ? 'space-y-2' : ''
                          }`}>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                              {section.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Code Examples */}
                  {content.code && content.code.length > 0 && (
                    <div className="p-6 space-y-6 bg-gradient-to-b from-transparent to-blue-500/5">
                      <h4 className="text-xl font-semibold text-yellow-300 flex items-center gap-3">
                        <Code2 className="w-6 h-6" />
                        Code Examples & Implementation
                      </h4>
                      
                      <div className="space-y-8">
                        {content.code.map((snippet, idx) => (
                          <div key={idx} className="space-y-4">
                            {/* Code Title */}
                            {snippet.title && (
                              <div className="flex items-center justify-between">
                                <h5 className="text-lg font-medium text-blue-300 flex items-center gap-2">
                                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 text-sm">
                                    {idx + 1}
                                  </span>
                                  {snippet.title}
                                </h5>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(snippet.code);
                                  }}
                                  className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-all text-sm font-medium hover:scale-105"
                                >
                                  Copy Code
                                </button>
                              </div>
                            )}
                            
                            {/* Code Block */}
                            <div className="rounded-xl overflow-hidden border-2 border-gray-700/50 shadow-2xl">
                              <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
                                <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                                  {snippet.language}
                                </span>
                                {!snippet.title && (
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(snippet.code);
                                    }}
                                    className="px-3 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-all text-xs"
                                  >
                                    Copy
                                  </button>
                                )}
                              </div>
                              <SyntaxHighlighter
                                language={snippet.language}
                                style={vscDarkPlus}
                                customStyle={{
                                  margin: 0,
                                  borderRadius: 0,
                                  fontSize: '0.9rem',
                                  padding: '1.5rem',
                                }}
                                showLineNumbers
                              >
                                {snippet.code}
                              </SyntaxHighlighter>
                            </div>

                            {/* Code Output */}
                            {snippet.output && (
                              <div className="space-y-2">
                                <p className="text-sm font-semibold text-green-400 flex items-center gap-2">
                                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                  Output:
                                </p>
                                <div className="rounded-lg border-2 border-green-700/50 bg-gradient-to-br from-green-950/30 to-emerald-950/30 p-4 shadow-lg">
                                  <pre className="text-sm text-green-300 font-mono whitespace-pre-wrap leading-relaxed">
                                    {snippet.output}
                                  </pre>
                                </div>
                              </div>
                            )}

                            {/* Code Explanation */}
                            {snippet.explanation && (
                              <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-5">
                                <p className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                                  <BookOpen className="w-4 h-4" />
                                  Explanation:
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                  {snippet.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Related Topics */}
                  {content.topics.length > 0 && (
                    <div className="p-6 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-t border-yellow-500/20">
                      <h4 className="text-sm font-semibold text-yellow-300 mb-4 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Related Topics to Explore
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {content.topics.map((topic, idx) => (
                          <button
                            key={idx}
                            onClick={() => navigate(`/search?q=${encodeURIComponent(topic)}`)}
                            className="px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 hover:border-blue-400 transition-all text-sm font-medium hover:scale-105"
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}

          {/* Gigabase Knowledge Database Results Section - Always Visible */}
          <div className="space-y-3 sm:space-y-4">
            {loading && results.length === 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-card border border-border/50 rounded-xl p-4 sm:p-6 animate-pulse backdrop-blur-md">
                    <div className="h-5 sm:h-6 bg-muted rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : results.length === 0 && !loading && advancedContent.length === 0 && researchPapers.length === 0 && additionalContent.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <p className="text-muted-foreground text-sm sm:text-base">No results found for "{query}"</p>
                <p className="text-muted-foreground text-xs sm:text-sm mt-2">Try different keywords or check spelling</p>
              </div>
            ) : null}
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
