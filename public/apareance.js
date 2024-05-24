const btnSend = document.getElementById("btnSend");
const chatContainer = document.getElementById("chatContainer");
const btnConnect = document.getElementById("btnConnect");
const iMessage = document.getElementById("message");
const btnDisconnect = document.getElementById("btnDisconnect");
const username = document.getElementById("username");
const disconnectContainer = document.getElementById("disconnectContainer");


function changeMessage(active = true) {
    if (active) {
        chatContainer.classList.remove("hidden");
        disconnectContainer.classList.remove("hidden");
        disconnectContainer.classList.add("flex");
        form.classList.add("hidden");
    } else {
        chatContainer.classList.add("hidden");
        disconnectContainer.classList.add("hidden");
        disconnectContainer.classList.remove("flex");
        form.classList.remove("hidden");
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