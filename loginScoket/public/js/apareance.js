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

const chatContainerMedico = document.getElementById("chatContainerMedico");
const resultContainerMedico = document.getElementById("resultContainerMedico");

let user, esMedico, changed = false;

function fromLoginToChat(active = true, user) {
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
        changed = true;
    } else {
        header.classList.add("flex-col");
        h1header.classList.add("text-center");
        h1header.classList.add("text-4xl");
        h1header.classList.remove("text-3xl");
        logo.classList.add("max-w-96");
        logo.classList.remove("max-w-20");
        form.classList.remove("hidden");
        disconnectContainer.classList.add("hidden");
        disconnectContainer.classList.remove("flex");
        changed = false;
    }
}

async function changeMessage(active = true, userMail) {
    const data = {
        email: userMail
    }

    if (active) {
        await fetch('/api/db', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then((res) => {
            if (!res.ok) {
                alert("Error: " + res.status);
            }
            return res.json();
        }).then((data) => {
            esMedico = data.medico
            user = data.nombre
        }).catch((err) => {
            console.error(err);
        })

    }

    console.log(active)
    if (esMedico == false) {
        console.log('NO ES MEDICO')
        changeToUser()
    } else if (esMedico == true) {
        console.log('ES MEDICO')
        changeToMedico()
    }

    fromLoginToChat(active, user);
}

function outMessage() {
    if (esMedico == false) {
        console.log('NO ES MEDICO')
        userToLogin()
    } else if (esMedico == true) {
        console.log('ES MEDICO')
        MedicoToLogin()
    }
    fromLoginToChat(false, user);
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

function changeToMedico() {
    console.log('ES MEDICO ACTIVO')
    chatContainerMedico.classList.remove("hidden");
    resultContainerMedico.classList.remove("hidden");
    hr.classList.remove("hidden");
}

function MedicoToLogin() {
    console.log('ES MEDICO INACTIVO')
    chatContainerMedico.classList.add("hidden");
    resultContainerMedico.classList.add("hidden");
    hr.classList.add("hidden");
}

function changeToUser() {
    console.log('NO ES MEDICO ACTIVO')
    chatContainer.classList.remove("hidden");
    resultContainer.classList.remove("hidden");
    hr.classList.remove("hidden");
}

function userToLogin() {
    console.log('NO ES MEDICO INACTIVO')
    chatContainer.classList.add("hidden");
    resultContainer.classList.add("hidden");
    hr.classList.add("hidden");
}

export {
    changeMessage,
    outMessage,
    btnState,
    loading,
    removeForgetPassword
}