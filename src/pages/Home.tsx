import { Moon, Sun } from "lucide-react";
import StarField from "@/components/StarField";
import SearchBar from "@/components/SearchBar";
import { useEffect, useState } from "react";

const Home = () => {
  const [articleCount, setArticleCount] = useState("0");
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Fetch Wikipedia statistics
    fetch("https://en.wikipedia.org/w/api.php?action=query&meta=siteinfo&siprop=statistics&format=json&origin=*")
      .then(res => res.json())
      .then(data => {
        const count = data?.query?.statistics?.articles || 0;
        setArticleCount(count.toLocaleString());
      })
      .catch(() => setArticleCount("885,279"));
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarField />
      
      {/* Dark mode toggle */}
      <button 
        onClick={toggleTheme}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 glass-card-light hover:bg-secondary p-2.5 sm:p-3 rounded-full transition-all hover:scale-110 active:scale-95"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun size={18} className="sm:w-5 sm:h-5 text-yellow-400" />
        ) : (
          <Moon size={18} className="sm:w-5 sm:h-5 text-blue-400" />
        )}
      </button>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6">
        <div className="text-center space-y-8 sm:space-y-12 animate-in fade-in duration-700 w-full max-w-4xl">
          {/* Logo */}
          <div className="space-y-2">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight text-white">
              Gigabase
            </h1>
          </div>

          {/* Search */}
          <div className="w-full max-w-2xl mx-auto">
            <SearchBar />
          </div>

          {/* Stats */}
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs sm:text-sm">Articles Available</p>
            <p className="text-2xl sm:text-3xl font-bold">{articleCount}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
