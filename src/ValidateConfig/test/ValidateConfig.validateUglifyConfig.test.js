import { describe, it, expect, afterAll, beforeAll, beforeEach } from 'vitest'
import mockFs from 'mock-fs'
import {ValidateConfig} from '../ValidateConfig.ts'
import config from "../../../inline-src.config.json"
import {setupMocks} from "./ValidateConfig.validateInlineSource.test.js";
import _ from "lodash";

describe("ValidateConfig", () => {

    let errConfig;

    beforeEach(() => {
        errConfig = _.cloneDeep(config);
        errConfig.inlineSource.splice(1);
    })

    beforeAll(() => {
        mockFs({
            ...setupMocks
        })
    })

    afterAll(() => {
        mockFs.restore();
    })

    it("throws an error if an item provides an unresolved path to an uglify config file", () => {
        errConfig.inlineSource[0].uglifyConfig = "/uglify-config-path-error";
        expect(() => ValidateConfig(errConfig)).toThrow(`inline-src: uglify-js config provided at inlineSource index 0, but file /uglify-config-path-error was not found.`);
    })

    it("throws an error if an item provides an unresolved path to an uglify config file", () => {
        errConfig.inlineSource[0].uglifyConfig = undefined;
        expect(() => ValidateConfig(errConfig)).not.toThrow();
    })

    it("throws an error if a default uglify config file is specified at an uresolved path", () => {
        errConfig.uglifyConfig = "/uglify-config-path-error";
        expect(() => ValidateConfig(errConfig)).toThrow(`inline-src: uglify-js config provided for default configuration, but file "/uglify-config-path-error" was not found.`);
    })

    it("does not throw an error if config.uglifyConfig is undefined", () => {
        errConfig.uglifyConfig = undefined;
        expect(() => ValidateConfig(errConfig)).not.toThrow();
    });

    /* Note that positive tests for user supplied uglify configs are handled in e2e tests, not unit tests. */
})