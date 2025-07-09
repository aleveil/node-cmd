import fs from "fs"
import { getAbsolutePath, getCmdAbsolutePath } from "./utils/path.js";

export default function (args, pwd, cmdEnvPath) {
    if (args.length !== 1) {
        return {
            output: "Bad args: cat file"
        }
    }

    const target = args[0];

    
    const targetPath = getAbsolutePath(target, pwd, cmdEnvPath);

    if (!fs.existsSync(targetPath)) {
        return {
            output: `Error: ${target} does not exist`
        }
    }
    if (!fs.lstatSync(targetPath).isFile()) {
        return {
            output: `Error: ${target} is not a file`
        }
    }

    const data = fs.readFileSync(targetPath, 'utf-8')

    return {
        output: data
    }
}