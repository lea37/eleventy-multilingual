const moment = require("moment");

module.exports = function(eleventyConfig) {
    // date filter (localized)
    eleventyConfig.addNunjucksFilter("date", function(date, format, locale) {
      locale = locale ? locale : "en";
      moment.locale(locale);
      return moment(date).format(format);
    });

    eleventyConfig.addCollection("posts_en", function(collection) {
        return collection.getFilteredByGlob("./src/en/posts/*.md");
    });

    eleventyConfig.addCollection("posts_fr", function(collection) {
        return collection.getFilteredByGlob("./src/fr/posts/*.md");
    });

    // Custom src => output folders
    return {
        dir: {
            input: "src",
            output: "dist",
        },
        templateFormats : ["njk", "md", "html"]
    };
}