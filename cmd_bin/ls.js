import fs from "fs"
import path from "path"

export default function (args, pwd, cmdEnvPath) {
    if (args.length >= 2) {
        return {
            output: "Bad args: ls [path]"
        }
    }
    let truePath = path.join(cmdEnvPath, pwd)
    let list = fs.readdirSync(truePath);

    return {
        output: list.join(" ")
    }
}