const moment = require("moment");

module.exports = function(eleventyConfig) {
    // date filter (localized)
    eleventyConfig.addNunjucksFilter("date", function(date, format, locale) {
      locale = locale ? locale : "en";
      moment.locale(locale);
      return moment(date).format(format);
    });

    // en posts
    eleventyConfig.addCollection("posts_en", function(collection) {
        return collection.getFilteredByGlob("./src/en/posts/*.md");
    });

    // fr posts
    eleventyConfig.addCollection("posts_fr", function(collection) {
        return collection.getFilteredByGlob("./src/fr/posts/*.md");
    });

    // copy css folder
    eleventyConfig.addPassthroughCopy('src/css/');

    // Base config
    return {
        passthroughFileCopy: true,
        dir: {
            input: "src",
            output: "dist",
        }
    };
}