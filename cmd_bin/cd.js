import fs from "fs";
import { getAbsolutePath, getCmdAbsolutePath } from "../utils.js";

export default function (args, pwd, cmdEnvPath) {
    if (args.length !== 1) {
        return {
            output: "Bad syntax: cd dir"
        };
    }

    const target = args[0];

    const targetPath = getAbsolutePath(target, pwd, cmdEnvPath);

    if (!fs.existsSync(targetPath)) {
        return {
            output: `Error: ${target} does not exist`
        };
    }
    if (!fs.lstatSync(targetPath).isDirectory()) {
        return {
            output: `Error: ${target} is not a directory`
        };
    }
    return {
        newPwd: getCmdAbsolutePath(target, pwd)
    };
}