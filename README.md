# inline-src 

**Under Construction: Pre-release at this commit**

`inline-src` helps manage the placement of inline assets like styles and scripts into component files without hardcoding them. Develop inline scripts and styles in native file formats (e.g., `.css/scss`, `.js/ts`) and inject their minified versions automatically into your components.

## Table of Contents

- [Why use inline-src](#why-use-inline-src)
- [Installation](#installation)
- [Usage](#usage)
- [Config](#config)
  - [Config Structure](#config-structure)
  - [inlineSource Properties](#inlinesource-properties)
  - [Example File to Pair with componentCode](#example-file-to-pair-with-componentcode)
  - [Other Config Options](#other-config-options)
    - [silent](#silent)
    - [swcrcPath](#swcrcpath)
    - [uglifyConfig](#uglifyconfig)

## Why use inline-src?

With `inline-src`, you can:

- **Organize your code:** Keep inline scripts/styles in dedicated files, benefiting from features like IntelliSense, linting, and unit tests.
- **Automate code injection:** No more manual string replacements inside your components.
- **Simplify project management:** Automate this process as part of your build or dev process.

## Installation

```bash
npm install -D inline-src
```

## Usage

Add `inline-src` to your package scripts (replace `devprocess` and `buildprocess` with your specific framework process):

```js
//
"scripts" : {
    //
    "inline-src": "inline-src",
    "dev": "inline-src && devprocess",
    "build": "inline-src && buildprocess"
}
```

You can also run `npx inline-src` to directly invoke the automatic injection of the minified content to the specified component files without running a full build.

## Config

A valid config file must be present at `./inline-src.config` with file extension .json, .js, .mjs, .ts, or .mts. 

### Config Structure

The config requires an array of `"inlineSource"` elements, each defining parameters for files to be processed.

Example:

```js
{
    "inlineSource" : [
        {
            "assetPath" : "./inline-src/styles/globals.scss",
            "componentPath" : "./components/InlineSrc/InlineSrc.ts",
            "pattern" : "return `.*?`;\\s*\/\/ End GlobalInlineStyle.",
            "componentCode" : "return `[inline-src_contents]`;\\n    // End GlobalInlineStyle."
        }
        // More entries...
    ],
    "swcrcPath": "./inline-src/.swcrc",
    "silent": "true"
}
```

### inlineSource Properties

`"assetPath"`

The relative path to the file whose content will be minified and injected.

Example: "./inline-src/styles/globals.scss"

`"componentPath"`

The relative path to the file where the inline content will be placed.

Example: "./components/InlineSrc/InlineSrc.ts"

`"pattern"`

A regular expression that locates the exact position in componentPath where the minified content will be inserted.

Example: 
```js
"return `.*?`;\\s*\/\/ End LayoutInlineJS."
```

`"componentCode"`

The exact portion of the component to replace, with the token [inline-src_contents] serving as a placeholder for the minified content.

Example: 
```js
"return `[inline-src_contents]`;\\n // End GlobalInlineStyle."
```

Note: Be aware of proper escape sequences for special characters including new line characters as illustrated above. It is also highly recommended to place [inline-src_contents], and therefore the output of the minified contents, inside a template literal with ` backticks surrounding the content, otherwise your minified code will have a high likelihood of sequence failure or corruption in use.

### Example file to Pair with componentCode

A file like the following can contain the output of all the final printed inline source, and be used for mapping all the locations of the matching `"pattern"` and `"componentCode"` values. It is not necessary to place all into a single file as shown here, and inline-src allows for flexibility to do otherwise. However, this pattern as shown is clean, allowing this document to subsequently be imported into other files to place the contents into position during overall compilation as needed.


```ts
//./components/InlineSrc/InlineSrc.ts before running inline-src
export function GlobalInlineStyle() {
    return ``;
    // End GlobalInlineStyle.
}

export function LayoutInlineJS() {
    return ``;
    // End LayoutInlineJS.
}
```

Even after values have been placed into the position between the backticks, the regex and token as defined will continue to locate and replace the contents correctly.

```ts
//./components/InlineSrc/InlineSrc.ts after running inline-src
export function GlobalInlineStyle() {
    return `body {background: #000; color: #fff;}`;
    // End GlobalInlineStyle.
}

export function LayoutInlineJS() {
    return `console.log("hello world!");`;
    // End LayoutInlineJS.
}
```

`"uglifyConfig"`

Optionally a config file may be provided for minification of JS via uglify-js per `"inlineSource"` item. If a global `"uglifyConfig"` path was also provided, the more local config for this item will take precedence.

Example value: `./inline-src/globalstyles/uglify.config.js`

By default, without a custom config provided, the only option used by `inline-src` will be the CLI option `--compress templates=false`. If you choose to provide a custom uglify-js config, be aware of this default option, and of what the options selected in your new config will do for sequences in strings. 

Be aware the `inline-src` package will only validate the placement of your config file. It will be up to uglify-js and to you the user to validate and provide a functioning uglify-js config file.

See the [uglify-js documentation](https://www.npmjs.com/package/uglify-js) for more details.

## Other Config Options

### silent

`"silent"`

An optional property that disables verbose console output when set to "true". Defaults to "false".

Example of verbose output:

```bash
inline-src: ./inline-src/styles/globals.scss - Compiling SASS...
inline-src: Minifying working CSS file with minify-css...
C:\Users\user\repos\project\inline-src_work\file.min.css 生成成功!
inline-src: Placing minified ./inline-src/styles/globals.scss into ./components/InlineSrc/InlineSrc.ts at specified pattern...
inline-src: ./inline-src/styles/splitview.scss - Compiling SASS...
inline-src: Minifying working CSS file with minify-css...
C:\Users\user\repos\project\inline-src_work\file.min.css 生成成功!
inline-src: Placing minified ./inline-src/styles/splitview.scss into ./components/InlineSrc/InlineSrc.ts at specified pattern...
inline-src: Compiling ./inline-src/js/layout.ts via swc...
Successfully compiled 1 file with swc.
inline-src: Minifying working JS file with uglify-js...
inline-src: Placing minified ./inline-src/js/layout.ts into ./components/InlineSrc/InlineSrc.ts at specified pattern...
inline-src: Compiling ./inline-src/js/splitview.ts via swc...
Successfully compiled 1 file with swc.
inline-src: Minifying working JS file with uglify-js...
inline-src: Placing minified ./inline-src/js/splitview.ts into ./components/InlineSrc/InlineSrc.ts at specified pattern...
inline-src: Complete!
```

Example of silent output (note that dependencies cannot be silenced):

```bash
C:\Users\user\repos\project\inline-src_work\file.min.css 生成成功!
C:\Users\user\repos\project\inline-src_work\file.min.css 生成成功!
Successfully compiled 1 file with swc.
Successfully compiled 1 file with swc.
```

### swcrcPath

`"swcrcPath"`

A string that defines the path to where the inline-src .swcrc file is located. This is required if compiling js file types, as it is the compiler that inline-src uses as a dependency. If only compiling css, swcrcPath and the corresponding .swcrc file are not required.

The path should be defined relative to the project root.

This must be a user-defined path so as to not conflict with possible .swcrc files used in the primary build for the consuming project, as the .swcrc file defined here is used by inline-src, and not the same file used for other compilation procedures.

Example path: `./inline-src/.swcrc`

Default example .swcrc when using typescript:

```js
{
    "jsc": {
      "parser": {
        "syntax": "typescript",
        "tsx": false
      },
      "target": "esnext"
    }
}
```

Review the [swc documentation](https://swc.rs/docs/configuration/swcrc) for details on alternate configurations.

### uglifyConfig

`"uglifyConfig"`

Optionally a config file may be provided for minification of JS via uglify-js. This will become the new default for all items in `"inlineSource"`. Individual items can still override this new default with their own `"uglifyConfig"`, which will take precedence.

Example value: `./inline-src/uglify.config.js`

By default, without a custom config provided, the only option used by `inline-src` will be the CLI option `--compress templates=false`. If you choose to provide a custom uglify-js config, be aware of this default option, and of what the options selected in your new config will do for sequences in strings. 

Be aware the `inline-src` package will only validate the placement of your config file. It will be up to uglify-js and to you the user to validate and provide a functioning uglify-js config file.

See the [uglify-js documentation](https://www.npmjs.com/package/uglify-js) for more details.