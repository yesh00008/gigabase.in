import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, ExternalLink, SortAsc, SortDesc } from "lucide-react";
import StarField from "@/components/StarField";
import { getAllProgrammingResources, ProgrammingResource } from "@/services/programmingKnowledge";

type SortField = 'title' | 'category';
type SortOrder = 'asc' | 'desc';

const ResourcesTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortField, setSortField] = useState<SortField>('category');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const allResources = getAllProgrammingResources();

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(allResources.map(r => r.category));
    return ['All', ...Array.from(cats).sort()] as string[];
  }, [allResources]);

  // Filter and sort resources
  const filteredResources = useMemo(() => {
    let filtered = allResources;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(r => r.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      let compareA = a[sortField];
      let compareB = b[sortField];

      if (sortOrder === 'asc') {
        return compareA.localeCompare(compareB);
      } else {
        return compareB.localeCompare(compareA);
      }
    });

    return filtered;
  }, [allResources, searchQuery, selectedCategory, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <StarField />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <header className="mb-6 sm:mb-8 space-y-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </Link>

          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2">
              Programming Resources
            </h1>
            <p className="text-muted-foreground">
              Comprehensive collection of 680+ curated GitHub repositories and learning resources
            </p>
          </div>

          {/* Search and Filter */}
          <div className="glass-card border border-border/50 rounded-xl p-4 backdrop-blur-md space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-accent text-white border border-accent'
                      : 'bg-background/50 text-muted-foreground border border-border hover:border-accent/50'
                  }`}
                >
                  {cat}
                  {cat !== 'All' && (
                    <span className="ml-2 text-xs opacity-70">
                      ({allResources.filter(r => r.category === cat).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
            <p>
              Showing <span className="text-accent font-semibold">{filteredResources.length}</span> of{' '}
              <span className="text-accent font-semibold">{allResources.length}</span> resources
            </p>
          </div>
        </header>

        {/* Table */}
        <div className="glass-card border border-border/50 rounded-xl backdrop-blur-md overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background/50 border-b border-border">
                <tr>
                  <th className="text-left px-6 py-4">
                    <button
                      onClick={() => handleSort('title')}
                      className="flex items-center gap-2 font-semibold text-foreground hover:text-accent transition-colors"
                    >
                      Title
                      {sortField === 'title' && (
                        sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="text-left px-6 py-4">
                    <button
                      onClick={() => handleSort('category')}
                      className="flex items-center gap-2 font-semibold text-foreground hover:text-accent transition-colors"
                    >
                      Category
                      {sortField === 'category' && (
                        sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">Description</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredResources.map((resource, idx) => (
                  <tr key={idx} className="hover:bg-accent/5 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-foreground">{resource.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {resource.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {resource.description}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm">View</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-border/30">
            {filteredResources.map((resource, idx) => (
              <div key={idx} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{resource.title}</h3>
                    <span className="inline-block px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {resource.category}
                    </span>
                  </div>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 text-accent hover:text-accent/80 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
                <p className="text-sm text-muted-foreground">
                  {resource.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No resources found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesTable;
