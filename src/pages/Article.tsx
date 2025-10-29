import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, FileText } from "lucide-react";
import StarField from "@/components/StarField";
import { searchArXiv, ArXivPaper } from "@/services/arxiv";

interface ArticleImage {
  url: string;
  title: string;
}

interface ArticleData {
  title: string;
  content: string;
  timestamp: string;
  images: ArticleImage[];
  categories: string[];
  references: string[];
}

interface EnrichedData {
  arxiv: ArXivPaper[];
}

const Article = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [enrichedData, setEnrichedData] = useState<EnrichedData | null>(null);
  const [loading, setLoading] = useState(true);

  const handleRelatedArticleClick = async (title: string) => {
    // Search Wikipedia for the article title
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
          title
        )}&utf8=&format=json&origin=*&srlimit=1`
      );
      const data = await response.json();
      if (data?.query?.search?.[0]) {
        navigate(`/article/${data.query.search[0].pageid}`);
      }
    } catch (error) {
      console.error("Error fetching article:", error);
    }
  };

  const handleTopicClick = async (topic: string) => {
    // Search for articles related to this topic
    navigate(`/search?q=${encodeURIComponent(topic)}`);
  };

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    
    // Parallel fetch for faster loading with full content
    const fetchContent = fetch(
      `https://en.wikipedia.org/w/api.php?action=query&pageids=${id}&prop=extracts|info|categories|extlinks&exlimit=1&explaintext&exsectionformat=plain&inprop=url&format=json&origin=*&ellimit=10`
    ).then((res) => res.json());

    const fetchImages = fetch(
      `https://en.wikipedia.org/w/api.php?action=query&pageids=${id}&prop=images&imlimit=30&format=json&origin=*`
    ).then((res) => res.json());

    Promise.all([fetchContent, fetchImages])
      .then(async ([contentData, imagesData]) => {
        const page = contentData?.query?.pages[id];
        if (!page) {
          setLoading(false);
          return;
        }

        // Get image URLs in parallel
        const imageFiles = imagesData?.query?.pages[id]?.images || [];
        const imagePromises = imageFiles
          .filter((img: any) => img.title.match(/\.(jpg|jpeg|png|gif|svg)$/i))
          .slice(0, 15)
          .map((img: any) =>
            fetch(
              `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
                img.title
              )}&prop=imageinfo&iiprop=url&format=json&origin=*`
            )
              .then((r) => r.json())
              .then((imgInfo) => {
                const imgPage = Object.values(imgInfo.query.pages)[0] as any;
                if (imgPage?.imageinfo?.[0]?.url) {
                  return {
                    url: imgPage.imageinfo[0].url,
                    title: img.title,
                  };
                }
                return null;
              })
              .catch(() => null)
          );

        const imageResults = await Promise.all(imagePromises);
        const imageUrls = imageResults.filter((img): img is ArticleImage => img !== null);

        const articleData = {
          title: page.title,
          content: page.extract || "Content not available.",
          timestamp: page.touched,
          images: imageUrls,
          categories: (page.categories || []).map((c: any) => c.title.replace("Category:", "")),
          references: (page.extlinks || []).slice(0, 10).map((link: any) => link["*"]),
        };
        
        setArticle(articleData);
        
        // Only fetch ArXiv for related articles
        searchArXiv(page.title).then((arxivData) => {
          setEnrichedData({
            arxiv: arxivData,
          });
        });
        
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <StarField />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 sm:mb-6 text-sm sm:text-base"
          >
            <ArrowLeft size={20} className="sm:w-5 sm:h-5" />
            <span>Back to Home</span>
          </Link>
        </header>

        {/* Content */}
        {loading ? (
          <div className="animate-pulse space-y-4 sm:space-y-6">
            <div className="h-8 sm:h-10 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="aspect-video bg-muted rounded mt-4 sm:mt-6"></div>
            <div className="space-y-3 mt-6 sm:mt-8">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        ) : article ? (
          <article className="space-y-6 sm:space-y-8">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white text-center px-2">{article.title}</h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground border-b border-border pb-3 sm:pb-4">
              <div className="flex items-center gap-2">
                <Clock size={16} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Last updated {new Date(article.timestamp).toLocaleDateString()}</span>
                <span className="sm:hidden">Updated {new Date(article.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Quick Summary */}
            {article.content && (
              <div className="glass-card border border-blue-400/50 rounded-xl p-4 sm:p-6 backdrop-blur-md bg-blue-400/10 shadow-lg shadow-blue-400/30">
                <h2 className="text-lg sm:text-xl font-serif font-bold mb-3 text-blue-400 flex items-center gap-2">
                  <FileText size={20} className="sm:w-5 sm:h-5" />
                  Quick Summary
                </h2>
                <p className="text-sm sm:text-base text-foreground leading-relaxed">
                  {article.content.split('\n\n')
                    .filter(p => p.trim() && !p.trim().startsWith('==') && p.trim().length > 50)
                    .slice(0, 3)
                    .join(' ')
                    .substring(0, 400)}...
                </p>
              </div>
            )}

            {/* Main Image */}
            {article.images.length > 0 && (
              <div className="w-full rounded-lg overflow-hidden bg-white p-4">
                <img
                  src={article.images[0].url}
                  alt={article.title}
                  className="w-full max-h-[300px] sm:max-h-[400px] md:max-h-[500px] object-contain border border-border/50"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}

            {/* Table of Contents */}
            {article.content.split("\n\n").filter(p => p.trim().startsWith("==")).length > 0 && (
              <div className="mb-6 sm:mb-8 p-4 sm:p-6 glass-card border border-border/50 rounded-xl backdrop-blur-md">
                <h2 className="text-base sm:text-lg font-serif font-bold mb-3 sm:mb-4 text-blue-400">Contents</h2>
                <div className="space-y-2">
                  {article.content.split("\n\n")
                    .filter(p => p.trim().startsWith("=="))
                    .slice(0, 8)
                    .map((heading, idx) => {
                      const cleanHeading = heading.replace(/=+/g, "").trim();
                      const level = heading.match(/^=+/)?.[0].length || 2;
                      return (
                        <div
                          key={idx}
                          className="text-xs sm:text-sm text-muted-foreground hover:text-accent transition-colors cursor-pointer"
                          style={{ paddingLeft: `${(level - 2) * 8}px` }}
                        >
                          {cleanHeading}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Content with inline images */}
            <div className="prose prose-invert max-w-none">
              <div className="text-foreground text-base sm:text-lg leading-relaxed text-justify space-y-4 sm:space-y-6 px-2 sm:px-0">
                {article.content.split("\n").map((paragraph, idx) => {
                  if (!paragraph.trim()) return null;
                  
                  // Skip lines that are just equal signs or formatting
                  if (/^=+$/.test(paragraph.trim())) return null;
                  
                  // Handle headings - check if line starts with == but has content after
                  const headingMatch = paragraph.match(/^(=+)\s*(.+?)\s*=*$/);
                  if (headingMatch) {
                    const level = headingMatch[1].length;
                    const cleanHeading = headingMatch[2].trim();
                    
                    // Skip if heading is empty
                    if (!cleanHeading) return null;
                    
                    const HeadingTag = `h${Math.min(Math.max(level, 2), 4)}` as keyof JSX.IntrinsicElements;
                    return (
                      <HeadingTag
                        key={idx}
                        className="font-serif font-bold mt-8 mb-4 text-blue-400"
                      >
                        {cleanHeading}
                      </HeadingTag>
                    );
                  }
                  
                  // Skip very short lines (likely formatting artifacts)
                  if (paragraph.trim().length < 20) return null;
                  
                  // Enhanced keyword and quote highlighting
                  let highlighted = paragraph;
                  
                  // Highlight quotes
                  highlighted = highlighted.replace(
                    /"([^"]+)"/g,
                    '<span class="italic text-accent border-l-2 border-accent pl-2 block my-2">"$1"</span>'
                  );
                  
                  // Highlight keywords from title
                  const keywords = article.title.split(" ").filter(w => w.length > 3);
                  keywords.forEach(keyword => {
                    const regex = new RegExp(`\\b(${keyword})\\b`, "gi");
                    highlighted = highlighted.replace(
                      regex,
                      '<mark class="bg-accent/20 text-accent font-semibold px-1 rounded">$1</mark>'
                    );
                  });
                  
                  // Insert inline images every 5 paragraphs
                  const imageIndex = Math.floor(idx / 10);
                  const shouldShowImage = idx % 10 === 0 && imageIndex > 0 && imageIndex < article.images.length;
                  
                  return (
                    <div key={idx}>
                      <p
                        dangerouslySetInnerHTML={{ __html: highlighted }}
                        className="mb-4 leading-relaxed"
                      />
                      {shouldShowImage && (
                        <figure className="my-8 rounded-lg overflow-hidden border border-accent/30 shadow-lg bg-white p-4">
                          <img
                            src={article.images[imageIndex].url}
                            alt={article.images[imageIndex].title}
                            className="w-full max-h-96 object-contain"
                            onError={(e) => {
                              e.currentTarget.parentElement!.style.display = "none";
                            }}
                          />
                          <figcaption className="text-xs text-muted-foreground p-3 bg-card/50">
                            {article.images[imageIndex].title.replace(/^File:/i, "").replace(/\.[^.]+$/, "")}
                          </figcaption>
                        </figure>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* References Section */}
            {article.references.length > 0 && (
              <div className="mt-8 sm:mt-12 p-4 sm:p-6 glass-card border border-border/50 rounded-xl backdrop-blur-md">
                <h2 className="text-xl sm:text-2xl font-serif font-bold mb-4 sm:mb-6 text-blue-400">References & External Links</h2>
                <div className="space-y-2 sm:space-y-3">
                  {article.references.map((ref, idx) => (
                    <a
                      key={idx}
                      href={ref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs sm:text-sm text-accent hover:text-accent/80 transition-colors border-l-2 border-accent/50 pl-3 py-1 break-all"
                    >
                      [{idx + 1}] {ref}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Related Articles from ArXiv */}
            {enrichedData?.arxiv && enrichedData.arxiv.length > 0 && (
              <div className="mt-8 sm:mt-12 p-4 sm:p-6 glass-card border border-border/50 rounded-xl backdrop-blur-md">
                <h2 className="text-xl sm:text-2xl font-serif font-bold mb-4 sm:mb-6 text-blue-400 flex items-center gap-2">
                  <FileText size={20} className="sm:w-6 sm:h-6" />
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {enrichedData.arxiv.map((paper) => (
                    <div 
                      key={paper.id} 
                      onClick={() => handleRelatedArticleClick(paper.title)}
                      className="p-3 sm:p-4 glass-card-light rounded-lg border border-accent/20 hover:border-accent/60 transition-all cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-accent/20"
                    >
                      <h3 className="font-semibold text-accent mb-2 line-clamp-2 text-sm sm:text-base">{paper.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {paper.authors.slice(0, 2).join(", ")} • {new Date(paper.published).toLocaleDateString()}
                      </p>
                      <p className="text-xs sm:text-sm text-foreground mb-3 line-clamp-3">{paper.summary}</p>
                      <div className="text-xs text-accent hover:underline font-medium">
                        Click to read article →
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Images Gallery */}
            {article.images.length > 8 && (
              <div className="mt-8 sm:mt-12">
                <h2 className="text-xl sm:text-2xl font-serif font-bold mb-4 sm:mb-6 text-blue-400">Image Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {article.images.slice(8).map((img, idx) => (
                    <div key={idx} className="aspect-square overflow-hidden rounded-lg border border-border/50 group bg-white p-2">
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.parentElement!.style.display = "none";
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Categories */}
            {article.categories.length > 0 && (
              <div className="mt-8 sm:mt-12 p-4 sm:p-6 glass-card border border-border/50 rounded-xl backdrop-blur-md">
                <h2 className="text-lg sm:text-xl font-serif font-bold mb-3 sm:mb-4 text-blue-400">Related Topics</h2>
                <div className="flex flex-wrap gap-2">
                  {article.categories.slice(0, 15).map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTopicClick(cat)}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 glass-card-light border border-accent/30 text-accent rounded-full text-xs sm:text-sm hover:border-accent/60 hover:scale-105 transition-all cursor-pointer hover:shadow-lg hover:shadow-accent/20"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Attribution */}
            <div className="mt-8 sm:mt-12 p-4 sm:p-6 glass-card border border-border/50 rounded-xl backdrop-blur-md">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                    <span className="font-semibold text-foreground">Knowledge Source:</span> Content aggregated from multiple verified APIs including research papers, code repositories, and knowledge bases.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last updated: {new Date(article.timestamp).toLocaleString()} • Multi-source AI synthesis
                  </p>
                </div>
              </div>
            </div>
          </article>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Article not found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Article;
