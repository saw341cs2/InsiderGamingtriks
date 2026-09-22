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
- Trois articles exactement sont écrits dans `public/news.json`, puis copiés
  dans `docs/news.json` et `news.json`. Si les sources ou la réécriture IA
  échouent, le pool FPS déterministe de `generate-news.cjs` complète la sortie.
- L’image fournie par la source est conservée lorsqu’elle est exploitable ;
  sinon une image de secours par thème FPS est utilisée. Les images restent
  attachées à l’article lors de la réécriture.

## Configuration GitHub

Configurer dans **Settings → Secrets and variables → Actions** les secrets
nécessaires (aucun secret n’est stocké dans le dépôt) :

| Secret | Usage |
| --- | --- |
| `GNEWS_API_KEY` | Sources GNews |
| `NEWS_API_KEY` | Sources NewsAPI |
| `NEWSDATA_API_KEY` | Sources NewsDataIO |
| `MISTRAL_API_KEY` ou `GEMINI_API_KEY` | Réécriture française facultative |

Au moins une source de news et, si souhaité, une clé LLM doivent être valides.
Sans clé LLM, ou si la réponse IA reste en anglais/incomplète, le générateur
utilise trois articles du fallback éditorial français plutôt que de publier un
texte non traduit. `workflow_dispatch` force volontairement la publication pour
un test manuel.

## Validation locale

```bash
npm install
npm test
npm run build
```

`npm test` couvre le filtre FPS, le fallback à trois articles, la déduplication
indirecte et les changements d’heure Europe/Paris.
