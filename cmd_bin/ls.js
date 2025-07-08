import fs from "fs"
import { getAbsolutePath } from "./utils/path.js"

export default function (args, pwd, cmdEnvPath) {
    if (args.length >= 2) {
        return {
            output: "Bad args: ls [path]"
        }
    }

    const target = args.length === 1 ? args[0] : ".";

    const targetPath = getAbsolutePath(target, pwd, cmdEnvPath );

    if (!fs.existsSync(targetPath)) {
        return {
            output: `Error: ${target} does not exist`
        }
    }
    if (!fs.lstatSync(targetPath).isDirectory()) {
        return {
            output: `Error: ${target} is not a directory`
        }
    }

    let list = fs.readdirSync(targetPath);

    return {
        output: list.join(" ")
    }
}