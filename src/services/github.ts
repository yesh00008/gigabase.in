// GitHub API Service
const GITHUB_BASE_URL = "https://api.github.com";

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string;
  topics: string[];
  updated_at: string;
}

export interface GitHubCode {
  name: string;
  path: string;
  html_url: string;
  repository: {
    full_name: string;
    description: string;
  };
}

export const searchGitHubRepos = async (query: string): Promise<GitHubRepo[]> => {
  const cacheKey = `gh_repos_${query}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `${GITHUB_BASE_URL}/search/repositories?q=${encodeURIComponent(
        query
      )}&sort=stars&order=desc&per_page=5`
    );
    
    const data = await response.json();
    const results = data.items || [];
    
    cache.set(cacheKey, { data: results, timestamp: Date.now() });
    return results;
  } catch (error) {
    console.error("GitHub API error:", error);
    return [];
  }
};

export const searchGitHubCode = async (query: string): Promise<GitHubCode[]> => {
  const cacheKey = `gh_code_${query}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `${GITHUB_BASE_URL}/search/code?q=${encodeURIComponent(query)}&per_page=5`
    );
    
    const data = await response.json();
    const results = data.items || [];
    
    cache.set(cacheKey, { data: results, timestamp: Date.now() });
    return results;
  } catch (error) {
    console.error("GitHub Code API error:", error);
    return [];
  }
};
