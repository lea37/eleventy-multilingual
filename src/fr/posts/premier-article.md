---
title: Un site multilingue avec Eleventy
translationKey: "eleventy-blogpost"
---

Eleventy n’offre pas de fonctionnalités natives liées au multilinguisme et à la localisation, cela ne nous empêche aucunement de développer une bonne gestion du multilingue à l’aide de fichiers de données globales, de collections en utilisant Nunjucks comme langage de templating.

Afin d’illustrer notre propos, nous allons développer un blog multilingue tout ce qu’il y a de plus classique.

Voici l’arborescence de fichiers avec laquelle nous allons travailler. C’est une architecture Eleventy standard, dont les principes et les techniques peuvent être appliqués à des projets plus importants.

```
+-- src
  +-- _data
    +-- site.js
    +-- footer.js
    +-- header.js
  +-- _includes
    +-- layouts
      +-- base.njk
    +-- partials
      +-- header.njk
      +-- footer.njk
  +-- en
    +-- pages
      +-- index.html
      +-- blog.html
      +-- contact.html
    +-- posts
      +-- yyyy-mm-dd-some-blogpost.md
      +-- posts.json
    +-- en.json
  +-- fr
    +-- pages
      +-- index.html
      +-- blog.html
      +-- contact.html
    +-- posts
      +-- yyyy-mm-dd-some-blogpost.md
      +-- posts.json
    +-- fr.json
+-- .eleventy.js
```

### Définition des locales

La première consiste à créer nos locales à l’aide des fichiers de données pour les répertoires.

Pour cela il nous suffit d’ajouter les fichiers `en.json` and `fr.json` dans nos répertoires de langues. Dans chacun d’entre eux, nous définissons une clé `locale`. Elle va permettre d’accéder aux valeurs correspondantes dans tous les fichiers de layout présents dans les sous-répertoires d’un dossier de langue.

Par exemple, notre fichier `fr.json` contient :

`{{ locale }}` va donc maintenant retourner “fr” ou “en” pour chacun de nos fichiers de layout, en fonction de sa position dans notre arborescence de fichiers.

### Filtre de localisation de date

Nunjucks ne possède pas de filtre pour les dates. Nous pouvons en créer un à l’aide de `moment.js` et lui passer la valeur de notre `locale` pour qu’il localise les dates pour nous, ce qui est toujours une partie importante des projets multilingues.

Pour ce faire, nous allons insérer le code suivant dans notre fichier de configueration `eleventy.js` :

À présent, nous pouvons utiliser ce filtre dans nos layouts et lui passer le paramètre `locale`. Notez bien que comme nous avons défini la `locale` par défaut comme en, nous pouvons omettre de la préciser pour les dates purement numériques. Un petit exemple :

Maintenant que nos dates sont automatiquement localisées, passons aux collections.

### Localisation des collections

Nous allons pouvoir tirer parti de notre arborescence de fichiers pour créer des collections dans Eleventy. Le plus simple est encore de créer une collection par langue. Nous utilisons pour cela la fonction getFilteredByGlob dans notre fichier eleventy.js.

Comme nos fichiers de contenu Markdown se trouvent dans des sous-répertoires de nos dossiers de langues, la variable locale est accessible. Nous pouvons par exemple l’utiliser pour créer les permaliens de tous nos articles.

Plutôt que d’ajouter une variable permalink dans le front matter de chaque fichier, nous pouvons créer un fichier de données posts.json dans chacun de nos dossiers posts avec le contenu suivant:

Nous avons ainsi localisé toutes les pages de détail de tous nos articles, il nous reste encore à boucler sur nos collections dans les différentes pages blog.njk de nos différentes langues.

Notez que nous pourrions aussi aussi utiliser pour nos collections notre variable locale. Il faudrait pour cela utiliser à la place une notation entre crochets pour concaténer les chaînes de caractères.

### Localisation des layouts et des fichiers partiels

Alors que la duplication de nos pages et de nos articles est à priori logique, nous ne voulons pas faire de même pour nos layouts et nos fichiers partiels.

Fort heureusement, nous pouvons éviter cela en traduisant simplement certaines chaînes de caractères. Pour ce faire, nous devons créer des fichiers de données génériques qui contiendront nos traductions sous forme de paire clés/valeurs. Nous pourrons ensuite faire référence dynamiquement à ces clés dans nos fichiers partiels et de layouts à l’aide de notre chère variable locale.

### Layouts

Commençons par un exemple dans un fichier de layout.

Le fichier `./src/_data/site.js` va rendre accessibles des variables via l’objet `site`.

Nous pouvons utiliser ces variables dans notre fichier ./src/fr/pages/index.njk. Dans notre exemple, nous allons d’abord assigner les valeurs à des variables Nunjucks plutôt que de les utiliser directement, car ces valeurs nous pourrions avoir besoin de les surcharger dans d’autres pages. La même logique peut être appliquée pour les modèles de page spécifiques aux articles.

Puisque ce layout étend le fichier `./src/_includes/layouts/base.njk`, les variables Nunjucks déclarées dans le gabarit enfant ainsi que les variables globales d’Eleventy sont également accessibles dans ce fichier.

### Fichiers partiel

La traduction de fichiers partiels comme `./src/_includes/partials/footer.njk` est basée sur le même principe.

Premièrement, nous créons un fichier ./data/footer.js et nous utilisons nos locales comme clés.

Ensuite dans le fichier `./src/_includes/partials/footer.njk`, nous nous basons sur la valeur de notre variable locale pour accéder à ces clés à l’aide de la notation entre crochets.

Et voilà, nous avons maintenant un pied de page traduit en plusieurs langues.