const moment = require("moment");
const markdownIt = require("markdown-it");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
    // plugins
    eleventyConfig.addPlugin(pluginSyntaxHighlight, {
        templateFormats: ['md'],
        alwaysWrapLineHighlights: true
    });

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

    // markdown Overrides
    let markdownLibrary = markdownIt({
        html: true,
        breaks: true,
        linkify: true
    });

    eleventyConfig.setLibrary("md", markdownLibrary);

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