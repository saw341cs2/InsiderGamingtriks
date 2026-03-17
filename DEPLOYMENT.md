# Guide de déploiement - News Gaming Automatiques

## Résumé de la solution

**NOUVELLE APPROCHE SIMPLIFIÉE:** Le site récupère maintenant directement les news gaming depuis NewsAPI via un proxy CORS. Plus besoin de déployer des Edge Functions!

Ce système affiche des news gaming en temps réel sur votre site:
- **Jeux vidéo** - Actualités, sorties, mises à jour
- **Compétition** - Tournois esports, résultats
- **Matériel** - Hardware gaming, périphériques

Les articles sont récupérés de plusieurs catégories gaming et affichés de manière aléatoire.

---

## ⚠️ Action urgente - Sécurité

**Changez votre clé API NewsAPI** rapidement sur [newsapi.org](https://newsapi.org), car vous l'avez partagée publiquement.

---

## Étape 1: Modifier le code (OPTIONNEL)

Le fichier [`src/components/gaming/NewsSection.tsx`](src/components/gaming/NewsSection.tsx) a déjà été modifié pour appeler directement NewsAPI avec un proxy CORS. Les news seront récupérées automatiquement!

### Ce qui a été fait:
- ✅ Le site appelle maintenant NewsAPI directement
- ✅ Utilisation d'un proxy CORS pour éviter les blocages
- ✅ Couverture de 3 thématiques: jeux, compétition, matériel

---

## Étape 2: Redéployer votre site

1. Commit et push vos changements
2. Votre site affichera maintenant les news gaming en temps réel

---

## Alternative: Pour une publication automatique à 7h

Si vous voulez vraiment publier EXACTEMENT 2 news à 7h chaque jour (au lieu d'afficher des news en temps réel), vous pouvez:

1. **Utiliser GitHub Actions** (déjà configuré dans `.github/workflows/`)
2. **Configurer un cron externe** comme [EasyCron](https://www.easycron.com) (gratuit)

Contactez-moi si vous voulez cette fonctionnalité avancée.

---

## Problèmes courants

| Problème | Solution |
|----------|----------|
| Les news ne s'affichent pas | Vérifiez les logs dans Supabase Dashboard > Edge Functions |
| Le cron ne fonctionne pas | Vérifiez que le repository GitHub est public ou utilisez un service externe |
| Erreur API | Vérifiez que la clé NewsAPI est valide et active |

---

## 💡 Tester maintenant

### Option 1: Tester en local
```bash
npm run dev
```
Puis ouvrez http://localhost:5173 et cliquez sur "Actualiser" dans la section News.

### Option 2: Via GitHub Actions
Allez dans votre repository GitHub > Actions > Daily Gaming News > Run workflow
