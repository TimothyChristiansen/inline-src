import {Config} from "../inline-src.config/inline-src.config.ts"
import * as fs from "fs"

export function LoadConfig(filePath : string) : Config {
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

export function FindConfig() : string {
    const configFilePathSansExt = "./inline-src.config.";
    const extensions = ["js", "mjs", "ts", "mts", "json"];
    const configFileExtension = extensions.filter(ext => fs.existsSync(`${configFilePathSansExt}${ext}`))[0];
    const configFilePath = `${configFilePathSansExt}${configFileExtension}`;
    if (fs.existsSync(configFilePath)) {
        return configFilePath;
    }
    throw new Error("inline-src: Config file not found.");
}