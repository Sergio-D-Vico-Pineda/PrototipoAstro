const btnSend = document.getElementById("btnSend");

const chatContainer = document.getElementById("chatContainer");
const resultContainer = document.getElementById("resultContainer");
const hr = document.querySelector("hr");

const btnConnect = document.getElementById("btnConnect");
const iMessage = document.getElementById("message");
const btnDisconnect = document.getElementById("btnDisconnect");
const username = document.getElementById("username");

const disconnectContainer = document.getElementById("disconnectContainer");
const clientUserDisc = document.getElementById("disconnectContainer").querySelector("span");

const header = document.getElementById("header");
const h1header = document.getElementById("header").querySelector("h1");
const logo = document.getElementById("logo");

function fromLoginToChat(active = true, user) {
    if (active) {
        header.classList.remove("flex-col");
        h1header.classList.remove("text-center");
        h1header.classList.remove("text-4xl");
        h1header.classList.add("text-3xl");
        logo.classList.remove("max-w-96");
        logo.classList.add("max-w-20");
        clientUserDisc.innerText = user;
    } else {
        header.classList.add("flex-col");
        h1header.classList.add("text-center");
        h1header.classList.add("text-4xl");
        h1header.classList.remove("text-3xl");
        logo.classList.add("max-w-96");
        logo.classList.remove("max-w-20");
    }
}

function changeMessage(active = true, user) {
    if (active) {
        chatContainer.classList.remove("hidden");
        resultContainer.classList.remove("hidden");
        hr.classList.remove("hidden");
        disconnectContainer.classList.remove("hidden");
        disconnectContainer.classList.add("flex");
        form.classList.add("hidden");
    } else {
        chatContainer.classList.add("hidden");
        resultContainer.classList.add("hidden");
        hr.classList.add("hidden");
        disconnectContainer.classList.add("hidden");
        disconnectContainer.classList.remove("flex");
        form.classList.remove("hidden");
    }
    fromLoginToChat(active, user);
}

function btnState() {
    btnSend.disabled = !iMessage.value;
}
function removeForgetPassword() {
    forgetPassword.classList.add("hidden");
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
    loading,
    removeForgetPassword
}