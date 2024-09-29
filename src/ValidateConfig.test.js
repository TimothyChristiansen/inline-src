import { describe, it, expect, afterEach, afterAll, beforeEach } from 'vitest'
import mockFs from 'mock-fs'
import {findConfig, loadConfig, ValidateConfig } from './ValidateConfig.ts'
import config from "../inline-src.config.json"

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

describe("findConfig", () => {

    afterEach(() => {
        mockFs.restore();
    })

    it("locates the config file with a .js extension", () => {
        setupMockFs("js");
        expect(findConfig()).toBe("./inline-src.config.js");
    })

    it("locates the config file with a .mjs extension", () => {
        setupMockFs("mjs");
        expect(findConfig()).toBe("./inline-src.config.mjs");
    })

    it("locates the config file with a .ts extension", () => {
        setupMockFs("ts")
        expect(findConfig()).toBe("./inline-src.config.ts");
    })

    it("locates the config file with a .mts extension", () => {
        setupMockFs("mts")
        expect(findConfig()).toBe("./inline-src.config.mts");
    })

    it("locates the config file with a .json extension", () => {
        setupMockFs("json");
        expect(findConfig()).toBe("./inline-src.config.json");
    })

    it("throws an error when no config file is found", () => {
        setupMockFs();
        expect(() => findConfig()).toThrow(`inline-src: Config file not found.`);
    })
})

describe("loadConfig", () => {

    afterEach(() => {
        mockFs.restore();
    })

    it("correctly loads and processes a config file with a .js extension", () => {
        setupMockFs("js");
        const jsConfig = loadConfig("./inline-src.config.js");
        expect(jsConfig).toMatchObject(config);
    })

    it("correctly loads and processes a config file with a .mjs extension", () => {
        setupMockFs("mjs");
        const jsConfig = loadConfig("./inline-src.config.mjs");
        expect(jsConfig).toMatchObject(config);
    })

    it("correctly loads and processes a config file with a .ts extension", () => {
        setupMockFs("ts");
        const jsConfig = loadConfig("./inline-src.config.ts");
        expect(jsConfig).toMatchObject(config);
    })

    it("correctly loads and processes a config file with a .mts extension", () => {
        setupMockFs("mts");
        const jsConfig = loadConfig("./inline-src.config.mts");
        expect(jsConfig).toMatchObject(config);
    })

    it("correctly loads and processes a config file with a .json extension", () => {
        setupMockFs("json");
        const jsConfig = loadConfig("./inline-src.config.json");
        expect(jsConfig).toMatchObject(config);
    })

    it("throws an error if the config file cannot be parsed as valid json", () => {
        mockFs({
            './inline-src.config.js' : `not valid json`
        })
        expect(() => loadConfig("./inline-src.config.js")).toThrow("Unexpected token o in JSON at position 1");
    })
})

describe("ValidateConfig", () => {

    let errConfig;

    const setupMocks = {
        [config.inlineSource[0].assetPath]: 'body {background: #000;color: #fff;}',
        [config.inlineSource[0].componentPath]: `import * as fs  from "fs"
        export default function ThisComponent({someProps} : any) {
            const foo = "bar";
            return \`\`;
            // End MyComponentInlineCSS.
        }`
    }

    beforeEach(() => {
        errConfig = JSON.parse(Config);
        let {inlineSource, ...rest} = errConfig;
        inlineSource.splice(1);
        errConfig = {inlineSource, ...rest};
    })

    afterAll(() => {
        mockFs.restore();
    })

    it("throws an error if config inlineSource is undefined", () => {
        let {inlineSource, ...rest} = errConfig;
        errConfig = JSON.stringify({...rest});
        mockFs({
            './inline-src.config.json' : `${errConfig}`,
            ...setupMocks
        })
        expect(() => ValidateConfig()).toThrow(`inline-src: Config object for inlineSource is undefined.`);
    })

    it("throws an error if config inlineSource is not an Array", () => {
        let {inlineSource, ...rest} = errConfig;
        inlineSource = {"not" : "an array"};
        errConfig = JSON.stringify({inlineSource, ...rest});
        mockFs({
            './inline-src.config.json' : `${errConfig}`,
            ...setupMocks
        })
        expect(() => ValidateConfig()).toThrow(`inline-src: Config object for inlineSource is not an Array.`);
    })

    it("throws an error if config inlineSource has 0 length", () => {
        let {inlineSource, ...rest} = errConfig;
        inlineSource = [];
        errConfig = JSON.stringify({inlineSource, ...rest});
        mockFs({
            './inline-src.config.json' : `${errConfig}`,
            ...setupMocks
        })
        expect(() => ValidateConfig()).toThrow(`inline-src: Config object for inlineSource has 0 length.`);
    })

    it("throws an error if config inlineSource assetPath key is missing", () => {
        let {inlineSource, ...rest} = errConfig;
        let {assetPath, ...inlineSourceRest} = inlineSource[0];
        inlineSource[0] = {...inlineSourceRest};
        errConfig = JSON.stringify({inlineSource, ...rest});
        mockFs({
            './inline-src.config.json' : `${errConfig}`,
            ...setupMocks
        })
        console.log("assetPath test")
        expect(() => ValidateConfig()).toThrow(`inline-src: Invalid config - Missing key "assetPath" at config index 0.`);
    })

    it("throws an error if config inlineSource componentPath key is missing", () => {
        let {inlineSource, ...rest} = errConfig;
        let {componentPath, ...inlineSourceRest} = inlineSource[0];
        inlineSource[0] = {...inlineSourceRest};
        errConfig = JSON.stringify({inlineSource, ...rest});
        mockFs({
            './inline-src.config.json' : `${errConfig}`,
            ...setupMocks
        })
        expect(() => ValidateConfig()).toThrow(`inline-src: Invalid config - Missing key "componentPath" at config index 0.`);
    })

    it("throws an error if config inlineSource pattern key is missing", () => {
        let {inlineSource, ...rest} = errConfig;
        let {pattern, ...inlineSourceRest} = inlineSource[0];
        inlineSource[0] = {...inlineSourceRest};
        errConfig = JSON.stringify({inlineSource, ...rest});
        mockFs({
            './inline-src.config.json' : `${errConfig}`,
            ...setupMocks
        })
        expect(() => ValidateConfig()).toThrow(`inline-src: Invalid config - Missing key "pattern" at config index 0.`);
    })

    it("throws an error if config inlineSource componentCode key is missing", () => {
        let {inlineSource, ...rest} = errConfig;
        let {componentCode, ...inlineSourceRest} = inlineSource[0];
        inlineSource[0] = {...inlineSourceRest};
        errConfig = JSON.stringify({inlineSource, ...rest});
        mockFs({
            './inline-src.config.json' : `${errConfig}`,
            ...setupMocks
        })
        expect(() => ValidateConfig()).toThrow(`inline-src: Invalid config - Missing key "componentCode" at config index 0.`);
    })

    it("throws an error if the file for assetPath is not resolved", () => {
        errConfig = JSON.stringify(errConfig);
        mockFs({
            './inline-src.config.json' : `${errConfig}`,
        })
        expect(() => ValidateConfig()).toThrow(`inline-src: Invalid config - File "./test_work/globals.scss" for "assetPath" at config index 0 does not exist.`);
    })

    it("throws an error if the file for assetPath is not of a valid file type", () => {
        const newPath = './test_work/invalid_extention.txt';
        let {inlineSource, ...rest} = errConfig;
        inlineSource[0].assetPath = newPath;
        errConfig = {inlineSource, ...rest};
        errConfig = JSON.stringify(errConfig);
        mockFs({
            './inline-src.config.json' : `${errConfig}`,
            [newPath] : "content"
        })
        expect(() => ValidateConfig()).toThrow(`inline-src: File "./test_work/invalid_extention.txt" at config index 0 is not a valid compilable file type (.css, .scss, .js, or .ts).`);
    })
})