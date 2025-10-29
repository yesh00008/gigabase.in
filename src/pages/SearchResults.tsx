  import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Code2, BookOpen, Zap, Clock, Award, FileText, GraduationCap, Globe, Video, Library, Lightbulb, TrendingUp, Sparkles } from "lucide-react";
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

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    setArticlesLoading(true);
    
    // Priority 1: Search Gigabase Knowledge Database (Wikipedia) - FASTEST
    fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        query
      )}&utf8=&format=json&origin=*&srlimit=30`
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

    // Priority 3: Search academic articles (renamed from research papers)
    Promise.race([
      searchResearchPapers(query),
      new Promise<MatchedContent[]>((resolve) => setTimeout(() => resolve([]), 5000))
    ]).then((papers) => {
      if (papers.length > 0) {
        // Limit to top 5 for performance
        const topPapers = papers.slice(0, 5);
        const rankedPapers = topPapers.map(paper => {
          const ensembleScore = UltraAdvancedSearchEngine.calculateEnsembleScore(
            query,
            paper.content + ' ' + paper.title,
            topPapers.map(p => p.content)
          );
          return { ...paper, relevanceScore: ensembleScore };
        }).sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
        
        setResearchPapers(rankedPapers);
      }
      setArticlesLoading(false);
    }).catch(() => {
      setResearchPapers([]);
      setArticlesLoading(false);
    });

    // Priority 4: Search additional sources (optimized with timeout)
    Promise.race([
      searchAllAdditionalSources(query),
      new Promise<MatchedContent[]>((resolve) => setTimeout(() => resolve([]), 5000))
    ]).then((additional) => {
      if (additional.length > 0) {
        // Limit to top 8 for performance
        const topAdditional = additional.slice(0, 8);
        const rankedAdditional = topAdditional.map(item => {
          const ensembleScore = UltraAdvancedSearchEngine.calculateEnsembleScore(
            query,
            item.content + ' ' + item.title,
            topAdditional.map(a => a.content)
          );
          return { ...item, relevanceScore: ensembleScore };
        }).sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
        
        setAdditionalContent(rankedAdditional);
      }
    }).catch(() => {
      setAdditionalContent([]);
    });

    // Priority 5: Search advanced resources (videos, books, code snippets, learning paths)
    Promise.race([
      searchAllAdvancedResources(query),
      new Promise<MatchedContent[]>((resolve) => setTimeout(() => resolve([]), 5000))
    ]).then((advanced) => {
      if (advanced.length > 0) {
        const topAdvanced = advanced.slice(0, 10);
        const rankedAdvanced = topAdvanced.map(item => {
          const ensembleScore = UltraAdvancedSearchEngine.calculateEnsembleScore(
            query,
            item.content + ' ' + item.title,
            topAdvanced.map(a => a.content)
          );
          return { ...item, relevanceScore: ensembleScore };
        }).sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
        
        setAdvancedResources(rankedAdvanced);
      }
    }).catch(() => {
      setAdvancedResources([]);
    });
  }, [query]);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <StarField />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <header className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            <span>Back to Home</span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">Gigabase</h1>

          <SearchBar placeholder={query} />
        </header>

        {/* Results */}
        <div className="space-y-6 sm:space-y-8">
          {/* Advanced Resources Section - NEW! */}
          {advancedResources.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 px-2 sm:px-0">
                <Sparkles className="w-6 h-6 text-pink-400 animate-pulse" />
                <h2 className="text-xl sm:text-2xl font-semibold text-white">Advanced Learning Resources</h2>
                <span className="text-xs px-3 py-1.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 font-medium">
                  {advancedResources.length} {advancedResources.length === 1 ? 'Resource' : 'Resources'}
                </span>
              </div>

              {advancedResources.map((content, contentIdx) => (
                <article key={contentIdx} className="glass-card border border-pink-500/30 rounded-2xl overflow-hidden backdrop-blur-md">
                  {/* Resource Header */}
                  <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-b border-pink-500/30 p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl sm:text-3xl font-bold text-pink-300 mb-3">
                          {content.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-sm font-medium">
                            {content.source === 'Gigabase Video Tutorials' && <Video className="w-4 h-4" />}
                            {content.source === 'Gigabase Library' && <Library className="w-4 h-4" />}
                            {content.source === 'Gigabase Code Library' && <Code2 className="w-4 h-4" />}
                            {content.source === 'Gigabase Learning Paths' && <TrendingUp className="w-4 h-4" />}
                            {content.source === 'Gigabase AI Recommendations' && <Lightbulb className="w-4 h-4" />}
                            {content.source}
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

                  {/* Resource Sections */}
                  {content.sections && content.sections.length > 0 && (
                    <div className="p-6 space-y-6 border-b border-pink-500/20">
                      {content.sections.map((section, sectionIdx) => (
                        <div key={sectionIdx} className="space-y-3">
                          <h4 className="text-xl font-semibold text-pink-300 flex items-center gap-3">
                            <div className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full"></div>
                            {section.heading}
                          </h4>
                          <div className={`pl-6 ${
                            section.type === 'note' ? 'border-l-4 border-pink-500/50 bg-pink-500/5 p-4 rounded-r-lg' :
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
                    <div className="p-6 space-y-6 bg-gradient-to-b from-transparent to-pink-500/5">
                      <h4 className="text-xl font-semibold text-pink-300 flex items-center gap-3">
                        <Code2 className="w-6 h-6" />
                        Code Examples & Implementation
                      </h4>
                      
                      <div className="space-y-8">
                        {content.code.map((snippet, idx) => (
                          <div key={idx} className="space-y-4">
                            {snippet.title && (
                              <div className="flex items-center justify-between">
                                <h5 className="text-lg font-medium text-pink-300 flex items-center gap-2">
                                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-pink-500/20 border border-pink-500/30 text-sm">
                                    {idx + 1}
                                  </span>
                                  {snippet.title}
                                </h5>
                                <button
                                  onClick={() => navigator.clipboard.writeText(snippet.code)}
                                  className="px-4 py-2 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/30 hover:bg-pink-500/30 transition-all text-sm font-medium hover:scale-105"
                                >
                                  Copy Code
                                </button>
                              </div>
                            )}
                            
                            <div className="rounded-xl overflow-hidden border-2 border-gray-700/50 shadow-2xl">
                              <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
                                <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                                  {snippet.language}
                                </span>
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

                            {snippet.explanation && (
                              <div className="bg-pink-500/5 border border-pink-500/20 rounded-lg p-5">
                                <p className="text-sm font-semibold text-pink-400 mb-2 flex items-center gap-2">
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
                    <div className="p-6 bg-gradient-to-r from-pink-500/5 to-purple-500/5 border-t border-pink-500/20">
                      <h4 className="text-sm font-semibold text-pink-300 mb-4 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Related Topics to Explore
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {content.topics.map((topic, idx) => (
                          <button
                            key={idx}
                            onClick={() => navigate(`/search?q=${encodeURIComponent(topic)}`)}
                            className="px-4 py-2 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 hover:bg-pink-500/30 hover:border-pink-400 transition-all text-sm font-medium hover:scale-105"
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

          {/* Community & Developer Resources Section */}
          {additionalContent.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 px-2 sm:px-0">
                <Globe className="w-6 h-6 text-green-400" />
                <h2 className="text-xl sm:text-2xl font-semibold text-white">Community Resources & Articles</h2>
                <span className="text-xs px-3 py-1.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/30 font-medium">
                  {additionalContent.length} {additionalContent.length === 1 ? 'Resource' : 'Resources'}
                </span>
              </div>

              {additionalContent.map((content, contentIdx) => (
                <article key={contentIdx} className="glass-card border border-green-500/30 rounded-2xl overflow-hidden backdrop-blur-md">
                  {/* Article Header */}
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-green-500/30 p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl sm:text-3xl font-bold text-green-300 mb-3">
                          {content.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-sm font-medium">
                            <Globe className="w-4 h-4" />
                            Gigabase Community
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
                    <div className="p-6 space-y-6 border-b border-green-500/20">
                      {content.sections.map((section, sectionIdx) => (
                        <div key={sectionIdx} className="space-y-3">
                          <h4 className="text-xl font-semibold text-green-300 flex items-center gap-3">
                            <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                            {section.heading}
                          </h4>
                          <div className={`pl-6 ${
                            section.type === 'note' ? 'border-l-4 border-green-500/50 bg-green-500/5 p-4 rounded-r-lg' :
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
                    <div className="p-6 space-y-6 bg-gradient-to-b from-transparent to-green-500/5">
                      <h4 className="text-xl font-semibold text-green-300 flex items-center gap-3">
                        <Code2 className="w-6 h-6" />
                        Code Examples & Implementation
                      </h4>
                      
                      <div className="space-y-8">
                        {content.code.map((snippet, idx) => (
                          <div key={idx} className="space-y-4">
                            {/* Code Title */}
                            {snippet.title && (
                              <div className="flex items-center justify-between">
                                <h5 className="text-lg font-medium text-green-300 flex items-center gap-2">
                                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-500/20 border border-green-500/30 text-sm">
                                    {idx + 1}
                                  </span>
                                  {snippet.title}
                                </h5>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(snippet.code);
                                  }}
                                  className="px-4 py-2 rounded-lg bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30 transition-all text-sm font-medium hover:scale-105"
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
                                    className="px-3 py-1 rounded bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30 transition-all text-xs"
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
                              <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-5">
                                <p className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
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
                    <div className="p-6 bg-gradient-to-r from-green-500/5 to-emerald-500/5 border-t border-green-500/20">
                      <h4 className="text-sm font-semibold text-green-300 mb-4 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Related Topics to Explore
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {content.topics.map((topic, idx) => (
                          <button
                            key={idx}
                            onClick={() => navigate(`/search?q=${encodeURIComponent(topic)}`)}
                            className="px-4 py-2 rounded-full bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30 hover:border-green-400 transition-all text-sm font-medium hover:scale-105"
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

              {researchPapers.map((paper, idx) => (
                <article key={idx} className="glass-card border border-purple-500/30 rounded-2xl overflow-hidden backdrop-blur-md">
                  {/* Article Header */}
                  <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-b border-purple-500/30 p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl sm:text-3xl font-bold text-purple-300 mb-3">
                          {paper.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-sm font-medium">
                            <FileText className="w-4 h-4" />
                            Gigabase Research
                          </span>
                          {paper.metadata?.difficulty && (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-sm font-medium">
                              <Award className="w-4 h-4" />
                              {paper.metadata.difficulty.charAt(0).toUpperCase() + paper.metadata.difficulty.slice(1)}
                            </span>
                          )}
                          {paper.metadata?.readTime && (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-sm font-medium">
                              <Clock className="w-4 h-4" />
                              {paper.metadata.readTime}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Article Content Sections */}
                  {paper.sections && paper.sections.length > 0 && (
                    <div className="p-6 space-y-6">
                      {paper.sections.map((section, sectionIdx) => (
                        <div key={sectionIdx} className="space-y-3">
                          <h4 className="text-xl font-semibold text-purple-300 flex items-center gap-3">
                            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full"></div>
                            {section.heading}
                          </h4>
                          <div className="pl-6 bg-purple-500/5 border-l-4 border-purple-500/50 p-4 rounded-r-lg">
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                              {section.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Related Topics */}
                  {paper.topics.length > 0 && (
                    <div className="p-6 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 border-t border-purple-500/20">
                      <h4 className="text-sm font-semibold text-purple-300 mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Related Topics & Keywords
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {paper.topics.map((topic, topicIdx) => (
                          <button
                            key={topicIdx}
                            onClick={() => navigate(`/search?q=${encodeURIComponent(topic)}`)}
                            className="px-4 py-2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 hover:border-purple-400 transition-all text-sm font-medium hover:scale-105"
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

          {/* Advanced Multi-Source Content Section */}
          {advancedContent.length > 0 && (
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
            ) : results.length > 0 ? (
              <>
                <div className="flex items-center gap-2 px-2 sm:px-0 mb-4 sm:mb-6">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl sm:text-2xl font-semibold text-white">Knowledge Base Articles</h2>
                  <span className="text-xs px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                    {results.length} {results.length === 1 ? 'Article' : 'Articles'}
                  </span>
                </div>
                {results.slice(0, 15).map((result) => (
                  <Link
                    key={result.pageid}
                    to={`/article/${result.pageid}`}
                    className="block glass-card border border-border/50 hover:border-accent rounded-xl p-4 sm:p-6 transition-all hover:shadow-lg hover:shadow-accent/10 backdrop-blur-md"
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
                  </Link>
                ))}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
