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
        from: "InsiderGamingTricks <noreply@ton-domaine.com>",
        to: email,
        subject: "Bienvenue sur InsiderGamingTricks 🎮",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; background: #0f0f0f; color: #fff; padding: 40px; margin: 0; }
              .container { max-width: 600px; margin: 0 auto; background: #1a1a2e; border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
              h1 { color: #8b5cf6; margin-bottom: 10px; }
              .subtitle { color: #a855f7; font-size: 18px; margin-bottom: 30px; }
              .highlight { background: #8b5cf6; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
              .discord { background: #5865F2; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; display: inline-block; margin: 10px 5px; }
              .youtube { background: #FF0000; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; display: inline-block; margin: 10px 5px; }
              .btn { display: block; width: 250px; margin: 30px auto; padding: 18px; background: linear-gradient(135deg, #8b5cf6, #a855f7); color: white; text-align: center; border-radius: 8px; text-decoration: none; font-weight: bold; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3); }
              .footer { color: #888; font-size: 12px; margin-top: 40px; text-align: center; border-top: 1px solid #333; padding-top: 20px; }
              .warning { background: #f59e0b; color: #000; padding: 15px; border-radius: 8px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Bienvenue sur InsiderGamingTricks ${username} !</h1>
              <div class="subtitle">Ton compte a été créé avec succès</div>

              <div class="highlight">
                <strong>✅ Inscription réussie !</strong><br>
                Ton compte a été créé. Tu vas recevoir un second email pour confirmer ton adresse email.
              </div>

              <p>Salut <strong>${username}</strong> 👋</p>

              <p>Ton compte sur <strong>InsiderGamingTricks</strong> a été crééavec succès ! 🎉</p>

              <p>Tu vas recevoir un autre email avec le lien de confirmation de ton adresse email. Clique sur ce lien pour activer ton compte et accéder à toutes les fonctionnalités.</p>

              <p>Une fois confirmé, tu pourras :</p>
              <ul>
                <li>🔓 Accéder à toutes les astuces et guides</li>
                <li>💬 Participer à la communauté Discord</li>
                <li>🎥 Regarder les vidéos exclusives</li>
                <li>⭐ Profiter du contenu premium</li>
              </ul>

              <p>Si tu ne reçois pas l'email de confirmation dans les prochaines minutes, vérifie ton dossier spam ou contacte-nous sur Discord.</p>

              <hr style="border: 1px solid #333; margin: 30px 0;">

              <p><strong>📢 Rejoins-nous dès maintenant :</strong></p>
              <p>
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