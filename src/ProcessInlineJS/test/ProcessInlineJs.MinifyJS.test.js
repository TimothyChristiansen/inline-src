import { describe, it, expect, beforeAll, beforeEach, afterAll, vi } from 'vitest';
import mockFs from 'mock-fs';
import { GetUglifyConfig, MinifyJS } from '../ProcessInlineJS';
import config from '../../../inline-src.config.json';
import * as fs from 'fs';
import _ from "lodash";

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

describe("GetUglifyConfig", () => {

    let errConfig;

    beforeEach(() => {
        errConfig = _.cloneDeep(config);
    })

    it("returns the default config string if no alternative is defined", () => {
        expect(GetUglifyConfig(config, config.inlineSource[3])).toBe("--compress templates=false");
    })

    it("returns the path to the uglify config defined in the item when present", () => {
        errConfig.inlineSource[3].uglifyConfig = "./inline-src/item3-uglify-config.js";
        expect(GetUglifyConfig(errConfig, errConfig.inlineSource[3])).toBe("--config ./inline-src/item3-uglify-config.js");
    })

    it("returns the path to the user-defined default uglify config present", () => {
        errConfig.uglifyConfig = "./inline-src/uglify-config.js";
        expect(GetUglifyConfig(errConfig, errConfig.inlineSource[3])).toBe("--config ./inline-src/uglify-config.js");
    })
})

describe('MinifyJS', () => {
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
        consoleTest(MinifyJS, 'false', 'inline-src: Minifying working JS file with uglify-js...');
    });

    it('does not display console output for the CLI when config.silent is true', () => {
        consoleTest(MinifyJS, 'true');
    });

    /* This test exists for code coverage but is insufficient to actually test the functionality of the execSync child_process. See integration test for functionality test. */
    it('outputs the minified js', () => {
        vi.mock('child_process', () => ({
            execSync: vi.fn(() => fs.writeFileSync("./inline-src_work/file.min.js", `console.log("hello world!")`)),
        }));
        MinifyJS(config, config.inlineSource[3]);
        expect(fs.readFileSync("./inline-src_work/file.min.js").toString()).toBe(`console.log("hello world!")`);
    });
});