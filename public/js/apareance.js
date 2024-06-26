const chatsContainer = document.getElementById("chatsContainer");
const chatContainer = document.getElementById("chatContainer");
const resultContainer = document.getElementById("resultContainer");

const hr = document.querySelector("hr");

const chatsContainerMedic = document.getElementById("chatsContainerMedic");
const chatContainerMedic = document.getElementById("chatContainerMedic");
const resultContainerMedico = document.getElementById("resultContainerMedico");

const form = document.getElementById("form");
const iEmail = document.getElementById("email");
const btnConnect = document.getElementById("btnConnect");
const btnDisconnect = document.getElementById("btnDisconnect");
const disconnectContainer = document.getElementById("disconnectContainer");
const clientUserDisc = document.getElementById("disconnectContainer").querySelector("span");

const iMensaje = document.getElementById("message");
const iMensajeMedic = document.getElementById("messageMedic");
const btnSend = document.getElementById("btnSend");
const btnSendMedic = document.getElementById("btnSendMedic");

const header = document.getElementById("header");
const h1header = document.getElementById("header").querySelector("h1");
const logo = document.getElementById("logo");


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
 active ?  hr.classList.remove("hidden") : hr.classList.add("hidden");

    if (active && isMedico == false) {
        console.log('NO ES MEDICO ACTIVO')

        resultContainer.classList.remove("hidden");
        chatsContainer.classList.remove("hidden");
       
    } else if (isMedico == false) {
        console.log('NO ES MEDICO INACTIVO')

        resultContainer.classList.add("hidden");
        chatsContainer.classList.add("hidden");
        chatContainer.classList.add("hidden");
    }

    if (active && isMedico == true) {
        console.log('ES MEDICO ACTIVO')

        resultContainerMedico.classList.remove("hidden");
        chatsContainerMedic.classList.remove("hidden");
    } else if (isMedico == true) {
        console.log('ES MEDICO INACTIVO')

        resultContainerMedico.classList.add("hidden");
        chatsContainerMedic.classList.add("hidden");
        chatContainerMedic.classList.add("hidden");
    }

    if (isMedico == undefined) {
        console.log('INACTIVO todo')

        chatsContainerMedic.classList.add("hidden");
        chatContainerMedic.classList.add("hidden");
        resultContainerMedico.classList.add("hidden");
        hr.classList.add("hidden");
        chatsContainer.classList.add("hidden");
        chatContainer.classList.add("hidden");
        resultContainer.classList.add("hidden");
    }

    fromLoginToChat(active, user);
}

function btnState() {
    btnSendMedic.disabled = !iMensajeMedic.value;
    btnSend.disabled = !iMensaje.value;
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
