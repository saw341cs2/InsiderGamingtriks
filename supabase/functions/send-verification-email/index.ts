import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

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

    console.log(`Generating verification link for ${email}...`);

    // Create admin client to generate email link
    const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!);

    // Generate email confirmation link
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateEmailLink({
      type: "signup",
      email: email,
      options: {
        redirectTo: "https://saw341cs2.github.io/InsiderGamingtriks/index.html",
      },
    });

    if (linkError) {
      console.error("Link generation error:", linkError);
      return new Response(JSON.stringify({ error: linkError.message }), { status: 500 });
    }

    const confirmationLink = linkData?.properties.action_link;

    if (!confirmationLink) {
      console.error("No confirmation link generated");
      return new Response(JSON.stringify({ error: "Could not generate confirmation link" }), { status: 500 });
    }

    console.log(`Sending verification email via Resend to ${email}...`);

    // Send verification email via Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: email,
        subject: "Confirme ton email - InsiderGamingTricks 🔐",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; background: #0f0f0f; color: #fff; padding: 40px; margin: 0; }
              .container { max-width: 600px; margin: 0 auto; background: #1a1a2e; border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
              h1 { color: #dc2626; margin-bottom: 10px; }
              .subtitle { color: #f87171; font-size: 18px; margin-bottom: 30px; }
              .highlight { background: #dc2626; color: white; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center; }
              .btn { display: block; width: 300px; margin: 40px auto; padding: 20px; background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; text-align: center; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3); }
              .btn:hover { background: linear-gradient(135deg, #b91c1c, #991b1b); }
              .code-box { background: #0f0f0f; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; font-family: monospace; word-break: break-all; font-size: 12px; }
              .footer { color: #888; font-size: 12px; margin-top: 40px; text-align: center; border-top: 1px solid #333; padding-top: 20px; }
              .warning { background: #f59e0b; color: #000; padding: 15px; border-radius: 8px; margin: 20px 0; font-weight: bold; }
              .timer { color: #f87171; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🔐 Confirme ton inscription</h1>
              <div class="subtitle">Complète la vérification en un clic</div>

              <div class="highlight">
                <strong>✅ Compte détecté !</strong><br>
                Clique ci-dessous pour valider ton adresse email.
              </div>

              <p>Salut <strong>${username || 'Aventurier'}</strong> 👋</p>

              <p>Tu es presque prêt(e) ! Il te reste juste à confirmer que cette adresse email t'appartient.</p>

              <div class="warning">
                ⚠️ Ce lien expire dans <span class="timer">24 heures</span>
              </div>

              <a href="${confirmationLink}" class="btn">✓ Valider mon inscription</a>

              <p style="text-align: center; margin: 30px 0;">ou copie ce lien :</p>
              <div class="code-box">${confirmationLink}</div>

              <hr style="border: 0; border-top: 1px solid #333; margin: 30px 0;">

              <p><strong>De plus, une fois validé :</strong></p>
              <ul>
                <li>✅ Tu accèderas à tous les guides et astuces</li>
                <li>💬 Tu pourras rejoindre la communauté Discord</li>
                <li>📺 Tu verras les vidéos exclusives</li>
                <li>⭐ Tu auras accès au contenu premium</li>
              </ul>

               <p>Des questions ? Rejoins notre Discord : <a href="https://discord.gg/rnh32gTDjp" style="color: #5865F2; text-decoration: none;">discord.gg/rnh32gTDjp</a></p>

              <div class="footer">
                <p>© 2026 InsiderGamingTricks - Tous droits réservés</p>
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

    console.log("Verification email sent successfully!");
    return new Response(
      JSON.stringify({ message: "Verification email sent successfully" }),
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