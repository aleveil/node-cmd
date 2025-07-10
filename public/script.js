const cmdInEl = document.querySelector("#cmdin");
const cmdOutEl = document.querySelector("#cmdout");
let cmdOutText = "";
let cmdInText = "";
let pwd = "/";
let canType = true;
let history = [];
let historyPos = -1;

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
    });
    if (!res.ok) {
        throw new Error("Erreur serveur");
    }
    return await res.json();
}

function getPrompt() {
    return pwd + "> ";
}

function setCmdInTxt(txt) {
    cmdInText = txt;
    cmdInEl.innerHTML = getPrompt() + cmdInText + '<span id="cursor">_</span>';
}

function setCmdOutTxt(txt) {
    cmdOutText = txt;
    cmdOutEl.innerHTML += cmdOutText.toUpperCase() + '\n';
}

async function handlePressEnterKey() {
    // Copy input line to output
    setCmdOutTxt(getPrompt() + cmdInText);
    const tmpCmd = cmdInText;

    // Clear input line
    cmdInEl.innerHTML = "";
    canType = false;

    // Send command to server and get response data
    let data = await sendCmd(tmpCmd);
    if (tmpCmd !== "") {
        history.unshift(tmpCmd);
        historyPos = -1;
    }

    // Set new pwd if needed
    if (!!data.newPwd) {
        pwd = data.newPwd.toUpperCase();
    }

    // Display output
    if (!!data.output) {
        setCmdOutTxt(data.output);
    }
    window.scrollTo(0, document.body.scrollHeight);

    // Open popup media
    if (!!data?.media?.type && !!data?.media?.file) {
        const { type, file } = data.media;
        const url = `/media?type=${type}&file=${encodeURIComponent(file)}`;
        window.open(`/popup/${type}.html?src=${encodeURIComponent(url)}`, '_blank', 'popup=true,width=400,height=350');
    }

    // Clear input
    setCmdInTxt("");
    canType = true;

}

//CODER LA RECEPTION DU LIEN MEDIA + OUVERURE POP UP

window.addEventListener("keydown", async (e) => {
    e.preventDefault();
    if (!canType) {
        return;
    }
    if (e.key === "ArrowUp") {
        if (historyPos >= history.length - 1) {
            return;
        }
        historyPos++;
        setCmdInTxt(history[historyPos]);

    }
    if (e.key === "ArrowDown") {
        if (historyPos <= -1) {
            return;
        }

        historyPos--;
        
        if (historyPos === -1) {
            setCmdInTxt("");
        }
        else {
            setCmdInTxt(history[historyPos]);
        }
    }
    if (e.key === "Backspace") {
        setCmdInTxt(cmdInText.slice(0, -1))
    }
    else if (e.key === "Enter") {
        await handlePressEnterKey();
    }

    if (cmdInText.length >= 70) {
        return;
    }

    let regex = /^[A-Za-z0-9 _./-]$/;
    if (!regex.test(e.key)) {
        return;
    }

    if (e.key === ' ' && cmdInText.slice(-1) === ' ') {
        return;
    }

    setCmdInTxt(cmdInText + e.key.toUpperCase());
})

setCmdInTxt("");