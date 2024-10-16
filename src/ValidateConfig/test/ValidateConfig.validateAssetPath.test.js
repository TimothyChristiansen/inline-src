import { describe, it, expect, afterAll, beforeEach } from 'vitest'
import mockFs from 'mock-fs'
import {ValidateConfig} from '../ValidateConfig.ts'
import config from "../../../inline-src.config.json"
import _ from "lodash";

let errConfig;

describe("ValidateConfig", () => {
    beforeEach(() => {
        errConfig = _.cloneDeep(config);
    })

    afterAll(() => {
        mockFs.restore();
    })

    it("throws an error if the file for assetPath is not resolved", () => {
        expect(() => ValidateConfig(errConfig)).toThrow(`inline-src: Invalid config - File "./test_work/globals.scss" for "assetPath" at config index 0 does not exist.`);
    })

    it("throws an error if the file for assetPath is not of a valid file type", () => {
        const newPath = './test_work/invalid_extension.txt';
        errConfig.inlineSource[0].assetPath = newPath;
        mockFs({
            [newPath] : "content"
        })
        expect(() => ValidateConfig(errConfig)).toThrow(`inline-src: File "./test_work/invalid_extension.txt" at config index 0 is not a valid compilable file type (.css, .scss, .sass, .js, .mjs, .ts, or .mts).`);
    })
})

describe("ValidateConfig", () => {

    beforeEach(() => {
        errConfig = _.cloneDeep(config);
        errConfig.inlineSource = errConfig.inlineSource.splice(2,1);
    })

    afterAll(() => {
        mockFs.restore();
    })

    it("throws an error if the file type is js but the config for the swcrc path is undefined", () => {
        let {swcrcPath, ...swcrcRest} = errConfig;
        errConfig = {...swcrcRest};
        mockFs({
            './test_work/layout.ts' : 'placeholder'
        })
        expect(() => ValidateConfig(errConfig)).toThrow(`inline-src: File "./test_work/layout.ts" at config index 0 is a TypeScript file, but "swcrcPath" was undefined.`);
    })

    it("throws an error if the file type is js but the config for the swcrc path is unresolved", () => {
        errConfig.swcrcPath = ".swcrc"
        mockFs({
            './test_work/layout.ts' : 'placeholder'
        })
        expect(() => ValidateConfig(errConfig)).toThrow(`inline-src: File "./test_work/layout.ts" at config index 0 is a TypeScript file, but path to .swcrc file from config was unresolved.`);
    })

    it("does not throw an error if the file type is js and there is a resolved swcrc file", () => {
        errConfig.swcrcPath = ".swcrc"
        mockFs({
            './.swcrc' : 'real config tested in e2e test',
            './test_work/layout.ts' : 'placeholder',
            './test_work/InlineSrc3.ts' : `return \`\`;
                            // End LayoutInlineJS.`
        })
        expect(() => ValidateConfig(errConfig)).not.toThrow();
    })

    /* Note: Only the existence of the .swcrc file is tested in unit tests because the full functionality and integration are tested in the e2e tests. */
})