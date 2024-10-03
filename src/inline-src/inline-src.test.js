import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import mockFs from 'mock-fs'
import {InitInlineSrc} from "./inline-src"
import config from '../../inline-src.config.json'
import * as fs from "fs"

function consoleTest(func, silent, message) {
    config.silent = silent;

    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});

    func(config);

    if(silent === "true") {
        expect(spy).not.toHaveBeenCalled();
        
    } else {
        expect(spy).toHaveBeenCalledWith(message);
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

    it("creates the initial working directory", () => {
        InitInlineSrc(config);
        expect(fs.existsSync("./inline-src_work")).toBeTruthy();
    })
})