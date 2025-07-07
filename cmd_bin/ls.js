import fs from "fs"
import path from "path"

export default function (args, pwd, cmdEnvPath) {
    if (args.length >= 2) {
        return {
            output: "Bad args: ls [path]"
        }
    }

    let isAbsolute = false
    let target = "."
    if (!!args[0]) {
        target = args[0].toLowerCase()
        isAbsolute = target.charAt(0) === "/"
    } 

    // Calculate new pwd path like this to prevent getting out of cmd_env
    let targetPath = isAbsolute ? path.join(target.charAt(0), target.slice(1)) : path.join(pwd, target)
    let truePath = path.join(cmdEnvPath, targetPath)

    if (!fs.existsSync(truePath)) {
        return {
            output: `Error: ${args[0]} does not exist`
        }
    }
    if (!fs.lstatSync(truePath).isDirectory()) {
        return {
            output: `Error: ${args[0]} is not a directory`
        }
    }

    let list = fs.readdirSync(truePath);

    return {
        output: list.join(" ")
    }
}