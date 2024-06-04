const btnSend = document.getElementById("btnSend");

const chatContainer = document.getElementById("chatContainer");

const chatsContainer = document.getElementById("chatsContainer");
const resultContainer = document.getElementById("resultContainer");
const hr = document.querySelector("hr");

const btnConnect = document.getElementById("btnConnect");
const iMessage = document.getElementById("message");
const btnDisconnect = document.getElementById("btnDisconnect");
const iEmail = document.getElementById("email");

const disconnectContainer = document.getElementById("disconnectContainer");
const clientUserDisc = document.getElementById("disconnectContainer").querySelector("span");

const header = document.getElementById("header");
const h1header = document.getElementById("header").querySelector("h1");
const logo = document.getElementById("logo");

const chatContainerMedico = document.getElementById("chatContainerMedico");
const resultContainerMedico = document.getElementById("resultContainerMedico");

function fromLoginToChat(active, user) {
    if (active) {
        header.classList.remove("flex-col");
        h1header.classList.remove("text-center");
        h1header.classList.remove("text-4xl");
        h1header.classList.add("text-3xl");
        logo.classList.remove("max-w-96");
        logo.classList.add("max-w-20");
        clientUserDisc.innerText = user;
        form.classList.add("hidden");
        disconnectContainer.classList.remove("hidden");
        disconnectContainer.classList.add("flex");
    } else {
        header.classList.add("flex-col");
        h1header.classList.add("text-center");
        h1header.classList.add("text-4xl");
        h1header.classList.remove("text-3xl");
        clientUserDisc.innerText = 'User';
        logo.classList.add("max-w-96");
        logo.classList.remove("max-w-20");
        form.classList.remove("hidden");
        disconnectContainer.classList.add("hidden");
        disconnectContainer.classList.remove("flex");
    }
}

function changeMessage(active = true, user, isMedico) {
    console.log(isMedico)

    if (active && isMedico == false) {
        console.log('NO ES MEDICO ACTIVO')
        chatsContainer.classList.remove("hidden");
        resultContainer.classList.remove("hidden");
        hr.classList.remove("hidden");

    } else if (isMedico == false) {
        console.log('NO ES MEDICO INACTIVO')
        chatsContainer.classList.add("hidden");
        resultContainer.classList.add("hidden");
        hr.classList.add("hidden");
    }

    if (active && isMedico == true) {
        console.log('ES MEDICO ACTIVO')
        chatContainerMedico.classList.remove("hidden");
        resultContainerMedico.classList.remove("hidden");
        hr.classList.remove("hidden");
    } else if (isMedico == true) {
        console.log('ES MEDICO INACTIVO')
        chatContainerMedico.classList.add("hidden");
        resultContainerMedico.classList.add("hidden");
        hr.classList.add("hidden");
    }

    if (isMedico == undefined) {
        console.log('INACTIVO todo')
        chatContainerMedico.classList.add("hidden");
        resultContainerMedico.classList.add("hidden");
        hr.classList.add("hidden");
        //---//
        chatsContainer.classList.add("hidden");
        chatContainer.classList.add("hidden");
        resultContainer.classList.add("hidden");
        hr.classList.add("hidden");
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
    iEmail.disabled = active;
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