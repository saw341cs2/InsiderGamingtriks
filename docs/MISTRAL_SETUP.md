# Configuration de la réécriture IA des news

## 🎯 Objectif

Depuis cette mise à jour, les news publiées chaque matin sont **des articles originaux** rédigés par l'IA Mistral AI. Plus de copie des sources : chaque article est intégralement réécrit avec le style journalistique propre à Insider Gaming Tricks.

## 🔧 Ce que fait le système

1. **Récupération** des articles gaming depuis les sources RSS et APIs
2. **Réécriture complète** via Mistral AI (API française) :
   - Titre unique et accrocheur (avec émoji)
   - Résumé en une phrase
   - Corps d'article original (2-3 paragraphes)
   - Section **"Notre avis"** (analyse éditoriale)
   - Catégories pertinentes (FPS, COMPETITION, MATERIEL, etc.)
3. **Publication** automatique sur le site

## 📋 Prérequis

1. Un compte [Mistral AI](https://console.mistral.ai/) (gratuit)
2. Générer une clé API dans la console Mistral AI

## ⚙️ Configuration GitHub

### 1. Créer un compte Mistral AI (gratuit)

1. Ouvre ton navigateur et va sur **[console.mistral.ai](https://console.mistral.ai/)**
2. Clique sur **"Sign up"** (en haut à droite)
3. Tu peux t'inscrire avec :
   - **Google** (recommendé, le plus rapide)
   - **GitHub**
   - **Email** + mot de passe
4. Une fois connecté, tu arrives sur le tableau de bord

### 2. Générer une clé API

1. Dans le menu de gauche, clique sur **"API Keys"** (ou va sur [console.mistral.ai/api-keys](https://console.mistral.ai/api-keys/))
2. Clique sur le bouton **"Create new key"** (bleu, en haut à droite)
3. Une fenêtre s'ouvre :
   - **Name** : donne un nom comme `InsiderGamingtriks`
   - Laisse les permissions par défaut
   - Clique sur **"Create"**
4. **IMPORTANT** : La clé s'affiche UNE SEULE FOIS. Elle ressemble à ça :
   ```
   Uc... (une longue chaîne de caractères)
   ```
5. **Copie-la immédiatement** et colle-la dans un endroit sûr (Bloc-Notes par exemple)
6. Clique sur **"Done"** pour fermer

> ⚠️ Si tu perds la clé, tu ne pourras pas la récupérer. Il faudra en créer une nouvelle.

### 3. Ajouter le secret dans GitHub

1. Va sur ton dépôt GitHub : `https://github.com/saw341cs2/InsiderGamingtriks`
2. Clique sur l'onglet **Settings** (tout en haut, à droite)
3. Dans le menu de gauche, clique sur **"Secrets and variables"** → **"Actions"**
4. Clique sur le bouton **"New repository secret"** (vert, en haut à droite)
5. Remplis les champs :
   - **Name** : tape exactement `MISTRAL_API_KEY` (en majuscules)
   - **Value** : colle ta clé API Mistral AI (la longue chaîne qui commence par `Uc...`)
6. Clique sur **"Add secret"** (vert, en bas)

✅ C'est fait ! Le workflow utilisera automatiquement cette clé à chaque exécution.

### 3. Vérifier que ça fonctionne

1. Va sur l'onglet **Actions** de ton dépôt GitHub
2. Sélectionne le workflow **Daily Gaming News**
3. Clique sur **Run workflow** (pour tester manuellement)
4. Vérifie les logs : tu devrais voir :
   ```
   🔄 Réécriture de 3 articles via Mistral AI...
   ✅ Réécrit: "🎯 Titre original généré par l'IA"
   ✅ Articles réécrits avec contenu original Insider Gaming Tricks
   ```

## 💰 Coût

- Mistral AI **mistral-small** : ~0,1€/1000 tokens
- 3 articles par jour = ~600 tokens = **~0,06€/jour** = **~1,80€/mois**
- Le crédit gratuit offert à l'inscription couvre plusieurs mois

## 🔄 Fallback

Si la clé API n'est pas configurée ou si l'API est indisponible :
- Le système utilise **l'ancien comportement** (articles non réécrits)
- Aucune erreur bloquante, le site continue de fonctionner normalement

## 🧪 Test en local

```bash
# Définir la clé
export MISTRAL_API_KEY="votre_clé_ici"

# Tester la réécriture (depuis la racine du projet)
echo '[{"title":"Test CS2 patch","description":"Nouveau patch CS2","content":"..."}]' | node scripts/rewrite-news.cjs
```

## 📁 Structure des fichiers modifiés

| Fichier | Rôle |
|---------|------|
| `scripts/rewrite-news.cjs` | **Nouveau** - Réécriture IA via Mistral AI |
| `scripts/fetch-news.cjs` | Modifié - Appelle rewrite-news.cjs après récupération |
| `.github/workflows/daily-news.yml` | Modifié - Passe MISTRAL_API_KEY en variable d'env |
| `src/components/gaming/NewsSection.tsx` | Modifié - Affiche summary + categories |
| `src/pages/NewsPage.tsx` | Modifié - Affiche content + review + categories |