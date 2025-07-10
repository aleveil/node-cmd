import { getAbsolutePath, getCmdAbsolutePath } from "../utils.js";
import path from "path";
import fs from "fs";

export default function (args, pwd, cmdEnvPath) {
    if (args.length !== 1) {
        return {
            output: "Bad syntax: play file"
        };
    }

    const target = args[0];

    const targetPath = getAbsolutePath(target, pwd, cmdEnvPath);

    if (!fs.existsSync(targetPath)) {
        return {
            output: `Error: ${target} does not exist`
        };
    }
    if (!fs.lstatSync(targetPath).isFile()) {
        return {
            output: `Error: ${target} is not a file`
        };
    }

    const validExt = [".mp3", ".wav", ".ogg", ".flac"];
    if (!validExt.includes(path.extname(targetPath))) {
        return {
            output: `Error: ${target} is not a valid audio file`
        };
    }

    return {
        output: `opening audio player : ${path.basename(target)}`,
        media: {
            type: "audio",
            file: getCmdAbsolutePath(target, pwd)
        }
    };
}