import {Config, InlineSource} from "../inline-src.config/inline-src.config.ts"
import * as fs from "fs"
import {CleanupInlineSrc} from "../inline-src/inline-src.ts"

type MinType = "css" | "js";

export default function UpdateInlineCode(config : Config, item : InlineSource, minType : MinType) {

    const minifiedFile = fs.readFileSync(`./inline-src_work/file.min.${minType}`).toString().replaceAll("`", "\\\`");

    const regex = new RegExp(item.pattern,'g');

    const componentCodeMatch = item.componentCode.replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\\\/g, "\\").match(regex);

    if(!componentCodeMatch) {
        CleanupInlineSrc();
        throw new Error(`inline-src: The pattern associated with "componentPath" : "${item.componentPath}" does not produce a match for "componentCode" : "${item.componentCode}".`);
    }

    let componentCodeWithNewlines = componentCodeMatch[0].replace('[inline-src_contents]', minifiedFile);

    let inlineFileContents = fs.readFileSync(item.componentPath).toString();

    if(!inlineFileContents.match(regex)) {
        CleanupInlineSrc();
        throw new Error(`inline-src: "pattern" : ${JSON.stringify(item.pattern)} and "componentCode" : ${JSON.stringify(item.componentCode)} values do not produce a match for the actual content found in "componentPath" : ${JSON.stringify(item.componentPath)}.`);
    }

    inlineFileContents = inlineFileContents.replace(regex, componentCodeWithNewlines);

    if(config.silent !== true && config.silent !== "true") {
        console.info(`inline-src: Placing minified ${item.assetPath} into ${item.componentPath} at specified pattern...`);
    }
    fs.writeFileSync(item.componentPath,inlineFileContents);
}