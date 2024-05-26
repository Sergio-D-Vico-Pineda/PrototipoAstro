const btnSend = document.getElementById("btnSend");
const chatContainer = document.getElementById("chatContainer");
const btnConnect = document.getElementById("btnConnect");
const iMessage = document.getElementById("message");
const btnDisconnect = document.getElementById("btnDisconnect");
const username = document.getElementById("username");
const disconnectContainer = document.getElementById("disconnectContainer");
const header = document.getElementById("header");
const h1header = document.getElementById("header").querySelector("h1");
const logo = document.getElementById("logo");

function fromLoginToChat() {
    header.classList.toggle("flex-col");
    h1header.classList.toggle("text-center");
    h1header.classList.toggle("text-3xl");
    h1header.classList.toggle("text-xl");
    logo.classList.toggle("max-w-96");
    logo.classList.toggle("max-w-14");
}

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
    fromLoginToChat();
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