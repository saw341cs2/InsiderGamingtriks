# Déploiement des news FPS

La publication est faite par `.github/workflows/daily-news.yml`. Chaque exécution
valide le fuseau `Europe/Paris` avant de lancer le générateur : une seule
publication est donc autorisée à **05:30 heure de Paris**, en hiver comme en été.
Le workflow est planifié à `03:30` et `04:30` UTC pour couvrir les deux offsets
français, puis ignore le créneau qui ne correspond pas à 05:30 Paris.

## Contrat éditorial

- `scripts/fetch-news.cjs` agrège RSS/NewsAPI/GNews/NewsDataIO.
- Le filtre exige un jeu ou une compétition FPS identifiable (Counter-Strike,
  Battlefield, Valorant, Call of Duty, Apex, etc.) et exclut les autres jeux et
  le matériel seul.
- Les doublons sont retirés par URL et par titre normalisé.
- Jusqu'à six articles sont écrits dans `public/news.json`, puis copiés dans
  `docs/news.json` et `news.json`. La sélection commence par les articles du
  jour, puis complète avec de vrais articles récents des archives.
- Les articles du jour reçoivent un `publishedOn` commun, distinct de leur
  `dateTimePub` d'origine. Les articles archivés conservent leur date de
  publication précédente. L'accueil regroupe trois articles par date :
  première page pour aujourd’hui et hier, pages suivantes par paires de dates
  d’archives. Les jours sans lot publié restent vides au lieu d’être remplis
  avec des articles plus anciens présentés comme récents.
- L’image de l'article source est conservée, ou récupérée depuis ses balises
  Open Graph. Les logos, vignettes génériques et images répétées sont écartés.
  Si la réécriture IA échoue, l'article source peut être publié dans sa langue
  d'origine, mais uniquement avec une image source vérifiable. Aucun titre,
  article ou visuel de secours inventé n'est publié.

## Configuration GitHub

Configurer dans **Settings → Secrets and variables → Actions** les secrets
nécessaires (aucun secret n’est stocké dans le dépôt) :

| Secret | Usage |
| --- | --- |
| `GNEWS_API_KEY` | Sources GNews |
| `NEWS_API_KEY` | Sources NewsAPI |
| `NEWSDATA_API_KEY` | Sources NewsDataIO |
| `MISTRAL_API_KEY` ou `GEMINI_API_KEY` | Réécriture française facultative |

Les flux RSS publics sont utilisés sans clé ; les clés des agrégateurs et du
LLM sont facultatives. Si aucune source ne fournit d'article pertinent avec une
image exploitable, le fichier publié reste inchangé. `workflow_dispatch` force
volontairement la publication pour un test manuel.

## Validation locale

```bash
npm install
npm test
npm run build
```

`npm test` couvre le filtre FPS, le fallback sur les articles source avec images,
la déduplication et les changements d’heure Europe/Paris.
