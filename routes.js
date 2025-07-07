import express from "express"
import { parseCmd, callCmd, sendError } from "./utils.js"

let router = express.Router()

router.post('/cmd', async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return sendError(res, 400, "body not found")
    }

    if (!req.body.cmd) {
        return res.json({
            output: ""
        })
    }

    if (!req.body.pwd) {
        return sendError(res, 400, "pwd not found in body")
    }

    let regex = /^[A-Z0-9 _./-]+$/
    if (!regex.test(req.body.cmd)) {
        return sendError(res, 400, "unauthorized characters in cmd")
    }

    let [bin, args] = parseCmd(req.body.cmd)

    let { output, newPwd } = await callCmd(bin, args, req.body.pwd)

    res.json({
        status: "ok",
        output,
        ...(!!newPwd && { newPwd })
    })
})

export default router