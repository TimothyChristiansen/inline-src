import {FindConfig, LoadConfig} from "../ConfigUtils/ConfigUtils.ts"
import {ValidateConfig} from "../ValidateConfig/ValidateConfig.ts"
import {InitInlineSrc, ProcessInlineCode, CleanupInlineSrc} from "./inline-src.ts"
import {Config} from "../inline-src.config/inline-src.config"

export function InlineSrc() {
    ValidateConfig();
    const config : Config = LoadConfig(FindConfig());
    InitInlineSrc(config);
    ProcessInlineCode(config);
    CleanupInlineSrc(config);
}

InlineSrc();