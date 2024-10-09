import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest'
import mockFs from 'mock-fs'
import UpdateInlineCode from './UpdateInlineCode.ts'
import config from '../../inline-src.config.json'
import * as fs from 'fs'

describe('UpdateInlineCode', () => {
    beforeEach(() => {
        mockFs({
            "./inline-src_work/file.min.css" : 'body {background: #000;color: #fff;}',
            "./inline-src_work/file.min.js" : 'console.log("hello world!);',
            [config.inlineSource[0].assetPath]: 'body {background: #000;color: #fff;}',
            [config.inlineSource[0].componentPath]: `import * as fs  from "fs"
            export default function ThisComponent({someProps} : any) {
                const foo = "bar";
                return \`\`;
                // End MyComponentInlineCSS.
            }`,
            [config.inlineSource[2].assetPath]: 'console.log("hello world!);',
            [config.inlineSource[2].componentPath]: `import * as fs  from "fs"
            export default function ThisComponent({someProps} : any) {
                const foo = "bar";
                return \`\`;
                // End LayoutInlineJS.
            }`,
            [config.inlineSource[3].componentPath]: `Errant component code!`
        });
    })

    afterAll(() => {
        mockFs.restore();
    })

    const css = 'body {background: #000;color: #fff;}'

    const cssComponentContents = `import * as fs  from "fs"
            export default function ThisComponent({someProps} : any) {
                const foo = "bar";
                return \`${css}\`;
                // End MyComponentInlineCSS.
            }`;
    
    const js = 'console.log("hello world!);'

    const jsComponentContents = `import * as fs  from "fs"
            export default function ThisComponent({someProps} : any) {
                const foo = "bar";
                return \`${js}\`;
                // End LayoutInlineJS.
            }`

    it('locates and replaces contents of file based on regex pattern when file type is "css"', () => {

        UpdateInlineCode(config, config.inlineSource[0], "css");

        const result = fs.readFileSync(config.inlineSource[0].componentPath, 'utf-8');
        expect(result).toBe(cssComponentContents);
    })

    it('locates and replaces contents of file based on regex pattern when file type is "js"', () => {

        UpdateInlineCode(config, config.inlineSource[2], "js");

        const result = fs.readFileSync(config.inlineSource[2].componentPath, 'utf-8');
        expect(result).toBe(jsComponentContents);
    })

    it('displays console output for the CLI when config.silent is not true', () => {

        config.silent = "false";

        const spy = vi.spyOn(console, 'info').mockImplementation(() => {});

        UpdateInlineCode(config, config.inlineSource[0], "css");

        expect(spy).toHaveBeenCalledWith('inline-src: Placing minified ./test_work/globals.scss into ./test_work/InlineSrc.ts at specified pattern...');

        spy.mockRestore();
    })

    it('does not display console output for the CLI when config.silent is true', () => {

        config.silent = "true";

        const spy = vi.spyOn(console, 'info').mockImplementation(() => {});

        UpdateInlineCode(config, config.inlineSource[0], "css");

        expect(spy).toBeCalledTimes(0);

        spy.mockRestore();
    })

    it('throws an error if no match is found for item.componentCode', () => {

        config.inlineSource[0].componentCode = "IncorrectComponentCode";

        expect(() => UpdateInlineCode(config, config.inlineSource[0], "css"))
        .toThrow(`inline-src: The pattern associated with "componentPath" : "./test_work/InlineSrc.ts" does not produce a match for "componentCode" : "IncorrectComponentCode"`);
    })

    it('throws an error if no match is found for the actual source code at item.componentPath', () => {

        expect(() => UpdateInlineCode(config, config.inlineSource[3], "css"))
        .toThrow(`inline-src: \"pattern\" : \"return \`.*?\`;\\\\s*// End OtherInlineJS.\" and \"componentCode\" : \"return \`[inline-src_contents]\`;\\\\n                // End OtherInlineJS.\" values do not produce a match for the actual content found in \"componentPath\" : \"./test_work/InlineSrc4.ts\".`);
        
    })
});