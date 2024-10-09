import { describe, it, expect, afterAll } from 'vitest'
import mockFs from 'mock-fs'
import {ValidateConfig} from '../ValidateConfig.ts'
import config from "../../../inline-src.config.json"

describe("ValidateConfig", () => {

    afterAll(() => {
        mockFs.restore();
    })

    it("throws an error if the file for componentPath is not resolved", () => {
        mockFs({
            [config.inlineSource[0].assetPath] : 'placeholder'
        })
        expect(() => ValidateConfig(config)).toThrow(`inline-src: Invalid config - File "./test_work/InlineSrc.ts" for "componentPath" at config index 0 does not exist.`);
    })
})