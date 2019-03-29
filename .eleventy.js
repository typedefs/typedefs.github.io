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

    // differ markdown processor
    let markdownIt = require("markdown-it")
    let options = {
        html: true,
        breaks: true,
        linkify: true,
        typographer: true
    }
    let md = markdownIt(options)

    // add KaTeX support
    let mk = require('markdown-it-katex')
    md.use(mk);

    // add `[x]` and `[ ]` checkmark support
    md.use(require('markdown-it-checkbox'))

    eleventyConfig.setLibrary("md", md);

    eleventyConfig.passthroughFileCopy = true

    eleventyConfig.dir = {
        input: "content",
        output: "public",
        includes: "templates"
    }

    eleventyConfig.addTransform("html-minifier", htmlMinifier)

    return eleventyConfig
}