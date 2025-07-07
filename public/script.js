const cmdInEl = document.querySelector("#cmdin")
const cmdOutEl = document.querySelector("#cmdout")
let cmdOutText = ""
let cmdInText = ""
let pwd = "/"
let canType = true

async function sendCmd(cmd) {
    let res = await fetch("/cmd", {
        method: "POST",
        body: JSON.stringify({
            cmd,
            pwd
        }),
        headers: {
            'Content-Type': 'application/json'
        },
    })
    if (!res.ok) {
        throw new Error("Erreur serveur")
    }
    return await res.json()
}

function getPrompt() {
    return pwd + "> "
}

function setCmdInTxt(txt) {
    cmdInText = txt
    cmdInEl.innerHTML = getPrompt() + cmdInText + '<span id="cursor">_</span>'
}

function setCmdOutTxt(txt) {
    cmdOutText = txt
    cmdOutEl.innerHTML += cmdOutText.toUpperCase() + '\n'
}

async function handlePressEnterKey() {
    // Copy input line to output
    setCmdOutTxt(getPrompt() + cmdInText)
    const tmpCmd = cmdInText

    // Clear input line
    cmdInEl.innerHTML = ""
    canType = false

    // Send command to server and get response data
    let data = await sendCmd(tmpCmd)

    // Set new pwd if needed
    if (data.newPwd) {
        pwd = data.newPwd.toUpperCase()
    }

    setCmdInTxt("")
    canType = true

    // Display output
    if (!!data.output) {
        setCmdOutTxt(data.output)
    }
    window.scrollTo(0, document.body.scrollHeight);
}

window.addEventListener("keydown", async (e) => {
    e.preventDefault()
    if (!canType) {
        return;
    }
    if (e.key === "Backspace") {
        setCmdInTxt(cmdInText.slice(0, -1))
    }
    else if (e.key === "Enter") {
        await handlePressEnterKey()
    }

    if (cmdInText.length >= 70) {
        return;
    }

    let regex = /^[A-Za-z0-9 _./-]$/
    if (!regex.test(e.key)) {
        return;
    }

    if (e.key === ' ' && cmdInText.slice(-1) === ' ') {
        return;
    }

    setCmdInTxt(cmdInText + e.key.toUpperCase())
})

setCmdInTxt("")