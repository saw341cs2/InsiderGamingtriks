import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resendApiKey = Deno.env.get("RESEND_API_KEY");

interface SignUpPayload {
  email: string;
  username: string;
}

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

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Insider Gaming Tricks <onboarding@resend.dev>",
        to: email,
        subject: "🎮 Bienvenue sur Insider Gaming Tricks !",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; background: #0f0f0f; color: #fff; padding: 40px; }
              .container { max-width: 600px; margin: 0 auto; background: #1a1a2e; border-radius: 16px; padding: 40px; }
              h1 { color: #8b5cf6; }
              .discord { background: #5865F2; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; display: inline-block; margin: 10px 0; }
              .youtube { background: #FF0000; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; display: inline-block; margin: 10px 0; }
              .btn { display: block; width: 200px; margin: 20px auto; padding: 15px; background: #8b5cf6; color: white; text-align: center; border-radius: 8px; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🎮 Bienvenue ${username} !</h1>
              <p>Merci de t'être inscrit sur Insider Gaming Tricks !</p>
              <p>Rejoins notre communauté pour:</p>
              <ul>
                <li>Recevoir des tips exclusifs</li>
                <li>Participer aux tournois</li>
                <li>Échanger avec d'autres joueurs</li>
              </ul>
              <p><strong>Discord:</strong> <a href="https://discord.gg/XsHYc4tQpx" class="discord">Rejoindre le Discord</a></p>
              <p><strong>YouTube:</strong> <a href="https://www.youtube.com/@InsiderHackGaming" class="youtube">S'abonner</a></p>
              <a href="https://fab34.github.io/InsiderGamingtriks/" class="btn">Commencer</a>
              <p style="color: #888; font-size: 12px; margin-top: 30px;">
                © 2026 Insider Gaming Tricks
              </p>
            </div>
          </body>
          </html>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const error = await resendResponse.text();
      console.error("Resend error:", error);
      return new Response(JSON.stringify({ error }), { status: 500 });
    }

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});