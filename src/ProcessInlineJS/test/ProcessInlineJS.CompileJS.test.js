import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import mockFs from 'mock-fs';
import { CompileJS } from '../ProcessInlineJS';
import config from '../../../inline-src.config.json';
import * as fs from 'fs';

function consoleTest(func, silent, message) {
    config.silent = silent;

    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});

    func(config, config.inlineSource[3]);

    if (silent === "true") {
        expect(spy).not.toHaveBeenCalled();
    } else {
        expect(spy).toHaveBeenCalledWith(message);
    }

    spy.mockRestore();
}

describe('CompileJS', () => {
    beforeAll(() => {
        mockFs({
            "./inline-src_work/": {},
            [config.inlineSource[3].assetPath]: `console.log("hello world!")`,
            [config.inlineSource[3].componentPath]: `import * as fs from "fs"
            export default function ThisComponent({someProps} : any) {
                const foo = "bar";
                return \`\`;
                // End OtherInlineJS.
            }`,
        });
    });

    afterAll(() => {
        mockFs.restore();
        vi.restoreAllMocks();
    });

    it('displays console output for the CLI when config.silent is not true', () => {
        consoleTest(CompileJS, 'false', 'inline-src: Compiling ./test_work/other.ts via swc...');
    });

    it('does not display console output for the CLI when config.silent is true', () => {
        consoleTest(CompileJS, 'true');
    });

    /* This test exists for code coverage but is insufficient to actually test the functionality of the execSync child_process. See integration test for functionality test. */
    it('outputs compiled js file', () => {
        vi.mock('child_process', () => ({
            execSync: vi.fn(() => fs.writeFileSync("./inline-src_work/file.js", `console.log("hello world!")`)),
        }));
        CompileJS(config, config.inlineSource[3]);
        expect(fs.readFileSync("./inline-src_work/file.js").toString()).toBe(`console.log("hello world!")`);
    });
});