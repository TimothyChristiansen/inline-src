import { describe, it, expect, afterEach } from 'vitest'
import mockFs from 'mock-fs'
import {FindConfig, LoadConfig} from './ConfigUtils.ts'
import config from "../../inline-src.config.json"

const Config = JSON.stringify(config);

const setupMockFs = (extension) => {

    switch(extension) {
        case "js":
            return mockFs({
                './inline-src.config.js' : `module.exports = ${Config}`
            })
        case "mjs":
            return mockFs({
                './inline-src.config.mjs' : `const config = ${Config}`
            })
        case "ts":
            return mockFs({
                './inline-src.config.ts' : `module.exports = ${Config}`
            })
        case "mts":
            return mockFs({
                './inline-src.config.mts' : `const config = ${Config}`
            })
        case "json":
            return mockFs({
                './inline-src.config.json' : `${Config}`
            })
        default:
            return mockFs({
                'error' : `error`
            })
    }
}

export const extensions = ["js", "mjs", "ts", "mts", "json"];

describe("FindConfig", () => {

    afterEach(() => {
        mockFs.restore();
    })

    extensions.forEach((extension) => {
        it(`locates the config file with a .${extension} extension`, () => {
            setupMockFs(extension);
            expect(FindConfig()).toBe(`./inline-src.config.${extension}`);
        })
    })

    it("throws an error when no config file is found", () => {
        setupMockFs();
        expect(() => FindConfig()).toThrow(`inline-src: Config file not found.`);
    })
})

describe("LoadConfig", () => {

    afterEach(() => {
        mockFs.restore();
    })

    extensions.forEach((extension) => {
        it(`correctly loads and processes a config file with a .${extension} extension`, () => {
            setupMockFs(extension);
            const jsConfig = LoadConfig(`./inline-src.config.${extension}`);
            expect(jsConfig).toMatchObject(config);;
        })
    })

    it("throws an error if the config file cannot be parsed as valid json", () => {
        mockFs({
            './inline-src.config.js' : `not valid json`
        })
        expect(() => LoadConfig("./inline-src.config.js")).toThrow("Unexpected token o in JSON at position 1");
    })
})