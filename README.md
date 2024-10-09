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
  - [Other Config Options](#other-config-options)
    - [silent](#silent)
    - [swcrcPath](#swcrcpath)
    - [uglifyConfig](#uglifyconfig)
- [Target File Example](#target-file-example)
- [Testing](#testing)

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

A valid config file must be present at `./inline-src.config` with file extension .json, .js, .mjs, or .cjs.

The config file is discovered and parsed via [lilconfig]https://www.npmjs.com/package/lilconfig) which is a more lightweight, dependency-free version of `cosmiconfig`.

### Config Structure

The config requires an array of `"inlineSource"` elements, each defining parameters for files to be processed.

Example:

```js
{
    "inlineSource" : [
        {
            "assetPath" : "./inline-src/styles/globals.scss",
            "componentPath" : "./components/InlineSrc/InlineSrc.ts",
            "componentCode" : "return `[inline-src_contents]`;\n    // End GlobalInlineStyle."
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

`"componentCode"`

The exact portion of the component to replace, with the token `[inline-src_contents]` serving as a placeholder for the minified content. If properly formatted with this token and any special character escape sequences, `inline-src` will convert this value for you into a servicable pattern to replace the token with the minified inline source from the binary asset associated with this item index.

Example: 
```js
"return `[inline-src_contents]`;\n // End GlobalInlineStyle."
```

It is also highly recommended to place [inline-src_contents], and therefore the output of the minified contents, inside a template literal with ` backticks surrounding the content, otherwise your minified code itself will have a high likelihood of sequence failure or corruption in use.

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
inline-src: Placing minified ./inline-src/styles/globals.scss into ./components/InlineSrc/InlineSrc.ts at specified position...
inline-src: ./inline-src/styles/splitview.scss - Compiling SASS...
inline-src: Minifying working CSS file with minify-css...
C:\Users\user\repos\project\inline-src_work\file.min.css 生成成功!
inline-src: Placing minified ./inline-src/styles/splitview.scss into ./components/InlineSrc/InlineSrc.ts at specified position...
inline-src: Compiling ./inline-src/js/layout.ts via swc...
Successfully compiled 1 file with swc.
inline-src: Minifying working JS file with uglify-js...
inline-src: Placing minified ./inline-src/js/layout.ts into ./components/InlineSrc/InlineSrc.ts at specified position...
inline-src: Compiling ./inline-src/js/splitview.ts via swc...
Successfully compiled 1 file with swc.
inline-src: Minifying working JS file with uglify-js...
inline-src: Placing minified ./inline-src/js/splitview.ts into ./components/InlineSrc/InlineSrc.ts at specified position...
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

## Target File Example

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

## Testing

To run unit and integration tests on the source code:

```bash
npm run test --coverage
```

The respository is configured with [Vitest](https://vitest.dev/).

The config file the tests use is found in the root at `./inline-src.config.ts`, as is the swc config at `./.swcrc`. These are the only persistent files aside from the vitest config, source code, and test files themselves which the tests rely on. All files that are manipulated in the file system are handled using [`fs-mock`](https://www.npmjs.com/package/mock-fs) and creation of these files' contents are managed within the test functions.

Each test that needs to test content on the file system creates content in the mocked file system, but does so reading the real config file, simultaneously performing an integration test with the config file, and a unit test on the function in question. Each piece of content is mapped to a path, pattern, or string defined either in the config file or in the mock as in this example:

```js
beforeAll(() => {
        mockFs({
            [config.inlineSource[0].assetPath]: 'body {background: #000;color: #fff;}',
            [config.inlineSource[0].componentPath]: `import * as fs  from "fs"
            export default function ThisComponent({someProps} : any) {
                const foo = "bar";
                return \`\`;
                // End MyComponentInlineCSS.
            }`
        });
    });
```

When the test runs, the mocked content is read by just as if it were the true file system. After each use of the mocked file system, it is reset using `mockFs.restore()`.