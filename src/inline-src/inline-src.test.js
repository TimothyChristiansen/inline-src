import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import mockFs from 'mock-fs'
import {InitInlineSrc, CleanupInlineSrc, ProcessInlineCode} from "./inline-src"
import * as ProcessInlineCSS from "../ProcessInlineCSS/ProcessInlineCSS"
import * as ProcessInlineJS from "../ProcessInlineJS/ProcessInlineJS"
import config from '../../inline-src.config.json'
import * as fs from "fs"

function consoleTest(func, silent, message) {
    config.silent = silent;

    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});

    if(silent) {
        func(config);
    } else {
        func();
    }

    if(silent === "true") {
        expect(spy).not.toHaveBeenCalled();
        
    } else if (silent === "false") {
        expect(spy).toHaveBeenCalledWith(message);
    } else {
        expect(spy).not.toHaveBeenCalled();
    }                 

    spy.mockRestore();
}

describe("InitInlineSrc", () => {

    beforeAll(() => {
        mockFs({})
    });

    afterAll(() => {
        mockFs.restore();
        vi.restoreAllMocks();
    });

    it("displays the initial console message if silent is not true", () => {
        consoleTest(InitInlineSrc,'false','inline-src: Initializing...');
    })

    it("does not display the initial console message if silent is true", () => {
        consoleTest(InitInlineSrc,'true');
    })
})

describe("CleanupInlineSrc", () => {
    beforeAll(() => {
        mockFs({"./inline-src_work" : {
            "file.min.css" : "body { background : #000; color : #fff; }"
        }})
    });

    afterAll(() => {
        mockFs.restore();
        vi.restoreAllMocks();
    });

    it("tears down the working directory", () =>  {
        CleanupInlineSrc(config);
        expect(fs.existsSync("./inline-src_work")).toBe(false);
    })

    it("displays the final console message if silent is not true", () => {
        consoleTest(CleanupInlineSrc,'false','inline-src: Complete!');
    })

    it("does not display the final console message if silent is true", () => {
        consoleTest(CleanupInlineSrc,'true');
    })

    it("does not display the final console message if no config is passed", () => {
        consoleTest(CleanupInlineSrc);
    })
})

describe("ProcessInlineCode", () => {

    beforeAll(() => {
        vi.mock('../UpdateInlineCode/UpdateInlineCode', () => ({
            default: vi.fn(() => {}),
        }));
    });

    afterAll(() => {
        mockFs.restore();
        vi.restoreAllMocks();
    });

    it("calls the correct functions for CSS compilation when the inlineSource item's asset path is a CSS file", () => {
        let Config = JSON.parse(JSON.stringify(config));
        let {inlineSource, ...rest} = Config;
        inlineSource.splice(1);
        Config = {inlineSource, rest};
        const spyCompileCSS = vi.spyOn(ProcessInlineCSS, 'CompileCSS').mockImplementation(() => {});
        const spyMinifyCSS = vi.spyOn(ProcessInlineCSS, 'MinifyCSS').mockImplementation(() => {});
        ProcessInlineCode(Config);
        expect(spyCompileCSS).toHaveBeenCalled(1);
        expect(spyMinifyCSS).toHaveBeenCalled(1);
    })

    it("calls the correct functions for JS compilation when the inlineSource item's asset path is a JS file", () => {
        let Config = JSON.parse(JSON.stringify(config));
        let {inlineSource, ...rest} = Config;
        inlineSource = inlineSource.splice(2,1);
        Config = {inlineSource, rest};
        const spyCompileJS = vi.spyOn(ProcessInlineJS, 'CompileJS').mockImplementation(() => {});
        const spyMinifyJS = vi.spyOn(ProcessInlineJS, 'MinifyJS').mockImplementation(() => {});
        ProcessInlineCode(Config);
        expect(spyCompileJS).toHaveBeenCalled(1);
        expect(spyMinifyJS).toHaveBeenCalled(1);
    })
})