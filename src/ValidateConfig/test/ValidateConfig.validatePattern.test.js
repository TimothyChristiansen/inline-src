import { describe, it, expect, afterAll } from 'vitest'
import mockFs from 'mock-fs'
import {ValidateConfig} from '../ValidateConfig.ts'
import config from "../../../inline-src.config.json"
import {setupMocks} from "./ValidateConfig.validateInlineSource.test.js";

describe("ValidateConfig", () => {

    afterAll(() => {
        mockFs.restore();
    })

    it("throws an error if the value found for pattern is not a valid RegExp", () => {
        let errConfig = config;  
        let {inlineSource, ...rest} = errConfig;
        inlineSource.splice(1);
        inlineSource[0].pattern = "[";
        errConfig = {inlineSource, ...rest}; 
        mockFs({
            './inline-src.config.json' : `${errConfig}`,
            ...setupMocks
        })
        expect(() => ValidateConfig(errConfig)).toThrow(`inline-src: Invalid config - Expression "[" for "pattern" at config index 0 is not a valid regular expression.`);
    })
})