let cmdOutText = ""
let cmdInText = ""

async function sendCmd() {
    console.log("sendCmd")
    return await fetch("/cmd", {
        method: "POST",
        body: JSON.stringify({
            cmd: cmdInText
        }),
        headers: {
            'Content-Type': 'application/json'
        },
    })
}

function setCmdInTxt(txt) {
    cmdInText = txt
    document.querySelector("#cmdin").innerHTML = "> " + cmdInText + '<span id="cursor">_</span>'
}

function setCmdOutTxt(txt) {
    cmdOutText = txt
    document.querySelector("#cmdin").innerHTML = cmdOutText + '\n'
}

window.addEventListener("keydown", async (e) => {
    let authorizedKeys = "abcdefghijklmnopqrstuvwxyz0123456789 -_"
    if (authorizedKeys.includes(e.key) && cmdInText.length < 70) {
        if (e.key === ' ' && cmdInText.slice(-1) === ' ') { // anti multiple space
            return;
        }
        setCmdInTxt(cmdInText + e.key.toUpperCase())
    }
    if (e.key === "Backspace") {
        e.preventDefault()
        setCmdInTxt(cmdInText.slice(0, -1))
    }
    if (e.key === "Enter") {
        let res = await sendCmd()
        setCmdOutTxt("RES")
        setCmdInTxt("")
        window.scrollTo(0, document.body.scrollHeight);
    }
})

setCmdInTxt("")