import {Config, InlineSource} from "../inline-src.config/inline-src.config.ts"
import {FindConfig, LoadConfig} from "../ConfigUtils/ConfigUtils.ts"
import * as fs from "fs"

function validateAssetPath(config : Config, item : InlineSource, index : number) : void {
    if(!fs.existsSync(item.assetPath)) {
        throw new Error(`inline-src: Invalid config - File "${item.assetPath}" for "assetPath" at config index ${index} does not exist.`);
    }
    const type = item.assetPath.substring(item.assetPath.lastIndexOf("."));
    const validTypes = [".css", ".scss", ".js", ".mjs", ".ts", ".mts"];
    if(!validTypes.includes(type)) {
        throw new Error(`inline-src: File "${item.assetPath}" at config index ${index} is not a valid compilable file type (.css, .scss, .js, .mjs, .ts, or .mts).`)
    }
    const jsTypes = [".js", ".mjs", ".ts", ".mts"];
    if(jsTypes.includes(type) && typeof config.swcrcPath === "undefined") {
        throw new Error(`inline-src: File "${item.assetPath}" at config index ${index} is a TypeScript file, but "swcrcPath" was undefined.`);
    }
    if(jsTypes.includes(type) && !fs.existsSync(config.swcrcPath)) {
        throw new Error(`inline-src: File "${item.assetPath}" at config index ${index} is a TypeScript file, but path to .swcrc file from config was unresolved.`);
    }
}

function validateComponentPath(item : InlineSource, index : number) : void {
    if(!fs.existsSync(item.componentPath)) {
        throw new Error(`inline-src: Invalid config - File "${item.componentPath}" for "componentPath" at config index ${index} does not exist.`);
    }
}

function validatePattern(item : InlineSource, index : number) : void {
    let validRegex = true;
    try {
        new RegExp(item.pattern);
    } catch(e) {
        validRegex = false;
    }
    if(!validRegex) {
        throw new Error(`inline-src: Invalid config - Expression "${item.pattern}" for "pattern" at config index ${index} is not a valid regular expression.`);
    }
}

function validateComponentCode(item : InlineSource, index : number) : void {
    if(typeof item.componentCode !== "string") {
        throw new Error(`inline-src: Invalid config - Invalid object found for "componentCode" at config index ${index}. Expected string but received ${item.componentCode}.`);
    }
    if(item.componentCode.indexOf("[inline-src_contents]") === -1) {
        throw new Error(`inline-src: Invalid config - [inline-src_contents] token not found for "componentCode" at config index ${index}.`);
    }
}

function validateInlineSourceKeys(config : Config, item : InlineSource, index : number) : void {
    const keys = ["assetPath", "componentPath", "pattern", "componentCode"];
    keys.forEach(key => {
        const Key = item[key as keyof InlineSource];
        if(Key === undefined) {
            throw new Error(`inline-src: Invalid config - Missing key "${key}" at config index ${index}.`);
        }
    });
}

function validateUglifyConfigPerItem(item : InlineSource, index : number) : void {
    if(item.uglifyConfig && !fs.existsSync(item.uglifyConfig)) {
        throw new Error(`inline-src: uglify-js config provided at inlineSource index ${index}, but file ${item.uglifyConfig} was not found.`)
    }
}

function validateUglifyConfigDefault(config : Config) : void {
    if(config.uglifyConfig && !fs.existsSync(config.uglifyConfig)) {
        throw new Error(`inline-src: uglify-js config provided for default configuration, but file "${config.uglifyConfig}" was not found.`)
    }
}

function validateInlineSource(config : Config) : void {
    if (typeof config.inlineSource === "undefined") {
        throw new Error("inline-src: Config object for inlineSource is undefined.");
    }
    if(!Array.isArray(config.inlineSource)) {
        throw new Error("inline-src: Config object for inlineSource is not an Array.")
    }
    if(!config.inlineSource.length) {
        throw new Error("inline-src: Config object for inlineSource has 0 length.");
    }
}

export function ValidateConfig() : void {
    const configFilePath = FindConfig();
    const config = LoadConfig(configFilePath);
    validateInlineSource(config);
    config.inlineSource.forEach((item : InlineSource, index : number) => {
        validateInlineSourceKeys(config, item, index);
        validateAssetPath(config, item, index);
        validateComponentPath(item, index);
        validatePattern(item, index);
        validateComponentCode(item, index);
        validateUglifyConfigPerItem(item, index);
        
    });
    validateUglifyConfigDefault(config);
}




