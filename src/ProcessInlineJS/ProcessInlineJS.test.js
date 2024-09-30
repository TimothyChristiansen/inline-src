import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import mockFs from 'mock-fs'
import {CompileJS,MinifyJS} from './ProcessInlineJS'
import config from '../../inline-src.config.json'
import * as fs from "fs"

describe('CompileJS', () => {
    beforeAll(() => {

        mockFs({
            "./inline-src_work/" : {},
            [config.inlineSource[3].assetPath]: `console.log("hello world!")`,
            [config.inlineSource[3].componentPath]: `import * as fs  from "fs"
            export default function ThisComponent({someProps} : any) {
                const foo = "bar";
                return \`\`;
                // End OtherInlineJS.
            }`,
        });
    })

    afterAll(() => {
        mockFs.restore();
        vi.restoreAllMocks(); 
    })

    it('outputs compiled js file to expected temp file', () => {
        vi.mock('child_process', () => ({
            execSync: vi.fn(() => fs.writeFileSync("./inline-src_work/file.js", `console.log("hello world!")`)),
        }));
        CompileJS(config, config.inlineSource[3]);
        expect(fs.readFileSync("./inline-src_work/file.js").toString()).toBe(`console.log("hello world!")`);
    })

    it('displays console output for the CLI when config.silent is not true', () => {

        config.silent = "false";

        const spy = vi.spyOn(console, 'info').mockImplementation(() => {});

        CompileJS(config, config.inlineSource[3]);

        expect(spy).toHaveBeenNthCalledWith(1,'inline-src: Compiling ./test_work/other.ts via swc...');
        expect(spy).toHaveBeenNthCalledWith(2,'inline-src: Minifying working JS file with uglify-js...');
                    

        spy.mockRestore();
    })

    //it('minifies js at work file path')
});