import React, { useState } from 'react';
import { Check, X, Crown, Zap, Shield, Star, Lock, Unlock, ChevronDown } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Gratuit',
    price: '0',
    period: 'pour toujours',
    description: 'Accès aux astuces de base et à la communauté.',
    icon: Shield,
    color: 'from-gray-600 to-gray-700',
    borderColor: 'border-gray-700',
    hoverBorder: 'hover:border-gray-600',
    popular: false,
    features: [
      { text: 'Astuces gratuites (50+)', included: true },
      { text: 'Accès au forum', included: true },
      { text: 'Vidéos YouTube', included: true },
      { text: 'Accès Discord', included: true },
      { text: 'Astuces Premium', included: false },
      { text: 'Guides vidéo exclusifs', included: false },
      { text: 'Support prioritaire', included: false },
      { text: 'Accès anticipé contenu', included: false },
      { text: 'Sessions coaching', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '9.99',
    period: '/mois',
    description: 'Toutes les astuces + guides vidéo exclusifs.',
    icon: Zap,
    color: 'from-red-600 to-orange-600',
    borderColor: 'border-red-500/30',
    hoverBorder: 'hover:border-red-500/60',
    popular: true,
    features: [
      { text: 'Astuces gratuites (50+)', included: true },
      { text: 'Accès au forum', included: true },
      { text: 'Vidéos YouTube', included: true },
      { text: 'Accès Discord VIP', included: true },
      { text: 'Astuces Premium (100+)', included: true },
      { text: 'Guides vidéo exclusifs', included: true },
      { text: 'Support prioritaire', included: true },
      { text: 'Accès anticipé contenu', included: false },
      { text: 'Sessions coaching', included: false },
    ],
  },
  {
    id: 'elite',
    name: 'Élite',
    price: '24.99',
    period: '/mois',
    description: 'L\'expérience ultime avec coaching personnalisé.',
    icon: Crown,
    color: 'from-yellow-500 to-amber-600',
    borderColor: 'border-yellow-500/30',
    hoverBorder: 'hover:border-yellow-500/60',
    popular: false,
    features: [
      { text: 'Astuces gratuites (50+)', included: true },
      { text: 'Accès au forum', included: true },
      { text: 'Vidéos YouTube', included: true },
      { text: 'Accès Discord VIP+', included: true },
      { text: 'Toutes les Astuces Premium', included: true },
      { text: 'Guides vidéo exclusifs', included: true },
      { text: 'Support prioritaire 24/7', included: true },
      { text: 'Accès anticipé contenu', included: true },
      { text: 'Sessions coaching (2/mois)', included: true },
    ],
  },
];

const premiumContent = [
  { title: 'CS2 - Wallbang Spots Secrets', game: 'CS2', type: 'Guide PDF' },
  { title: 'Warzone - Rotations Pro League', game: 'CoD', type: 'Vidéo 4K' },
  { title: 'BF - Pilotage Jet Avancé', game: 'BF', type: 'Guide PDF' },
  { title: 'CS2 - Config Pro Players 2026', game: 'CS2', type: 'Fichier Config' },
  { title: 'CoD - Aim Routine Personnalisée', game: 'CoD', type: 'Programme' },
  { title: 'BF - Stratégies Conquest 64v64', game: 'BF', type: 'Vidéo 4K' },
];

const PremiumSection: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingAnnual, setBillingAnnual] = useState(false);
  const [showFaq, setShowFaq] = useState<number | null>(null);

  const faqs = [
    { q: 'Puis-je annuler à tout moment ?', a: 'Oui, vous pouvez annuler votre abonnement à tout moment. Vous garderez l\'accès jusqu\'à la fin de votre période de facturation.' },
    { q: 'Les astuces sont-elles mises à jour ?', a: 'Oui, nous mettons à jour nos guides après chaque patch majeur des jeux. Les membres Premium reçoivent les mises à jour en priorité.' },
    { q: 'Comment fonctionnent les sessions coaching ?', a: 'Les sessions coaching Élite sont des sessions 1-on-1 de 45 minutes via Discord avec un de nos coachs expérimentés.' },
    { q: 'Y a-t-il une garantie satisfait ou remboursé ?', a: 'Oui, nous offrons une garantie de 7 jours. Si vous n\'êtes pas satisfait, nous vous remboursons intégralement.' },
  ];

  return (
    <section id="premium-section" className="bg-black py-20 md:py-28 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-yellow-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-600/10 border border-yellow-600/20 rounded-full text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <Crown className="w-3.5 h-3.5" />
            Premium
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Passe au Niveau <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Supérieur</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Débloques toutes les astuces, guides exclusifs et sessions coaching pour dominer tes adversaires.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 bg-gray-900/50 border border-gray-800 rounded-full p-1">
            <button
              onClick={() => setBillingAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                !billingAnnual ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                billingAnnual ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Annuel <span className="text-xs text-green-400 ml-1">-20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = plan.id === 'free' ? '0' : billingAnnual
              ? (parseFloat(plan.price) * 0.8).toFixed(2)
              : plan.price;

            return (
              <div
                key={plan.id}
                className={`relative bg-gray-900/50 border rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] ${plan.borderColor} ${plan.hoverBorder} ${
                  plan.popular ? 'ring-1 ring-red-500/30' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-600 to-orange-600 py-1.5 text-center text-xs font-bold text-white uppercase tracking-wider">
                    Le Plus Populaire
                  </div>
                )}

                <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                  {/* Plan Icon & Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${plan.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  </div>

                  {/* Price */}
                  <div className="mb-2">
                    <span className="text-4xl font-black text-white">{price}</span>
                    <span className="text-lg text-gray-400">€</span>
                    <span className="text-gray-500 text-sm ml-1">{plan.period}</span>
                  </div>
                  {billingAnnual && plan.id !== 'free' && (
                    <p className="text-green-400 text-xs font-medium mb-4">
                      Économisez {(parseFloat(plan.price) * 12 * 0.2).toFixed(0)}€/an
                    </p>
                  )}
                  <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                  {/* CTA */}
                  <button
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all mb-8 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-lg shadow-red-900/30'
                        : plan.id === 'elite'
                        ? 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white shadow-lg shadow-yellow-900/30'
                        : 'bg-gray-800 hover:bg-gray-700 text-white'
                    } ${selectedPlan === plan.id ? 'ring-2 ring-white/30' : ''}`}
                  >
                    {plan.id === 'free' ? 'Commencer Gratuit' : selectedPlan === plan.id ? 'Sélectionné' : 'Choisir ce Plan'}
                  </button>

                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {feature.included ? (
                          <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-green-400" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                            <X className="w-3 h-3 text-gray-600" />
                          </div>
                        )}
                        <span className={`text-sm ${feature.included ? 'text-gray-300' : 'text-gray-600'}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Premium Content Preview */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Aperçu du Contenu <span className="text-yellow-400">Premium</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {premiumContent.map((content, i) => (
              <div
                key={i}
                className="group relative bg-gray-900/50 border border-gray-800 rounded-xl p-5 overflow-hidden hover:border-yellow-500/30 transition-all"
              >
                {/* Blur overlay */}
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <div className="text-center">
                    <Lock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-yellow-400 font-bold text-sm">Contenu Premium</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded">{content.game}</span>
                  <span className="text-xs text-gray-500">{content.type}</span>
                </div>
                <h4 className="text-white font-semibold text-sm">{content.title}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Questions <span className="text-red-500">Fréquentes</span>
          </h3>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setShowFaq(showFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-white font-semibold text-sm pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${showFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {showFaq === i && (
                  <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumSection;
