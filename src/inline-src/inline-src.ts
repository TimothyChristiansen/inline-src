import {ValidateConfig} from "../ValidateConfig/ValidateConfig.ts"
import {InitInlineSrc, ProcessInlineCode, CleanupInlineSrc} from "./inline-src-core.ts"
import {lilconfig} from "lilconfig";

export function InlineSrc() {

    const moduleName = "inline-src";

    const explorer = lilconfig(moduleName, {searchPlaces : [
        `${moduleName}.config.js`,
        `${moduleName}.config.mjs`,
        `${moduleName}.config.cjs`,
        `${moduleName}.config.json`
    ]});

    return explorer.search()
    .then((result) => {
        console.log(result); 
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
        /* This line/branch cannot be adequately tested, and esbuild strips all comments, even !legal comments, to ignore it in code coverage from this position */
        else {
            throw Error('inline-src: Unexpected error loading config file.')
        }
    })
    .catch((error) => {
        throw(error);
    });
}