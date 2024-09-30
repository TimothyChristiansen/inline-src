import {Config, InlineSource} from "../inline-src.config/inline-src.config.ts"
import {FindConfig, LoadConfig} from "../ConfigUtils/ConfigUtils.ts"
import {ValidateConfig} from "../ValidateConfig/ValidateConfig.ts"
import {CompileCSS, MinifyCSS} from "../ProcessInlineCSS/ProcessInlineCSS.ts"
import {CompileJS, MinifyJS} from "../ProcessInlineJS/ProcessInlineJS.ts"
import * as fs from "fs"

export function InitInlineSrc(config : Config) {
    if(config.silent !== true && config.silent !== "true") {
        console.log("inline-src: Initializing...");
    }
    if(!fs.existsSync("./inline-src_work")) {
        fs.mkdirSync("./inline-src_work");
    }
}

function processInlineCSS(config : Config, item : InlineSource) {
    CompileCSS(config, item)
    MinifyCSS(config, item);
}

function processInlineJS(config : Config, item : InlineSource) {
    CompileJS(config, item);
    MinifyJS(config, item);
}

export function CleanupInlineSrc(config : Config) {
    fs.rmSync("./inline-src_work", { recursive: true, force: true });
    if(config.silent !== true && config.silent !== "true") {
        console.log("inline-src: Complete!");
    }
}

export function ProcessInlineCode(config : Config) {
    config.inlineSource.forEach((item : InlineSource) => {
        const type = item.assetPath.substring(item.assetPath.lastIndexOf("."));
        type == ".css" || type == ".scss" ? processInlineCSS(config, item) : processInlineJS(config, item);
    })
}

export function InlineSrc() {
    ValidateConfig();
    const config : Config = LoadConfig(FindConfig());
    InitInlineSrc(config);
    ProcessInlineCode(config);
    CleanupInlineSrc(config);
}

InlineSrc();