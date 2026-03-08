// Schedule: Exécuter tous les jours à 7h00 (UTC+1 = 6h UTC)
// Version améliorée avec contenu original via IA
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fonction pour générer un titre original avec l'IA
async function generateOriginalTitle(article: any, apiKey: string): Promise<string> {
  try {
    const prompt = `Tu es un rédacteur gaming français expert. Transforme ce titre en quelque chose de nouveau et accrocheur (max 100 caractères, en français):
"${article.title}"
Formule uniquement le nouveau titre, rien d'autre.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    if (data.choices && data.choices[0]) {
      return data.choices[0].message.content.trim();
    }
  } catch (e) {
    console.log('IA title generation failed, using original');
  }
  return article.title;
}

// Fonction pour générer un résumé original
async function generateOriginalBody(article: any, apiKey: string): Promise<string> {
  try {
    const prompt = `Tu es un rédacteur gaming français expert. Résume cet article de façon originale et engageante (max 200 caractères):
"${article.title}"
${article.description || ''}
Formule uniquement le résumé, rien d'autre.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
      }),
    });

    const data = await response.json();
    if (data.choices && data.choices[0]) {
      return data.choices[0].message.content.trim();
    }
  } catch (e) {
    console.log('IA body generation failed, using original');
  }
  return article.description || article.content || '';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const newsApiKey = Deno.env.get('NEWS_API_KEY');
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY'); // Clé OpenAI pour contenu original
    
    if (!newsApiKey) {
      throw new Error('NEWS_API_KEY not configured');
    }

    // Recherches pour coverir les 3 thématiques
    const queries = [
      { query: 'gaming jeux vidéo actualité 2024', topic: 'jeux' },
      { query: 'esports compétition gaming tournament', topic: 'compétition' },
      { query: 'matériel PC gaming hardware carte graphique', topic: 'matériel' }
    ];
    
    const allArticles: any[] = [];
    
    // Récupérer des articles de chaque catégorie
    for (const q of queries) {
      const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q.query)}&language=fr&sortBy=publishedAt&pageSize=5&apiKey=${newsApiKey}`;
      
      const response = await fetch(newsApiUrl);
      const data = await response.json();
      
      if (data.status === 'ok' && data.articles) {
        data.articles.forEach((a: any) => {
          a.topic = q.topic;
          allArticles.push(a);
        });
      }
    }
    
    // Prendre 2 articles aléatoires de topics différents si possible
    const shuffled = allArticles.sort(() => 0.5 - Math.random());
    const selectedArticles = shuffled.slice(0, 2);
    
    // Obtenir la date d'aujourd'hui (Paris)
    const now = new Date();
    now.setHours(now.getHours() + 1);
    const today = now.toISOString().split('T')[0];
    
    // Vérifier si des news existent déjà aujourd'hui
    const { data: existingNews } = await supabase
      .from('daily_news')
      .select('*')
      .eq('publish_date', today);
    
    if (existingNews && existingNews.length > 0) {
      return new Response(
        JSON.stringify({ message: 'News already published today', count: existingNews.length }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Transformer et insérer les articles avec contenu original
    const newsToInsert = await Promise.all(
      selectedArticles.map(async (article) => {
        let title = article.title;
        let body = article.description || article.content || '';
        
        // Si OpenAI est configuré, générer du contenu original
        if (openaiApiKey) {
          title = await generateOriginalTitle(article, openaiApiKey);
          body = await generateOriginalBody(article, openaiApiKey);
        }
        
        return {
          title,
          body,
          url: article.url,
          image: article.urlToImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=250&fit=crop',
          source: article.source.name,
          topic: article.topic,
          publish_date: today,
          created_at: new Date().toISOString()
        };
      })
    );
    
    const { error } = await supabase
      .from('daily_news')
      .insert(newsToInsert);
    
    if (error) throw error;
    
    return new Response(
      JSON.stringify({ 
        message: '✓ 2 news originales publiées avec succès!', 
        articles: newsToInsert.map(n => ({ title: n.title, topic: n.topic }))
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
