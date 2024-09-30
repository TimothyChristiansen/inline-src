import { describe, it, expect, afterAll, beforeEach } from 'vitest'
import mockFs from 'mock-fs'
import {ValidateConfig} from '../ValidateConfig.ts'
import config from "../../../inline-src.config.json"

const Config = JSON.stringify(config);

describe("ValidateConfig", () => {

    let errConfig;

    beforeEach(() => {
        errConfig = JSON.parse(Config);
    })

    afterAll(() => {
        mockFs.restore();
    })

    it("throws an error if the file for assetPath is not resolved", () => {
        errConfig = JSON.stringify(errConfig);
        mockFs({
            './inline-src.config.json' : `${errConfig}`,
        })
        expect(() => ValidateConfig()).toThrow(`inline-src: Invalid config - File "./test_work/globals.scss" for "assetPath" at config index 0 does not exist.`);
    })

    it("throws an error if the file for assetPath is not of a valid file type", () => {
        let {inlineSource, ...rest} = errConfig;
        const newPath = './test_work/invalid_extention.txt';
        inlineSource[0].assetPath = newPath;
        errConfig = {inlineSource, ...rest};
        errConfig = JSON.stringify(errConfig);
        mockFs({
            './inline-src.config.json' : `${errConfig}`,
            [newPath] : "content"
        })
        expect(() => ValidateConfig()).toThrow(`inline-src: File "./test_work/invalid_extention.txt" at config index 0 is not a valid compilable file type (.css, .scss, .js, .mjs, .ts, or .mts).`);
    })

    it("throws an error if the file type is js but the config for the swcrc path is undefined", () => {
        let {inlineSource, ...rest} = errConfig;
        inlineSource = inlineSource.splice(2,1);
        errConfig = {inlineSource, ...rest};
        let {swcrcPath, ...swcrcRest} = errConfig;
        errConfig = {...swcrcRest};
        errConfig = JSON.stringify(errConfig);
        mockFs({
            './inline-src.config.json' : `${errConfig}`,
            './test_work/layout.ts' : 'placeholder'
        })
        expect(() => ValidateConfig()).toThrow(`inline-src: File "./test_work/layout.ts" at config index 0 is a TypeScript file, but "swcrcPath" was undefined.`);
    })

    it("throws an error if the file type is js but the config for the swcrc path is unresolved", () => {
        let {inlineSource, ...rest} = errConfig;
        inlineSource = inlineSource.splice(2,1);
        errConfig = {inlineSource, ...rest};
        errConfig = JSON.stringify(errConfig);
        mockFs({
            './inline-src.config.json' : `${errConfig}`,
            './test_work/layout.ts' : 'placeholder'
        })
        expect(() => ValidateConfig()).toThrow(`inline-src: File "./test_work/layout.ts" at config index 0 is a TypeScript file, but path to .swcrc file from config was unresolved.`);
    })

    it("throws an error if the file type is js but the config for the swcrc path is unresolved", () => {
        let {inlineSource, ...rest} = errConfig;
        inlineSource = inlineSource.splice(2,1);
        errConfig = {inlineSource, ...rest};
        errConfig = JSON.stringify(errConfig);
        mockFs({
            './inline-src.config.json' : `${errConfig}`,
            './test_work/layout.ts' : 'placeholder'
        })
        expect(() => ValidateConfig()).toThrow(`inline-src: File "./test_work/layout.ts" at config index 0 is a TypeScript file, but path to .swcrc file from config was unresolved.`);
    })
})