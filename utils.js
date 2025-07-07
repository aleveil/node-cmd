import fs from 'fs';
import path from 'path';

export function parseCmd(cmd) {
    let [bin, ...args] = cmd.split(" ").map((str) => str.toLowerCase());
    return [bin, args];
}

export async function callCmd(bin, args, pwd) {
    pwd = pwd.toLowerCase()

    const cmdEnvPath = path.join(global.dirname, "cmd_env")
    const cmdBinPath = path.join(global.dirname, "cmd_bin")

    const binFile = bin + ".js"
    const binFilePath = path.join(cmdBinPath, binFile);

    if (!fs.existsSync(binFilePath) || fs.lstatSync(binFilePath).isDirectory()) {
        return {
            output: `Error: ${bin} does not exist. type help to display available commands`
        }
    }

    const { default: run } = await import(binFilePath);

    return run(args, pwd, cmdEnvPath);
}

export function sendError(res, code, output) {
    console.error(output)
    return res.status(code).json({
        status: "error",
        output: "Error: " + output
    })
}