const btnSend = document.getElementById("btnSend");
const chatContainer = document.getElementById("chatContainer");
const btnConnect = document.getElementById("btnConnect");
const iMessage = document.getElementById("message");
const btnDisconnect = document.getElementById("btnDisconnect");
const username = document.getElementById("username");


function changeMessage(active = true) {
    if (active) {
        chatContainer.classList.remove("hidden");
        chatContainer.classList.add("block");
    } else {
        chatContainer.classList.add("hidden");
        chatContainer.classList.remove("block");
    }
}

function btnState() {
    btnSend.disabled = !iMessage.value;
}

function loading(active = true) {
    username.disabled = active;
    btnConnect.disabled = active;
    btnDisconnect.disabled = !active;
    if (active) {
        btnConnect.classList.add("hidden");
        btnDisconnect.classList.remove("hidden");
    } else if (!active) {
        btnConnect.classList.remove("hidden");
        btnDisconnect.classList.add("hidden");
    }
}


export {
    changeMessage,
    btnState,
    loading
}