import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import mockFs from 'mock-fs'
import {CompileCSS} from '../ProcessInlineCSS'
import config from '../../../inline-src.config.json'
import * as fs from "fs"

function consoleTest(func, silent, message) {
    config.silent = silent;

    vi.mock('child_process', () => ({
        execSync: vi.fn(() => fs.writeFileSync("./inline-src_work/file.css", `body { background: #000; color: #fff; }`)),
    }));

    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});

    func(config, config.inlineSource[0]);

    if(silent === "true") {
        expect(spy).not.toHaveBeenCalled();
        
    } else {
        expect(spy).toHaveBeenCalledWith(message);
    }                 

    spy.mockRestore();
}

describe('CompileCSS', () => {

    beforeAll(() => {

        mockFs({
            "./inline-src_work/" : {},
            [config.inlineSource[0].assetPath]: `body { background: #000; color: #fff; }`,
            [config.inlineSource[0].componentPath]: `import * as fs  from "fs"
            export default function ThisComponent({someProps} : any) {
                const foo = "bar";
                return \`\`;
                // End MyComponentInlineCSS.
            }`,
            [config.inlineSource[1].assetPath]: `body { background: #000; color: #fff; }`,
            [config.inlineSource[1].componentPath]: `import * as fs  from "fs"
            export default function ThisComponent({someProps} : any) {
                const foo = "bar";
                return \`\`;
                // End OtherInlineCSS.
            }`,
        });
    })

    afterAll(() => {
        mockFs.restore();
        vi.restoreAllMocks(); 
    })

    it('displays console output for the CLI when config.silent is not true and the file is a SASS file', () => {

        consoleTest(CompileCSS, 'false', 'inline-src: ./test_work/globals.scss - Compiling SASS...');

    })

    it('does not display console output for the CLI when config.silent is true and the file is a SASS file', () => {

        consoleTest(CompileCSS, 'true')

    })

    /* This test exists for code coverage but is insufficient to actually test the functionality of the execSync child_process. See integration test for functionality test. */
    it('compiles SASS when the file is scss', () => {
        vi.mock('child_process', () => ({
            execSync: vi.fn(() => fs.writeFileSync("./inline-src_work/file.css", `body { background: #000; color: #fff; }`)),
        }));
        CompileCSS(config,config.inlineSource[0])
        expect(fs.readFileSync("./inline-src_work/file.css").toString()).toBe(`body { background: #000; color: #fff; }`);
    })

    it('writes the file to the temp directory when the file is not scss', () => {
        CompileCSS(config,config.inlineSource[1])
        expect(fs.readFileSync("./inline-src_work/file.css").toString()).toBe(`body { background: #000; color: #fff; }`);
    })
})