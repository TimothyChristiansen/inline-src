import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import mockFs from 'mock-fs'
import {InitInlineSrc, CleanupInlineSrc, ProcessInlineCode} from "./inline-src-core"
import * as ProcessInlineCSS from "../ProcessInlineCSS/ProcessInlineCSS"
import * as ProcessInlineJS from "../ProcessInlineJS/ProcessInlineJS"
import config from '../../inline-src.config.json'
import * as fs from "fs"
import _ from "lodash";

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

function fileTypeTest(configIndex) {
    let Config = _.cloneDeep(config);
    Config.inlineSource = Config.inlineSource.splice(configIndex,1);
    const spyCompileCSS = vi.spyOn(ProcessInlineCSS, 'CompileCSS').mockImplementation(() => {});
    const spyMinifyCSS = vi.spyOn(ProcessInlineCSS, 'MinifyCSS').mockImplementation(() => {});
    const spyCompileJS = vi.spyOn(ProcessInlineJS, 'CompileJS').mockImplementation(() => {});
    const spyMinifyJS = vi.spyOn(ProcessInlineJS, 'MinifyJS').mockImplementation(() => {});
    ProcessInlineCode(Config);

    const cssExpects = () => {
        expect(spyCompileCSS).toHaveBeenCalled(1);
        expect(spyMinifyCSS).toHaveBeenCalled(1);
        expect(spyCompileJS).not.toHaveBeenCalled();
        expect(spyMinifyJS).not.toHaveBeenCalled();
    }

    const jsExpects = () => {
        expect(spyCompileJS).toHaveBeenCalled(1);
        expect(spyMinifyJS).toHaveBeenCalled(1);
        expect(spyCompileCSS).not.toHaveBeenCalled();
        expect(spyMinifyCSS).not.toHaveBeenCalled();
    }

    switch(configIndex) {
        case 0:
            cssExpects();
            break;
        case 1:
            cssExpects();
            break;
        case 2:
            jsExpects();
            break;
        case 3:
            jsExpects();
            break;
        case 4:
            cssExpects();
            break;
        default:
            throw new Error(`configIndex ${configIndex} out of bounds for configured test suite.`)
    }
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

    it("calls the correct functions for CSS compilation when the inlineSource item's asset path is a .scss file", () => {
        fileTypeTest(0);
    })

    it("calls the correct functions for CSS compilation when the inlineSource item's asset path is a .css file", () => {
        fileTypeTest(1);
    })

    it("calls the correct functions for CSS compilation when the inlineSource item's asset path is a .sass file", () => {
        fileTypeTest(4);
    })

    it("calls the correct functions for JS compilation when the inlineSource item's asset path is a .ts file", () => {
        fileTypeTest(2);
    })

    it("calls the correct functions for JS compilation when the inlineSource item's asset path is a .js file", () => {
        fileTypeTest(3);
    })
})