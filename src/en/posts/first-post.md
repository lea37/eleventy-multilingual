---
title: Multilingual sites with Eleventy
translationKey: "eleventy-blogpost"
---

Eleventy might not have multilingual and localisation capabilities out of the box, but you can build a pretty good setup using global data files, collections and Nunjucks as a templating language.

In order to have a basic project to work with, let's build a fairly straightforward multilingual blog.

Here is the folder architecture we will be working with. It is quite a standard Eleventy architecture and a pretty straightforward project. However, I believe the principles and techniques can be applied to bigger ones.

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

### Set locales

The first step is to create our locales using directory data files.

We simply add en.json and fr.json in the root of our language directories. In each of them, we specify a locale key. That will make the corresponding values accessible in all template files living in those languages directories and subdirectories.

Here what our fr.json file would contain:

```
{
  "locale": "fr"
}
```

{{ locale }} will now output "fr" or "en" for any of our template files, depending on where that template file is located in our folder architecture.

### Localised date filter

Nunjucks does not have a date filter. We can create one using moment.js and pass it our locale value to localise dates for us, which is an important part of all multilingual projects. In order to do that, we use the following code in our .eleventy.js file:

```
// date filter (localized)
eleventyConfig.addNunjucksFilter("date", function(date, format, locale) {
  locale = locale ? locale : "en";
  moment.locale(locale);
  return moment(date).format(format);
});
```

Now, we can just call that filter in our templates and pass it a locale parameter. Note that, since we set the locale to "en" by default, we can use our filter without a locale parameter for our purely numeric dates. Here is a small example.

```
<p><time datetime="{{ post.date | date('Y-MM-DD') }}">{{ post.item|date("DD MMMM Y", locale) }}</time></p>
```

Now that our dates are automatically localized, let's move to collections.

### Localized collections

We can also use our directory structure to create collections in Eleventy. The simplest way to go about it is to create collections per language. We can accomplish that using the getFilteredByGlob method in our .eleventy.js file.

```
module.exports = function(eleventyConfig) {
  eleventyConfig.addCollection("posts_en", function(collection) {
    return collection.getFilteredByGlob("./src/en/posts/*.md");
  });
};

module.exports = function(eleventyConfig) {
  eleventyConfig.addCollection("posts_fr", function(collection) {
    return collection.getFilteredByGlob("./src/fr/posts/*.md");
  });
};
```

Because they live in subdirectories of our language directories, all those markdown files have that handy locale variable available. We can for example use it to create permalinks for all our posts.