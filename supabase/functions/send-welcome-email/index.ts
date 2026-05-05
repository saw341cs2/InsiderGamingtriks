import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const resendApiKey = Deno.env.get("RESEND_API_KEY");

const FROM_EMAIL = "InsiderGamingTricks <onboarding@resend.dev>";

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
        subject: "Bienvenue chez Insider Gaming Tricks 🎮",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; background: #0f0f0f; color: #fff; padding: 40px; margin: 0; }
              .container { max-width: 600px; margin: 0 auto; background: #1a1a2e; border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
              h1 { color: #dc2626; margin-bottom: 20px; font-size: 26px; }
              p { color: #ccc; line-height: 1.8; margin-bottom: 16px; }
              ul { color: #ccc; line-height: 2; padding-left: 20px; }
              li { margin-bottom: 8px; }
              .discord { background: #5865F2; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; display: inline-block; margin: 10px 5px; font-weight: bold; }
              .youtube { background: #FF0000; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; display: inline-block; margin: 10px 5px; font-weight: bold; }
              .btn { display: block; width: 250px; margin: 30px auto; padding: 18px; background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; text-align: center; border-radius: 8px; text-decoration: none; font-weight: bold; box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3); }
              .footer { color: #888; font-size: 12px; margin-top: 40px; text-align: center; border-top: 1px solid #333; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Salut ${username || 'toi'} et bienvenue !</h1>

              <p>Quelle bonne nouvelle de te voir rejoindre les rangs d'Insider Gaming Tricks ! Franchement, ça fait super plaisir.</p>

              <p>Ici, oublie les complexes et les "pro" qui gardent leurs astuces pour eux. Notre seule règle, c'est le partage. Que tu sois là pour progresser, pour trouver des coéquipiers ou juste pour parler de tes jeux préférés, t'es au bon endroit.</p>

              <p><strong>Quelques petites choses pour démarrer :</strong></p>
              <ul>
                 <li>Viens nous dire bonjour sur le <a href="https://discord.gg/rnh32gTDjp" style="color: #5865F2;">Discord</a>, c'est notre quartier général et l'ambiance y est top.</li>
                <li>Jette un œil aux dernières astuces sur le site, y a sûrement de quoi t'aider à monter ton rank.</li>
                <li>N'hésite <strong>JAMAIS</strong> à poser une question, même si tu trouves ça "noob". La seule question bête, c'est celle qu'on ne pose pas.</li>
              </ul>

              <p>On est une communauté de passionnés, et on est ultra heureux de t'avoir avec nous pour faire grandir le truc.</p>

              <p>Allez, à très vite en game !</p>

              <p><strong>Bienvenue dans la famille. 🎮</strong></p>

              <hr style="border: 0; border-top: 1px solid #333; margin: 30px 0;">

              <p style="text-align: center;"><strong>📢 Rejoins-nous :</strong></p>
              <p style="text-align: center;">
                 <a href="https://discord.gg/rnh32gTDjp" class="discord">Discord</a>
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
