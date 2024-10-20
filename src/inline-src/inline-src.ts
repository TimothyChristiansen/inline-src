import {ValidateConfig} from "../ValidateConfig/ValidateConfig.ts"
import {InitInlineSrc, ProcessInlineCode, CleanupInlineSrc} from "./inline-src-utils.ts"
import {lilconfig} from "lilconfig";

export function InlineSrc() {

    const moduleName = "inline-src";

    const explorer = lilconfig(moduleName, {searchPlaces : [
        `${moduleName}.config.js`,
        `${moduleName}.config.mjs`,
        `${moduleName}.config.cjs`,
        `${moduleName}.config.json`
    ]});

    explorer.search()
    .then((result) => {
        if(result && result.config) {
            ValidateConfig(result.config);
            InitInlineSrc(result.config);
            ProcessInlineCode(result.config);
            CleanupInlineSrc(result.config);
        }
        else if (result && result.isEmpty) {
            throw Error('inline-src: Config file is empty.')
        }
        else if (!result || (result && !result.filepath)) {
            throw Error('inline-src: Config file not found.')
        }
        else {
            throw Error('inline-src: Unexpected error loading config file.')
        }
    })
    .catch((error) => {
        throw(error);
    });
}