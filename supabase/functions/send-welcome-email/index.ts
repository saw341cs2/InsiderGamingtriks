import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const resendApiKey = Deno.env.get("RESEND_API_KEY");

// NOTE: onboarding@resend.dev only works for the email associated with the Resend account.
// For production, you must verify a domain in Resend and use an email from that domain.
const FROM_EMAIL = "InsiderGamingTricks <onboarding@resend.dev>";

serve(async (req) => {
  // Handle CORS
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

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
    }

    console.log(`Sending welcome email via Resend to ${email}...`);

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
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; background: #0f0f0f; color: #fff; padding: 40px; margin: 0; }
              .container { max-width: 600px; margin: 0 auto; background: #1a1a2e; border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
              h1 { color: #8b5cf6; margin-bottom: 10px; font-size: 24px; }
              p { color: #ccc; line-height: 1.6; margin-bottom: 20px; }
              .highlight { background: #8b5cf6; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
              .discord { background: #5865F2; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; display: inline-block; margin: 10px 5px; font-weight: bold; }
              .youtube { background: #FF0000; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; display: inline-block; margin: 10px 5px; font-weight: bold; }
              .btn { display: block; width: 250px; margin: 30px auto; padding: 18px; background: linear-gradient(135deg, #8b5cf6, #a855f7); color: white; text-align: center; border-radius: 8px; text-decoration: none; font-weight: bold; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3); }
              .footer { color: #888; font-size: 12px; margin-top: 40px; text-align: center; border-top: 1px solid #333; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Salut ${username || 'Aventurier'},</h1>
              <p>Bienvenue chez <strong>Insider Gaming Tricks 👾</strong></p>

              <p>Ici, pas de blabla inutile : que du concret pour t’aider à progresser, découvrir des astuces et échanger avec des joueurs qui veulent vraiment passer au niveau supérieur.</p>

              <p><strong>🎮 Ce que tu peux faire dès maintenant :</strong></p>
              
              <p>👉 <strong>Explorer les astuces</strong> → améliore ton niveau rapidement</p>
              <p>👉 <strong>Rejoindre la communauté</strong> → discute avec d’autres joueurs sur Discord</p>
              <p>👉 <strong>Suivre les nouveautés</strong> → reste à jour sur les meilleurs tips</p>

              <p>On est encore au début de l’aventure, et c’est justement ce qui la rend intéressante. Les premiers membres comme toi vont clairement influencer l’ambiance et l’évolution du projet.</p>

              <p>Alors profite, teste, et surtout… fais-toi plaisir 🔥</p>

              <p>GG et à très vite en game 🎧</p>

              <p>— L’équipe Insider Gaming Tricks<br>
              <em>One Hack At A Time</em></p>

              <div class="highlight">
                <strong>Important :</strong> Tu vas recevoir un second email pour confirmer ton adresse email.
              </div>

              <hr style="border: 0; border-top: 1px solid #333; margin: 30px 0;">

              <p style="text-align: center;"><strong>📢 Rejoins-nous :</strong></p>
              <p style="text-align: center;">
                <a href="https://discord.gg/XsHYc4tQpx" class="discord">Discord</a>
                <a href="https://www.youtube.com/@InsiderHackGaming" class="youtube">YouTube</a>
              </p>

              <a href="https://fab34.github.io/InsiderGamingtriks/" class="btn">Aller sur le site →</a>

              <div class="footer">
                <p>© 2026 Insider Gaming Tricks - Tous droits réservés</p>
                <p>Si tu n'as pas demandé cette inscription, ignore cet email.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error("Resend API error:", errorText);
      return new Response(JSON.stringify({ error: errorText }), { 
        status: resendResponse.status, 
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } 
      });
    }

    console.log("Welcome email sent successfully!");
    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
});