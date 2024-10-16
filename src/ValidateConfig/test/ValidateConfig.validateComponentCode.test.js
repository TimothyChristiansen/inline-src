import { describe, it, expect, afterAll, beforeAll, beforeEach } from 'vitest'
import mockFs from 'mock-fs'
import {ValidateConfig} from '../ValidateConfig.ts'
import config from "../../../inline-src.config.json"
import {setupMocks} from "./ValidateConfig.validateInlineSource.test.js";
import _ from "lodash";

describe("ValidateConfig", () => {

    let errConfig;

    beforeAll(() => {
        mockFs({
            ...setupMocks
        })
    })

    beforeEach(() => {
        errConfig = _.cloneDeep(config);
        errConfig.inlineSource.splice(1);
    })

    afterAll(() => {
        mockFs.restore();
    })

    it("throws an error if the componentCode is not a string", () => {
        errConfig.inlineSource[0].componentCode = {};
        expect(() => ValidateConfig(errConfig)).toThrow(`inline-src: Invalid config - Invalid object found for "componentCode" at config index 0. Expected string but received [object Object].`);
    })

    it("throws an error if the componentCode is missing the [inline-src_content] token", () => {
        errConfig.inlineSource[0].componentCode = `inline-src_content token is missing!`;
        expect(() => ValidateConfig(errConfig)).toThrow(`inline-src: Invalid config - [inline-src_contents] token not found for "componentCode" at config index 0.`);
    })
})