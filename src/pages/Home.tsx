import { Moon, Sun, BookOpen, Download } from "lucide-react";
import StarField from "@/components/StarField";
import SearchBar from "@/components/SearchBar";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Home = () => {
  const [articleCount, setArticleCount] = useState(0);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Fetch Gigabase Knowledge Database statistics
    fetch("https://en.wikipedia.org/w/api.php?action=query&meta=siteinfo&siprop=statistics&format=json&origin=*")
      .then(res => res.json())
      .then(data => {
        const count = data?.query?.statistics?.articles || 6885279;
        setArticleCount(count);
      })
      .catch(() => setArticleCount(6885279));
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

  const handleDownload = () => {
    console.log('Download button clicked!');
    try {
      const link = document.createElement('a');
      const apkPath = `${import.meta.env.BASE_URL}gigabase.apk`;
      console.log('APK Path:', apkPath);
      link.href = apkPath;
      link.download = 'Gigabase.apk';
      link.setAttribute('download', 'Gigabase.apk');
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
      console.log('Download triggered successfully!');
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    }
  };

  return (
    <motion.div 
      className="min-h-screen relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background */}
      <StarField />
      
      {/* Download App Button */}
      <button
        onClick={handleDownload}
        className="absolute top-4 right-16 sm:top-6 sm:right-20 z-50 glass-card border-2 border-green-500 hover:border-green-400 bg-green-500/20 hover:bg-green-500/30 px-4 py-2 sm:px-6 sm:py-3 rounded-full transition-colors group cursor-pointer shadow-lg hover:shadow-xl flex items-center gap-2"
        aria-label="Download Android App"
        title="Download Android App"
      >
        <Download size={18} className="sm:w-5 sm:h-5 text-green-300 group-hover:text-green-200" />
        <span className="text-sm sm:text-base font-semibold text-green-300 group-hover:text-green-200">Download App</span>
      </button>
      
      {/* Dark mode toggle */}
      <motion.button 
        onClick={toggleTheme}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 glass-card-light hover:bg-secondary p-2.5 sm:p-3 rounded-full transition-all"
        aria-label="Toggle theme"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 20,
          delay: 0.3
        }}
      >
        {isDark ? (
          <Sun size={18} className="sm:w-5 sm:h-5 text-yellow-400" />
        ) : (
          <Moon size={18} className="sm:w-5 sm:h-5 text-blue-400" />
        )}
      </motion.button>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6">
        <div className="text-center space-y-8 sm:space-y-12 w-full max-w-4xl">
          {/* Logo */}
          <motion.div 
            className="space-y-2"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: 0.2
            }}
          >
            <motion.h1 
              className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight text-white"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 150,
                damping: 20,
                delay: 0.4
              }}
            >
              Gigabase
            </motion.h1>
          </motion.div>

          {/* Search */}
          <motion.div 
            className="w-full max-w-2xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: 0.6
            }}
          >
            <SearchBar />
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="w-full max-w-md mx-auto glass-card border border-border/50 rounded-xl p-6 backdrop-blur-md"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: 0.8
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <BookOpen className="text-blue-400" size={24} />
              <motion.div 
                className="text-4xl font-bold text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 1.0
                }}
              >
                {articleCount.toLocaleString()}
              </motion.div>
            </div>
            <div className="text-sm text-muted-foreground">Articles Available</div>
            <div className="text-xs text-muted-foreground mt-1">Continuously updated knowledge base</div>
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
};

export default Home;
