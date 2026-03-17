import React from 'react';
import { MessageCircle, Play, Users, Crown, Download, Brain, Youtube, Rocket, Lightbulb } from 'lucide-react';

const FAQ: React.FC = () => {
  return (
    <section id="faq" className="py-16 md:py-20 bg-gray-950">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            🎮 FAQ – Insider Gaming Tricks
          </h2>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              ❓ Qu'est-ce que Insider Gaming Tricks ?
            </h3>
            <p className="text-gray-400">
              Insider Gaming Tricks est un site dédié aux jeux vidéo, principalement les FPS comme Counter-Strike, Battlefield, Call of Duty, et bien d'autres.
              Tu y trouveras les dernières actualités, des astuces exclusives, ainsi que du contenu vidéo pour améliorer ton gameplay.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              🎯 Que propose le site ?
            </h3>
            <p className="text-gray-400 mb-3">Le site est organisé en plusieurs sections :</p>
            <ul className="text-gray-400 space-y-1 ml-4">
              <li><span className="text-red-400">•</span> <strong className="text-white">Astuces</strong> : guides, tips et techniques pour progresser rapidement</li>
              <li><span className="text-red-400">•</span> <span className="flex items-center gap-2"><Play className="w-4 h-4" /> Vidéos</span> : une nouvelle vidéo chaque semaine</li>
              <li><span className="text-red-400">•</span> <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Communauté</span> : Discord + futur forum pour échanger avec d'autres joueurs</li>
              <li><span className="text-red-400">•</span> <span className="flex items-center gap-2"><Crown className="w-4 h-4" /> Premium</span> : contenu exclusif avec des astuces avancées (gratuites et payantes)</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              📺 À quelle fréquence publiez-vous du contenu ?
            </h3>
            <p className="text-gray-400">
              Je publie une vidéo par semaine sur la chaîne YouTube, ainsi que des mises à jour régulières sur le site avec de nouvelles astuces et actus gaming.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              💡 Les astuces sont-elles gratuites ?
            </h3>
            <p className="text-gray-400">
              Oui 👍 Une partie des astuces est gratuite, mais certaines techniques plus avancées ou exclusives sont disponibles en version premium payante.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              💬 Comment rejoindre la communauté ?
            </h3>
            <p className="text-gray-400 mb-3">Tu peux rejoindre la communauté via :</p>
            <ul className="text-gray-400 space-y-1 ml-4">
              <li><span className="text-red-400">•</span> <span className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Le serveur Discord</span> pour discuter en direct</li>
              <li><span className="text-red-400">•</span> (Prochainement) un forum pour partager des stratégies, poser des questions et échanger avec d'autres joueurs</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              🔐 Qu'est-ce que l'espace Premium ?
            </h3>
            <p className="text-gray-400 mb-3">L'espace Premium donne accès à :</p>
            <ul className="text-gray-400 space-y-1 ml-4">
              <li><span className="text-yellow-400">•</span> Des astuces avancées</li>
              <li><span className="text-yellow-400">•</span> Des contenus exclusifs</li>
              <li><span className="text-yellow-400">•</span> Des guides plus approfondis</li>
              <li><span className="text-yellow-400">•</span> Des téléchargements spéciaux</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              📥 Que trouve-t-on dans les téléchargements ?
            </h3>
            <p className="text-gray-400 mb-3">Dans cette section, tu peux accéder à :</p>
            <ul className="text-gray-400 space-y-1 ml-4">
              <li><span className="text-red-400">•</span> <span className="flex items-center gap-2"><Download className="w-4 h-4" /> Des packs d'astuces</span></li>
              <li><span className="text-red-400">•</span> Des configurations optimisées</li>
              <li><span className="text-red-400">•</span> Des ressources pour améliorer ton gameplay</li>
              <li><span className="text-gray-500">•</span> Certaines sont gratuites, d'autres réservées aux membres Premium</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              🧠 À qui s'adresse Insider Gaming Tricks ?
            </h3>
            <p className="text-gray-400 mb-3">Le site est fait pour :</p>
            <ul className="text-gray-400 space-y-1 ml-4">
              <li><span className="text-red-400">•</span> <span className="flex items-center gap-2"><Brain className="w-4 h-4" /> Les joueurs débutants</span> qui veulent progresser rapidement</li>
              <li><span className="text-red-400">•</span> Les joueurs confirmés cherchant à optimiser leur niveau</li>
              <li><span className="text-red-400">•</span> Les passionnés de FPS et de compétitif</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              📢 Où suivre Insider Gaming Tricks ?
            </h3>
            <p className="text-gray-400">
              Tu peux suivre le contenu ici :
            </p>
            <a 
              href="https://www.youtube.com/@InsiderHackGaming" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold"
            >
              <Youtube className="w-5 h-5" />
              YouTube : @InsiderHackGaming
            </a>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              🚀 Puis-je proposer des idées ou participer ?
            </h3>
            <p className="text-gray-400">
              Oui ! Tu peux proposer tes idées, astuces ou suggestions via Discord (et bientôt sur le forum).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
