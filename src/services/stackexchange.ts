// Stack Exchange API Service
const STACK_EXCHANGE_API_KEY = "rl_fLfgozTWPWknP8AhUn7TahySJ";
const STACK_EXCHANGE_BASE_URL = "https://api.stackexchange.com/2.3";

// Cache for faster subsequent requests
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export interface StackExchangeAnswer {
  question_id: number;
  answer_id: number;
  title: string;
  body: string;
  score: number;
  is_accepted: boolean;
  link: string;
  creation_date: number;
}

export const searchStackExchange = async (query: string): Promise<StackExchangeAnswer[]> => {
  const cacheKey = `se_${query}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `${STACK_EXCHANGE_BASE_URL}/search/advanced?order=desc&sort=relevance&q=${encodeURIComponent(
        query
      )}&accepted=True&site=stackoverflow&filter=withbody&key=${STACK_EXCHANGE_API_KEY}`
    );
    
    const data = await response.json();
    const results = data.items?.slice(0, 5) || [];
    
    cache.set(cacheKey, { data: results, timestamp: Date.now() });
    return results;
  } catch (error) {
    console.error("Stack Exchange API error:", error);
    return [];
  }
};
