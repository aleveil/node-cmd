import path from "path"

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