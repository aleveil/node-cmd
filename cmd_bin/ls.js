import fs from "fs"
import path from "path"

export default function(args, pwd, cmdEnvPath) {
    let truePath = path.join(cmdEnvPath, pwd)
    console.log(truePath)
    let list = fs.readdirSync(truePath);

    return {
        output: list.join(" ")
    }
}