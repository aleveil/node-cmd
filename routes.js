import express from "express";
import { parseCmd, callCmd, sendCmdError, sendMediaError, getAbsolutePath } from "./utils.js";
import path from "path";
import fs from "fs";

let router = express.Router();

router.post('/cmd', async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return sendCmdError(res, 400, "body not found");
    }

    if (!req.body.cmd) {
        return res.json({
            output: ""
        });
    }

    if (!req.body.pwd) {
        return sendCmdError(res, 400, "pwd not found in body");
    }

    let regex = /^[A-Z0-9 _./-]+$/;
    if (!regex.test(req.body.cmd)) {
        return sendCmdError(res, 400, "unauthorized characters in cmd");
    }

    let [bin, args] = parseCmd(req.body.cmd);

    let binResponse = await callCmd(bin, args, req.body.pwd);

    res.json(binResponse);
});

router.get('/media', async (req, res) => {
    if (!req.query.type || !req.query.file) {
        return sendMediaError(res, 400, "Invalid query");
    }

    const { type, file } = req.query;

    const validTypes = ["audio", "image"];

    if (!validTypes.includes(type)) {
        return sendMediaError(res, 400, "Invalid type");
    }

    const cmdEnvPath = path.join(global.dirname, "cmd_env");
    const filePath = getAbsolutePath(file, "/", cmdEnvPath);

    if (!fs.existsSync(filePath)) {
        return sendMediaError(res, 400, "File not found");
    }

    res.sendFile(filePath);
});

export default router;