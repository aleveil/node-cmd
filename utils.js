import fs from 'fs';
import path from 'path';

export function parseCmd(cmd) {
    let [bin, ...args] = cmd.split(" ").map((str) => str.toLowerCase());
    return [bin, args];
}

export async function callCmd(bin, args, pwd) {
    pwd = pwd.toLowerCase();

    const cmdEnvPath = path.join(global.dirname, "cmd_env");
    const cmdBinPath = path.join(global.dirname, "cmd_bin");

    const binFile = bin + ".js";
    const binFilePath = path.join(cmdBinPath, binFile);

    if (!fs.existsSync(binFilePath) || fs.lstatSync(binFilePath).isDirectory()) {
        return {
            output: `Error: ${bin} does not exist. type help to display available commands`
        };
    }

    const { default: run } = await import(binFilePath);

    return run(args, pwd, cmdEnvPath);
}

export function sendCmdError(res, code, output) {
    console.error(output);
    return res.status(code).json({
        output: "Error: " + output
    });
}

export function sendMediaError(res, code, message) {
    console.error(message);
    return res.status(code).json({
        message
    });
}

export function getCmdAbsolutePath(target, pwd) {
    target = target.toLowerCase();
    const isAbsolute = target.charAt(0) === "/";

    let targetPath = isAbsolute ? path.join(target.charAt(0), target.slice(1)) : path.join(pwd, target);

    return targetPath;
}

export function getAbsolutePath(target, pwd, cmdEnvPath) {
    const targetPath = getCmdAbsolutePath(target, pwd);

    return path.join(cmdEnvPath, targetPath);
}