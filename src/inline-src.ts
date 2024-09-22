import {Config, InlineSource} from "./inline-src.config.ts"
import ValidateConfig from "./ValidateConfig.ts"
import ProcessInlineCSS from "./ProcessInlineCSS.ts"
import ProcessInlineJS from "./ProcessInlineJS.ts"
import * as fs from "fs"

export default function InlineSrc() {
    const config : Config = ValidateConfig();
    if(config.silent !== true && config.silent !== "true") {
        console.log("inline-src: Initializing...");
    }
    if(!fs.existsSync("./inline-src_work")) {
        fs.mkdirSync("./inline-src_work");
    }
    config.inlineSource.forEach((item : InlineSource) => {
        const type = item.assetPath.substring(item.assetPath.lastIndexOf("."));
        type == ".css" || type == ".scss" ? ProcessInlineCSS(config, item) : ProcessInlineJS(config, item);
    })
    fs.rmSync("./inline-src_work", { recursive: true, force: true });
    if(config.silent !== true && config.silent !== "true") {
        console.log("inline-src: Complete!");
    }
}

InlineSrc();