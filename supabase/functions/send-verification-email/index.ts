import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

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

    const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!);

    const { data: linkData, error: linkError } = await supabase.auth.admin.generateEmailLink({
      type: "signup",
      email: email,
      options: {
        redirectTo: "https://saw341cs2.github.io/InsiderGamingtriks/index.html",
      },
    });

    if (linkError) throw linkError;

    const confirmationLink = linkData?.properties.action_link;

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
          <div style="font-family: Arial, sans-serif; background: #0f0f0f; color: #fff; padding: 40px; border-radius: 16px;">
            <h1 style="color: #dc2626;">🔐 Confirme ton inscription</h1>
            <p>Salut <strong>${username || 'Aventurier'}</strong> 👋</p>
            <p>Clique sur le bouton ci-dessous pour valider ton compte :</p>
            <a href="${confirmationLink}" style="display: inline-block; padding: 15px 30px; background: #dc2626; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">✓ Valider mon inscription</a>
            <p style="margin-top: 30px; font-size: 12px; color: #888;">Si le bouton ne fonctionne pas, copie ce lien : ${confirmationLink}</p>
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