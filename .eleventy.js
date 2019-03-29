// config for https://www.11ty.io/
let htmlmin = require("html-minifier")
function htmlMinifier(content, outputPath) {
    if (!outputPath.endsWith(".html"))
        return content;

    return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
    });
}

module.exports = function(eleventyConfig) {

    eleventyConfig.templateFormats = [
        "md","css"
    ]

    eleventyConfig.passthroughFileCopy = true

    eleventyConfig.dir = {
        input: "content",
        output: "public",
        includes: "templates"
    }

    eleventyConfig.addTransform("html-minifier", htmlMinifier)

    return eleventyConfig
}