import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import mockFs from 'mock-fs'
import UpdateInlineCode from './UpdateInlineCode.ts'
import config from '../inline-src.config.json'
import * as fs from 'fs'

describe('UpdateInlineCode', () => {
    beforeAll(() => {
        mockFs({
            [config.inlineSource[0].assetPath]: 'body {background: #000;color: #fff;}',
            [config.inlineSource[0].componentPath]: `import * as fs  from "fs"
            export default function ThisComponent({someProps} : any) {
                const foo = "bar";
                return \`\`;
                // End MyComponentInlineCSS.
            }`,
            [config.inlineSource[1].componentPath]: `Errant component code!`
        });
    })

    afterAll(() => {
        mockFs.restore();
    })

    const css = 'body {background: #000;color: #fff;}';

    const componentContents = `import * as fs  from "fs"
            export default function ThisComponent({someProps} : any) {
                const foo = "bar";
                return \`${css}\`;
                // End MyComponentInlineCSS.
            }`;

    it('locates and replaces contents of file based on regex pattern', () => {

        UpdateInlineCode(config, css, config.inlineSource[0]);

        const result = fs.readFileSync(config.inlineSource[0].componentPath, 'utf-8');
        expect(result).toBe(componentContents);
    })

    it('displays console output for the CLI when config.silent is not true', () => {

        config.silent = "false";

        const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

        UpdateInlineCode(config,css,config.inlineSource[0]);

        expect(spy).toHaveBeenCalledWith('inline-src: Placing minified ./test_work/globals.scss into ./test_work/InlineSrc.ts at specified pattern...');

        spy.mockRestore();
    })

    it('does not display console output for the CLI when config.silent is true', () => {

        config.silent = "true";

        const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

        UpdateInlineCode(config,css,config.inlineSource[0]);

        expect(spy).toBeCalledTimes(0);

        spy.mockRestore();
    })

    it('throws an error if no match is found for item.componentCode', () => {

        config.inlineSource[0].componentCode = "IncorrectComponentCode";

        expect(() => UpdateInlineCode(config, css, config.inlineSource[0]))
        .toThrow(`inline-src: The pattern associated with "componentPath" : "./test_work/InlineSrc.ts" does not produce a match for "componentCode" : "IncorrectComponentCode"`);
    })

    it('throws an error if no match is found for the actual source code at item.componentPath', () => {

        expect(() => UpdateInlineCode(config, css, config.inlineSource[1]))
        .toThrow(`inline-src: The pattern associated with "componentPath" : "./test_work/InlineSrc2.ts" does not produce a match for the actual code found in the file.`);
        
    })
});