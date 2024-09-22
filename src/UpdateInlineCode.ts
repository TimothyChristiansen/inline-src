import {Config, InlineSource} from "./inline-src.config.ts"
import * as fs from "fs"

export default function UpdateInlineCode(config : Config, minifiedFile : string, item : InlineSource) {
    const regex = new RegExp(item.pattern,'g');
    let componentCodeWithNewlines = item.componentCode.replace(/\\n/g,"\n").replace('[inlinesrc_contents]', minifiedFile);
    let inlineFileContents = fs.readFileSync(item.componentPath).toString().replace(regex, componentCodeWithNewlines);
    if(config.silent !== true && config.silent !== "true") {
        console.log(`inline-src: Placing minified ${item.assetPath} into ${item.componentPath} at specified pattern...`);
    }
    fs.writeFileSync(item.componentPath,inlineFileContents);
}