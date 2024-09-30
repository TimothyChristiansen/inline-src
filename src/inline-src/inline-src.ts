import {Config, InlineSource} from "../inline-src.config/inline-src.config.ts"
import {FindConfig, LoadConfig} from "../ConfigUtils/ConfigUtils.ts"
import {ValidateConfig} from "../ValidateConfig/ValidateConfig.ts"
import ProcessInlineCSS from "../ProcessInlineCSS/ProcessInlineCSS.ts"
import ProcessInlineJS from "../ProcessInlineJS/ProcessInlineJS.ts"
import * as fs from "fs"

export default function InlineSrc() {
    ValidateConfig();
    const config : Config = LoadConfig(FindConfig());
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