import {Config, InlineSource} from "../inline-src.config/inline-src.config.ts"
import {execSync} from "child_process"
import * as fs from "fs"
import UpdateInlineCode from "../UpdateInlineCode/UpdateInlineCode.ts"


export function CompileJS(config : Config, item : InlineSource) : void {
    if(config.silent !== true && config.silent !== "true") {
        console.log(`inline-src: Compiling ${item.assetPath} via swc...`)
    }
    execSync(`npx swc ${item.assetPath} -o ./inline-src_work/file.js --config-file ${config.swcrcPath}`, { stdio: "inherit" });
    if(config.silent !== true && config.silent !== "true") {
        console.log(`inline-src: Minifying working JS file with uglify-js...`)
    }
}

function getUglifyConfig(config : Config, item : InlineSource) : string {
    let uglifyConfig = '--compress templates=false';
    if(item.uglifyConfig) {
        uglifyConfig = `--config ${item.uglifyConfig}`;
    } else if (config.uglifyConfig) {
        uglifyConfig = `--config ${config.uglifyConfig}`;
    }
    return uglifyConfig;
}

export function MinifyJS(config : Config, item : InlineSource) {
    const uglifyConfig : string = getUglifyConfig(config, item);
    execSync(`npx uglify-js ./inline-src_work/file.js -o ./inline-src_work/file.min.js ${uglifyConfig}`, { stdio: "inherit" });
    const JSMin = fs.readFileSync("./inline-src_work/file.min.js").toString().replaceAll("`", "\\\`");
    UpdateInlineCode(config, JSMin, item);
}