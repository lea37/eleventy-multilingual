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

```
{
  "locale": "fr"
}
```
`{{ locale }}` va donc maintenant retourner “fr” ou “en” pour chacun de nos fichiers de layout, en fonction de sa position dans notre arborescence de fichiers.

### Filtre de localisation de date

Nunjucks ne possède pas de filtre pour les dates. Nous pouvons en créer un à l’aide de `moment.js` et lui passer la valeur de notre `locale` pour qu’il localise les dates pour nous, ce qui est toujours une partie importante des projets multilingues.

Pour ce faire, nous allons insérer le code suivant dans notre fichier de configueration `eleventy.js` :

```
// date filter (localized)
eleventyConfig.addNunjucksFilter("date", function(date, format, locale) {
  locale = locale ? locale : "en";
  moment.locale(locale);
  return moment(date).format(format);
});
```

À présent, nous pouvons utiliser ce filtre dans nos layouts et lui passer le paramètre `locale`. Notez bien que comme nous avons défini la `locale` par défaut comme en, nous pouvons omettre de la préciser pour les dates purement numériques. Un petit exemple :

```
<p><time datetime="{{ post.date | date('Y-MM-DD') }}">{{ post.item|date("DD MMMM Y", locale) }}</time></p>
```

Maintenant que nos dates sont automatiquement localisées, passons aux collections.

### Localisation des collections

Nous allons pouvoir tirer parti de notre arborescence de fichiers pour créer des collections dans Eleventy. Le plus simple est encore de créer une collection par langue. Nous utilisons pour cela la fonction getFilteredByGlob dans notre fichier eleventy.js.