import {Config, InlineSource} from "../inline-src.config/inline-src.config.ts"
import {CompileCSS, MinifyCSS} from "../ProcessInlineCSS/ProcessInlineCSS.ts"
import {CompileJS, MinifyJS} from "../ProcessInlineJS/ProcessInlineJS.ts"
import UpdateInlineCode from "../UpdateInlineCode/UpdateInlineCode.ts"
import * as fs from "fs"

export function InitInlineSrc(config : Config) : void {
    if(config.silent !== true && config.silent !== "true") {
        console.info("inline-src: Initializing...");
    }
    if(!fs.existsSync("./inline-src_work")) {
        fs.mkdirSync("./inline-src_work");
    }
}

export function CleanupInlineSrc(config : Config) : void {
    fs.rmSync("./inline-src_work", { recursive: true, force: true });
    if(config.silent !== true && config.silent !== "true") {
        console.info("inline-src: Complete!");
    }
}

export function ProcessInlineCode(config : Config) : void {
    function processInlineCSS(config : Config, item : InlineSource) : void {
        CompileCSS(config, item)
        MinifyCSS(config, item);
    }
    
    function processInlineJS(config : Config, item : InlineSource) : void {
        CompileJS(config, item);
        MinifyJS(config, item);
    }

    config.inlineSource.forEach((item : InlineSource) => {
        const extension = item.assetPath.substring(item.assetPath.lastIndexOf("."));
        if(extension.match(/\.m?[jt]s/g)) {
            processInlineJS(config, item);
            UpdateInlineCode(config, item, "js");
        }
        if(extension.match(/\.s?css/g)) {
            processInlineCSS(config, item);
            UpdateInlineCode(config, item, "css");
        }
    })
}