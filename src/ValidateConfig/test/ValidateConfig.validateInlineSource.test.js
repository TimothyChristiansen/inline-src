import { describe, it, expect, afterAll, beforeEach } from 'vitest'
import mockFs from 'mock-fs'
import {ValidateConfig} from '../ValidateConfig.ts'
import config from "../../../inline-src.config.json"

const Config = JSON.stringify(config);

let errConfig;

export const setupMocks = {
    [config.inlineSource[0].assetPath]: 'body {background: #000;color: #fff;}',
    [config.inlineSource[0].componentPath]: `import * as fs  from "fs"
    export default function ThisComponent({someProps} : any) {
        const foo = "bar";
        return \`\`;
        // End MyComponentInlineCSS.
    }`
}

const keys = ["assetPath", "componentPath", "componentCode"];

describe("ValidateConfig", () => {

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
        errConfig = {...rest};
        mockFs({
            ...setupMocks
        })
        expect(() => ValidateConfig(errConfig)).toThrow(`inline-src: Config object for inlineSource is undefined.`);
    })

    it("throws an error if config inlineSource is not an Array", () => {
        let {inlineSource, ...rest} = errConfig;
        inlineSource = {"not" : "an array"};
        errConfig = {inlineSource, ...rest};
        mockFs({
            ...setupMocks
        })
        expect(() => ValidateConfig(errConfig)).toThrow(`inline-src: Config object for inlineSource is not an Array.`);
    })

    it("throws an error if config inlineSource has 0 length", () => {
        let {inlineSource, ...rest} = errConfig;
        inlineSource = [];
        errConfig = {inlineSource, ...rest};
        mockFs({
            ...setupMocks
        })
        expect(() => ValidateConfig(errConfig)).toThrow(`inline-src: Config object for inlineSource has 0 length.`);
    })

    it("throws an error if there is no match found between the supplied componentCode and the actual code in the target file at componentPath", () => {
        mockFs({
            [config.inlineSource[0].assetPath]: 'body {background: #000;color: #fff;}',
            [config.inlineSource[0].componentPath]: `import * as fs  from "fs"
            export default function ThisComponent({someProps} : any) {
                const foo = "bar";
                return \`\`;
                // End ThisIsAMismatch!
            }`
        })
        expect(() => ValidateConfig(errConfig)).toThrow(`inline-src: No match found for "return \`[inline-src_contents]\`;
                // End MyComponentInlineCSS." in "./test_work/InlineSrc.ts" at inlineSource index 0.`);
    })
 
    keys.forEach((key) => {
        it(`throws an error if config.inlineSource.${key} is missing`, () => {
            let {inlineSource, ...rest} = errConfig;
            let {[key] : removedKey, ...inlineSourceRest} = inlineSource[0];
            inlineSource[0] = {...inlineSourceRest};
            errConfig = {inlineSource, ...rest};
            mockFs({
                ...setupMocks
            })
            expect(() => ValidateConfig(errConfig)).toThrow(`inline-src: Invalid config - Missing key "${key}" at config index 0.`);
        })
    });
})