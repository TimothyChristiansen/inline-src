import { describe, it, expect, beforeAll, beforeEach, afterAll, vi } from 'vitest'
import {InlineSrc} from "../inline-src/inline-src.ts"
import * as ValidateConfigFunc from "../ValidateConfig/ValidateConfig.ts"
import * as InlineSrcFuncs from "../inline-src/inline-src-utils.ts"
import config from '../../inline-src.config.json'
import _ from "lodash";

let errConfig;

describe("InlineSrc", () => {
    beforeAll(() => {
        errConfig = _.cloneDeep(config);
        vi.mock('lilconfig', () => ({
            lilconfig: vi.fn().mockImplementation(() => ({
                search: vi.fn(async () => { return {"config" : config} })
            })),
        }));
    })

    afterAll(() => {
        vi.restoreAllMocks();
    })

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls each top level function if there is a resultant config", async () => {
        const ValidateConfigSpy = vi.spyOn(ValidateConfigFunc, 'ValidateConfig').mockImplementation(() => {});
        const InitInlineSrcSpy = vi.spyOn(InlineSrcFuncs, 'InitInlineSrc').mockImplementation(() => {});
        const CleanupInlineSrcSpy = vi.spyOn(InlineSrcFuncs, 'ProcessInlineCode').mockImplementation(() => {});
        const ProcessInlineCodeSpy = vi.spyOn(InlineSrcFuncs, 'CleanupInlineSrc').mockImplementation(() => {});
        await InlineSrc();
        expect(ValidateConfigSpy).toHaveBeenCalled(1);
        expect(InitInlineSrcSpy).toHaveBeenCalled(1);
        expect(CleanupInlineSrcSpy).toHaveBeenCalled(1);
        expect(ProcessInlineCodeSpy).toHaveBeenCalled(1);

    })
})