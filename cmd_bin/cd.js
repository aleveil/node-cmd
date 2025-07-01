import fs from "fs"
import path from "path"

export default function(args, pwd, cmdEnvPath) {
    if (args.length !== 1) {
        return {
            output: "Bad args: cd [path]"
        }
    }
    let target = args[0].toLowerCase()
    // Calculate new pwd path like this to prevent getting out of cmd_env
    let newPwd = path.join(pwd, target)
    let truePath = path.join(cmdEnvPath, newPwd)

    if (!fs.existsSync(truePath)) {
        return {
            output: `Error: ${target} does not exist`
        }
    }
    if (!fs.lstatSync(truePath).isDirectory()) {
        return {
            output: `Error: ${target} is not a directory`
        }
    }
    return {
        newPwd
    }
}