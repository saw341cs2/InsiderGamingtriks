import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the NewsAPI key from environment variables
    const newsApiKey = Deno.env.get('NEWS_API_KEY');
    if (!newsApiKey) {
      throw new Error('NEWS_API_KEY not configured');
    }

    // Get query parameters
    const url = new URL(req.url);
    const count = parseInt(url.searchParams.get('count') || '9');
    const query = url.searchParams.get('query') || 'gaming video games';

    // Fetch gaming news from NewsAPI
    const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=fr&sortBy=publishedAt&pageSize=${count}&apiKey=${newsApiKey}`;
    
    const response = await fetch(newsApiUrl);
    const data = await response.json();

    if (data.status !== 'ok') {
      throw new Error(data.message || 'NewsAPI error');
    }

    // Transform the articles to match the expected format
    const articles = data.articles.map((article: any, index: number) => ({
      uri: article.url || `article-${index}`,
      title: article.title,
      body: article.description || article.content || '',
      url: article.url,
      image: article.urlToImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=250&fit=crop',
      dateTimePub: article.publishedAt,
      source: { title: article.source.name }
    }));

    return new Response(
      JSON.stringify({ articles: { results: articles } }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
