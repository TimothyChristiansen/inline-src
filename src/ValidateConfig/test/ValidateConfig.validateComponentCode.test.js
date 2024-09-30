import { describe, it, expect, afterAll, beforeEach } from 'vitest'
import mockFs from 'mock-fs'
import {ValidateConfig} from '../ValidateConfig.ts'
import config from "../../../inline-src.config.json"
import {setupMocks} from "./ValidateConfig.validateInlineSource.test.js";

const Config = JSON.stringify(config);

describe("ValidateConfig", () => {

    let errConfig;

    beforeEach(() => {
        errConfig = JSON.parse(Config);
    })

    afterAll(() => {
        mockFs.restore();
    })

    it("throws an error if the componentCode is not a string", () => {
        let {inlineSource, ...rest} = errConfig;
        inlineSource.splice(1);
        inlineSource[0].componentCode = {};
        errConfig = {inlineSource, ...rest};
        errConfig = JSON.stringify(errConfig);
        mockFs({
            './inline-src.config.json' : `${errConfig}`,
            ...setupMocks
        })
        expect(() => ValidateConfig()).toThrow(`inline-src: Invalid config - Invalid object found for "componentCode" at config index 0. Expected string but received [object Object].`);
    })

    it("throws an error if the componentCode is not a string", () => {
        let {inlineSource, ...rest} = errConfig;
        inlineSource.splice(1);
        inlineSource[0].componentCode = `inline-src_content token is missing!`;
        errConfig = {inlineSource, ...rest};
        errConfig = JSON.stringify(errConfig);
        mockFs({
            './inline-src.config.json' : `${errConfig}`,
            ...setupMocks
        })
        expect(() => ValidateConfig()).toThrow(`inline-src: Invalid config - [inline-src_contents] token not found for "componentCode" at config index 0.`);
    })
})