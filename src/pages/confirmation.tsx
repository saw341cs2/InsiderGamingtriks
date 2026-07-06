import { Mail, CheckCircle } from "lucide-react";

export default function Confirmation() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-lg w-full bg-zinc-900 border border-red-600/30 rounded-2xl p-8 text-center shadow-xl">

        <Mail className="w-16 h-16 text-red-500 mx-auto mb-6" />

        <h1 className="text-3xl font-bold text-white mb-4">
          Vérifie ton adresse email 📧
        </h1>

        <p className="text-gray-300 mb-6">
          Ton compte a bien été créé.
        </p>

        <p className="text-gray-400 leading-7">
          Nous venons de t'envoyer un email de confirmation.
          <br /><br />
          Clique sur le lien contenu dans cet email pour activer ton compte.
        </p>

        <div className="mt-8 bg-zinc-800 rounded-xl p-4">
          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />

          <p className="text-sm text-gray-300">
            Pense également à vérifier ton dossier <strong>Spam</strong> ou
            <strong> Courrier indésirable</strong> si tu ne vois rien arriver.
          </p>
        </div>

        <a
          href="/"
          className="mt-8 inline-block bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-lg text-white font-semibold"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
}