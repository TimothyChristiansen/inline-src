import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mockFs from 'mock-fs';
import UpdateInlineCode from './UpdateInlineCode.ts';
import config from '../inline-src.config.js';
import * as fs from 'fs';

describe('UpdateInlineCode', () => {
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

    afterAll(() => {
        mockFs.restore();
    });

    it('locates and replaces contents of file based on regex pattern', () => {
        const css = 'body {background: #000;color: #fff;}';

        UpdateInlineCode(config, css, config.inlineSource[0]);

        const componentContentsModified = `import * as fs  from "fs"
            export default function ThisComponent({someProps} : any) {
                const foo = "bar";
                return \`${css}\`;
                // End MyComponentInlineCSS.
            }`;

        const result = fs.readFileSync(config.inlineSource[0].componentPath, 'utf-8');
        expect(result).toBe(componentContentsModified);
    });
});