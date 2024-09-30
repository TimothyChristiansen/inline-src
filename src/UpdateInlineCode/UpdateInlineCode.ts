import {Config, InlineSource} from "../inline-src.config/inline-src.config.ts"
import * as fs from "fs"

type MinType = "css" | "js";

export default function UpdateInlineCode(config : Config, item : InlineSource, minType : MinType) {

    const minifiedFile = fs.readFileSync(`./inline-src_work/file.min.${minType}`).toString().replaceAll("`", "\\\`");

    const regex = new RegExp(item.pattern,'g');

    const componentCodeMatch = item.componentCode.replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\\\/g, "\\").match(regex);

    if(!componentCodeMatch) {
        throw new Error(`inline-src: The pattern associated with "componentPath" : "${item.componentPath}" does not produce a match for "componentCode" : "${item.componentCode}".`);
    }

    let componentCodeWithNewlines = componentCodeMatch[0].replace('[inline-src_contents]', minifiedFile);

    let inlineFileContents = fs.readFileSync(item.componentPath).toString();

    if(!inlineFileContents.match(regex)) {
        throw new Error(`inline-src: The pattern associated with "componentPath" : "${item.componentPath}" does not produce a match for the actual code found in the file.`);
    }

    inlineFileContents = inlineFileContents.replace(regex, componentCodeWithNewlines);

    if(config.silent !== true && config.silent !== "true") {
        console.info(`inline-src: Placing minified ${item.assetPath} into ${item.componentPath} at specified pattern...`);
    }
    fs.writeFileSync(item.componentPath,inlineFileContents);
}