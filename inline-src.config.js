const config = {
    "inlineSource": [
        {
            "assetPath" : "./test_work/globals.scss",
            "componentPath" : "./test_work/InlineSrc.ts",
            "pattern" : "return `.*?`;\\s*\/\/ End MyComponentInlineCSS.",
            "componentCode" : "return `[inlinesrc_contents]`;\\n                // End MyComponentInlineCSS."
        },
        {
            "assetPath" : "./test_work/other.css",
            "componentPath" : "./test_work/InlineSrc.ts",
            "pattern" : "return `.*?`;\\s*\/\/ End OtherInlineStyle.",
            "componentCode" : "return `[inlinesrc_contents]`;\\n            // End OtherInlineCSS."
        },
        {
            "assetPath" : "./test_work/layout.ts",
            "componentPath" : "./test_work/InlineSrc.ts",
            "pattern" : "return `.*?`;\\s*\/\/ End LayoutInlineJS.",
            "componentCode" : "return `[inlinesrc_contents]`;\\n            // End LayoutInlineJS."
        },
        {
            "assetPath" : "./test_work/other.ts",
            "componentPath" : "./test_work/InlineSrc.ts",
            "pattern" : "return `.*?`;\\s*\/\/ End OtherInlineJS.",
            "componentCode" : "return `[inlinesrc_contents]`;\\n            // End OtherInlineJS."
        }
    ],
    "swcrcPath": "./test_work/inline-src/.swcrc",
    "silent": "true"
}

export default config;