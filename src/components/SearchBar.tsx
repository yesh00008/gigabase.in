import { Search, ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

interface Suggestion {
  title: string;
  pageid: number;
  snippet?: string;
}

const SearchBar = ({ onSearch, placeholder = "Search for anything..." }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length > 2) {
      const timer = setTimeout(() => {
        fetch(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
            query
          )}&utf8=&format=json&origin=*&srlimit=8`
        )
          .then((res) => res.json())
          .then((data) => {
            const results = data?.query?.search || [];
            const suggs = results.map((result: any) => ({
              title: result.title,
              pageid: result.pageid,
              snippet: result.snippet.replace(/<\/?[^>]+(>|$)/g, ""),
            }));
            setSuggestions(suggs);
            setShowSuggestions(true);
          })
          .catch(() => setSuggestions([]));
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
    }
  };

  const handleSuggestionClick = (title: string) => {
    setShowSuggestions(false);
    setQuery(title);
    navigate(`/search?q=${encodeURIComponent(title)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
      <div className="relative flex items-center">
        <Search className="absolute left-4 sm:left-6 text-muted-foreground z-10" size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="w-full glass-card border border-border/50 rounded-full py-3 sm:py-4 pl-11 sm:pl-14 pr-12 sm:pr-14 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent/50 transition-all backdrop-blur-md"
        />
        <button
          type="submit"
          className="absolute right-2 glass-card-light hover:bg-muted text-foreground rounded-full p-2 sm:p-3 transition-colors z-10"
          aria-label="Search"
        >
          <ArrowUp size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div 
            className="absolute top-full mt-2 w-full glass-card border border-border/50 rounded-xl shadow-lg shadow-accent/10 z-20 max-h-80 sm:max-h-96 overflow-y-auto backdrop-blur-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion.pageid}
                type="button"
                onMouseDown={() => handleSuggestionClick(suggestion.title)}
                className="w-full text-left px-4 sm:px-6 py-3 sm:py-4 hover:bg-accent/10 transition-colors border-b border-border/30 last:border-b-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <Search size={14} className="sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="text-foreground font-medium mb-1 text-sm sm:text-base truncate sm:whitespace-normal">{suggestion.title}</div>
                    {suggestion.snippet && (
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {suggestion.snippet}
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

export default SearchBar;
