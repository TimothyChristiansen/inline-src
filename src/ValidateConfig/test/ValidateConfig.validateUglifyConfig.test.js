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

    it("throws an error if an item provides an unresolved path to an uglify config file", () => {
        let {inlineSource, ...rest} = errConfig;
        inlineSource[0].uglifyConfig = "/uglify-config-path-error";
        errConfig = {inlineSource, ...rest};
        mockFs({

            ...setupMocks
        })
        expect(() => ValidateConfig(errConfig)).toThrow(`inline-src: uglify-js config provided at inlineSource index 0, but file /uglify-config-path-error was not found.`);
    })


    it("throws an error if an item provides an unresolved path to an uglify config file", () => {
        let {inlineSource, ...rest} = errConfig;
        inlineSource.splice(1);
        inlineSource[0].uglifyConfig = undefined;
        errConfig = {inlineSource, ...rest};
        mockFs({
            ...setupMocks
        })
        expect(() => ValidateConfig(errConfig)).not.toThrow();
    })

    it("throws an error if a default uglify config file is specified at an uresolved path", () => {
        let {inlineSource, ...rest} = errConfig;
        inlineSource.splice(1);
        errConfig = {inlineSource, ...rest, uglifyConfig : "/uglify-config-path-error"};
        mockFs({
            ...setupMocks
        })
        expect(() => ValidateConfig(errConfig)).toThrow(`inline-src: uglify-js config provided for default configuration, but file "/uglify-config-path-error" was not found.`);
    })

    it("does not throw an error if config.uglifyConfig is undefined", () => {
        let {inlineSource, ...rest} = errConfig;
        inlineSource.splice(1);
        errConfig = {inlineSource, ...rest, uglifyConfig : undefined};
        mockFs({
            ...setupMocks
        })
        expect(() => ValidateConfig(errConfig)).not.toThrow();
    });
})