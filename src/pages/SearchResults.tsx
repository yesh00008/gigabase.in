import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import StarField from "@/components/StarField";
import SearchBar from "@/components/SearchBar";

interface SearchResult {
  pageid: number;
  title: string;
  snippet: string;
  timestamp: string;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        query
      )}&utf8=&format=json&origin=*&srlimit=20`
    )
      .then((res) => res.json())
      .then((data) => {
        setResults(data?.query?.search || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
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
        <div className="space-y-3 sm:space-y-4">
          {loading ? (
            <div className="space-y-3 sm:space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card border border-border/50 rounded-xl p-4 sm:p-6 animate-pulse backdrop-blur-md">
                  <div className="h-5 sm:h-6 bg-muted rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-muted-foreground text-sm sm:text-base">No results found for "{query}"</p>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base px-2 sm:px-0">
                Found {results.length} results for "{query}"
              </p>
              {results.map((result) => (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
