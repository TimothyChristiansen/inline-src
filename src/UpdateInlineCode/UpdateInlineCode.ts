import {Config, InlineSource} from "../inline-src.config/inline-src.config.ts"
import * as fs from "fs"

type MinType = "css" | "js";

function tokenReplace(componentPathCode : string, componentCode : string, minifiedFile : string) {

    const token = "[inline-src_contents]";

    const replacer = componentCode.replace(token, minifiedFile);

    const regex = new RegExp(componentCode.replace(token,".*?").replace(/\s{2,}/g,"\\s*"));

    const modified = componentPathCode.replace(regex,replacer);

    return modified;

}

export default function UpdateInlineCode(config : Config, item : InlineSource, minType : MinType) {

    const minifiedFile = fs.readFileSync(`./inline-src_work/file.min.${minType}`).toString().replaceAll("`", "\\\`");

    let componentPathCode = fs.readFileSync(item.componentPath).toString();

    componentPathCode = tokenReplace(componentPathCode, item.componentCode, minifiedFile);

    if(config.silent !== true && config.silent !== "true") {
        console.info(`inline-src: Placing minified ${item.assetPath} into ${item.componentPath} at specified position...`);
    }
    fs.writeFileSync(item.componentPath,componentPathCode);
} 