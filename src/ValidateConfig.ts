import {Config, InlineSource} from "./inline-src.config.ts"
import * as fs from "fs"

function validateInlineSourceKeys(config : Config, item : InlineSource, index : number) {
    const keys = ["assetPath", "componentPath", "pattern", "componentCode"];
    keys.forEach(key => {
        const Key = item[key as keyof InlineSource];
        if(Key === undefined) {
            throw new Error(`inline-src: Invalid config - Missing key "${key}" at config index ${index}.`);
        }
        switch(key) {
            case "assetPath":
                if(!fs.existsSync(item[key])) {
                    throw new Error(`inline-src: Invalid config - File "${item[key]}" for "${key}" at config index ${index} does not exist.`);
                }
                const type = item.assetPath.substring(item.assetPath.lastIndexOf("."));
                const validTypes = [".css", ".scss", ".js", ".mjs", ".ts", ".mts"];
                if(!validTypes.includes(type)) {
                    throw new Error(`inline-src: File "${item[key]}" at config index ${index} is not a valid compilable file type (.css, .scss, .js, .mjs, .ts, or .mts).`)
                }
                const jsTypes = [".js", ".mjs", ".ts", ".mts"];
                if(jsTypes.includes(type) && typeof config.swcrcPath === "undefined") {
                    throw new Error(`inline-src: File "${item[key]}" at config index ${index} is a TypeScript file, but "swcrcPath" was undefined.`);
                }
                if(jsTypes.includes(type) && !fs.existsSync(config.swcrcPath)) {
                    throw new Error(`inline-src: File "${item[key]}" at config index ${index} is a TypeScript file, but path to .swcrc file from config was unresolved.`);
                }
                break;
            case "componentPath":
                if(!fs.existsSync(item[key])) {
                    throw new Error(`inline-src: Invalid config - File "${item[key]}" for "${key}" at config index ${index} does not exist.`);
                }
                break;
            case "pattern":
                let validRegex = true;
                try {
                    new RegExp(item.pattern);
                } catch(e) {
                    validRegex = false;
                }
                if(!validRegex) {
                    throw new Error(`inline-src: Invalid config - Expression "${item[key]}" for "${key}" at config index ${index} is not a valid regular expression.`);
                }
                break;
            case "componentCode":
                if(typeof item[key] !== "string") {
                    throw new Error(`inline-src: Invalid config - Invalid object found for "${key}" at config index ${index}.`);
                }
                if(item[key].indexOf("[inline-src_contents]") === -1) {
                    throw new Error(`inline-src: Invalid config - [inline-src_contents] token not found for "${key}" at config index ${index}.`);
                }
                break;
            default:
                throw new Error(`inline-src: Library source code error - invalid key "${key}" added.`)
        }
        return true;
    })
}

export function loadConfig(filePath : string) {
    const configContents = fs.readFileSync(filePath).toString();
    try {
        let stringified = configContents.toString().split(/module.exports\s*?=\s*?\s*?|[cC]onfig\s*?=\s*?/)[1];
        if(!stringified) {
            stringified = configContents;
        }
        stringified = stringified.replaceAll(/(?<!\\)\\n|(?<!\\)\\r/g, "").replace(/(\w+)\s*?:/g,'"$1":');
        const config = JSON.parse(stringified);
        return config;
    } catch (e) {
        console.error(`inline-src: Invalid config file at ${filePath}. Please check for JSON syntax and string sequence errors.`);
        throw e;
    }
}

export function findConfig() {
    const configFilePathSansExt = "./inline-src.config.";
    const extensions = ["js", "mjs", "ts", "mts", "json"];
    const configFileExtension = extensions.filter(ext => fs.existsSync(`${configFilePathSansExt}${ext}`))[0];
    const configFilePath = `${configFilePathSansExt}${configFileExtension}`;
    if (fs.existsSync(configFilePath)) {
        return configFilePath;
    }
    throw new Error("inline-src: Config file not found.");
}

export function ValidateConfig() {
    const configFilePath = findConfig();
    const config = loadConfig(configFilePath);
    if (typeof config.inlineSource === "undefined") {
        throw new Error("inline-src: Config object for inlineSource is undefined.");
    }
    if(!Array.isArray(config.inlineSource) ) {
        throw new Error("inline-src: Config object for inlineSource is not an Array.")
    }
    if(!config.inlineSource.length) {
        throw new Error("inline-src: Config object for inlineSource has 0 length.");
    }
    config.inlineSource.forEach((item : InlineSource, index : number) => {
        validateInlineSourceKeys(config, item, index);
        if(item.uglifyConfig) {
            if(!fs.existsSync(item.uglifyConfig)) {
                throw new Error(`inline-src: uglify-js config provided for config item ${index}, but file ${item.uglifyConfig} was not found.`)
            }
        }
    });
    if(config.uglifyConfig) {
        if(!fs.existsSync(config.uglifyConfig)) {
            throw new Error(`inline-src: uglify-js config provided for default configuration, but file ${config.uglifyConfig} was not found.`)
        }
    }
    return config;
}




