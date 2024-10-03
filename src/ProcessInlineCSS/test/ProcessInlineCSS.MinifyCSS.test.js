import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import mockFs from 'mock-fs'
import {MinifyCSS} from '../ProcessInlineCSS'
import config from '../../../inline-src.config.json'
import * as fs from "fs"

function consoleTest(func, silent, message) {
    config.silent = silent;

    vi.mock('child_process', () => ({
        execSync: vi.fn(() => fs.writeFileSync("./inline-src_work/file.min.css", `body { background: #000; color: #fff; }`)),
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

describe('MinifyCSS', () => {

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
        });
    })

    afterAll(() => {
        mockFs.restore();
        vi.restoreAllMocks(); 
    })

    it('displays console output for the CLI when config.silent is not true', () => {
        consoleTest(MinifyCSS, 'false', 'inline-src: Minifying working CSS file with minify-css...');
    })

    it('does not display console output for the CLI when config.silent is true', () => {
        consoleTest(MinifyCSS, 'true')
    })

    /* This test exists for code coverage but is insufficient to actually test the functionality of the execSync child_process. See integration test for functionality test. */
    it('outputs the minified css', () => {
        vi.mock('child_process', () => ({
            execSync: vi.fn(() => fs.writeFileSync("./inline-src_work/file.min.css", `body { background: #000; color: #fff; }`)),
        }));
        MinifyCSS(config, config.inlineSource[0]);
        expect(fs.readFileSync("./inline-src_work/file.min.css").toString()).toBe(`body { background: #000; color: #fff; }`);
    });
})