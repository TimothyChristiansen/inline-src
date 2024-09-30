import {Config, InlineSource} from "../inline-src.config/inline-src.config.ts"
import * as fs from "fs"
import {execSync} from "child_process"
import UpdateInlineCode from "../UpdateInlineCode/UpdateInlineCode.ts"

export default function ProcessInlineCSS(config : Config, item : InlineSource) {
    if(item.assetPath && item.assetPath.indexOf(".scss") !== -1) {
        if(config.silent !== true && config.silent !== "true") {
            console.log(`inline-src: ${item.assetPath} - Compiling SASS...`);
        }
        execSync(`npx sass ${item.assetPath} ./inline-src_work/file.css`, { stdio : "inherit"});
    } else {
        fs.writeFileSync("./inline-src_work/file.css",fs.readFileSync(item.assetPath));
    }
    if(config.silent !== true && config.silent !== "true") {
        console.log("inline-src: Minifying working CSS file with minify-css...");
    }
    execSync('npx css-minify -f ./inline-src_work/file.css -o ./inline-src_work', { stdio: "inherit" });
    const CSSMin = fs.readFileSync("./inline-src_work/file.min.css").toString();
    UpdateInlineCode(config, CSSMin, item);
}
