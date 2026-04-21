import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const resendApiKey = Deno.env.get("RESEND_API_KEY");

// Adresse d'expédition officielle du site
const FROM_EMAIL = "Insider Gaming Tricks <insiderhackgaming@gmail.com>";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { email, username } = await req.json();

    if (!email) return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: email,
        subject: "Bienvenue chez Insider Gaming Tricks 👾",
        html: `
          <div style="font-family: Arial, sans-serif; background: #0f0f0f; color: #fff; padding: 40px; border-radius: 16px;">
            <h1>Salut ${username || 'Aventurier'},</h1>
            <p>Bienvenue chez <strong>Insider Gaming Tricks 👾</strong></p>
            <p>Ici, pas de blabla inutile : que du concret pour t’aider à progresser.</p>
            <p>On est encore au début de l’aventure, et c’est justement ce qui la rend intéressante.</p>
            <p>Alors profite, teste, et surtout… fais-toi plaisir 🔥</p>
            <p>GG et à très vite en game 🎧</p>
            <p>— L’équipe Insider Gaming Tricks<br><em>One Hack At A Time</em></p>
            <hr style="border: 0; border-top: 1px solid #333; margin: 30px 0;">
            <a href="https://fab34.github.io/InsiderGamingtriks/" style="display: inline-block; padding: 15px 30px; background: #8b5cf6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Accéder au site →</a>
          </div>
        `,
      }),
    });

    return new Response(JSON.stringify({ message: "Sent" }), { 
      status: 200, 
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } 
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});