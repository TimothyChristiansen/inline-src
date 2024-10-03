import {Config, InlineSource} from "../inline-src.config/inline-src.config.ts"
import * as fs from "fs"
import {execSync} from "child_process"

export function CompileCSS(config : Config, item : InlineSource) : void {
    if(item.assetPath && item.assetPath.indexOf(".scss") !== -1) {
        if(config.silent !== true && config.silent !== "true") {
            console.info(`inline-src: ${item.assetPath} - Compiling SASS...`);
        }
        execSync(`npx sass ${item.assetPath} ./inline-src_work/file.css`, { stdio : "inherit"});
    } else {
        fs.writeFileSync("./inline-src_work/file.css",fs.readFileSync(item.assetPath));
    }
}

export function MinifyCSS(config : Config, item : InlineSource) {
    if(config.silent !== true && config.silent !== "true") {
        console.info("inline-src: Minifying working CSS file with minify-css...");
    }
    execSync('npx css-minify -f ./inline-src_work/file.css -o ./inline-src_work', { stdio: "inherit" });
    const CSSMin = fs.readFileSync("./inline-src_work/file.min.css").toString();
}