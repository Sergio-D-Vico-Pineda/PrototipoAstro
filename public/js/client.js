import * as ap from "./apareance.js";
import * as cb from "./chatbox.js";
/* import * as m from "./medic.js"; */

const form = document.getElementById("form");

const btnDisconnect = document.getElementById("btnDisconnect");
const iEmail = document.getElementById("email");

const forgetPassword = document.getElementById("forgetPassword");
const inputPassword = document.getElementById("inputPassword");

const btnBack = document.getElementById("btnBack");

let esMedico;

function discon() {
    fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: iEmail.value,
            password: inputPassword.value,
            disconnect: true
        }),
    })
        .then((res) => {
            if (!res.ok) {
                console.log('ERROR DISCONNECTING??')
            }
            else
                return res.json();
        })
        .then((data) => {
            ap.loading(false)
            ap.changeMessage(false, null, esMedico);
        })
        .catch((err) => {
            console.log('ERROR DISCONNECTING??')
            console.error(err);
        });

    console.log("Usuario desconectado");
};

function discon2() {
    discon();
    forgetPassword.classList.add("hidden");
};

function back() {
    chatsContainer.classList.remove("hidden");
    chatContainer.classList.add("hidden");
    socket.disconnect();
}

// --------------------------------------- //

btnBack.addEventListener("click", back);

btnDisconnect.addEventListener("click", discon2);

inputPassword.addEventListener("input", ap.removeForgetPassword);

form.addEventListener('submit', (e) => {
    e.preventDefault()

    if (iEmail.value == "") {
        alert("Por favor, ingresa un correo");
        return;
    }

    if (inputPassword.value == "") {
        forgetPassword.classList.remove("hidden");
        return;
    }

    ap.loading();

    fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: iEmail.value,
            password: inputPassword.value,
        }),
    })
        .then((res) => {
            if (!res.ok) {
                forgetPassword.classList.remove("hidden");
                ap.loading(false);
            }
            else
                return res.json();
        })
        .then((data) => {
            ap.changeMessage(true, data.nombre, data.medico);
            cb.getChats();
        })
        .catch((err) => {
            ap.loading(false);
            console.error(err);
        });
})

// --------------------------------------- //

// create async function
document.getElementById("disconnectall").addEventListener("click", () => {

    fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: 'admin',
            disconnect: false
        }),
    })
        .then((res) => {
            if (!res.ok) {
                console.log('ERROR DISCONNECTING??')
            }
            else
                return res.json();
        })
        .then((data) => {
            ap.loading(false)
            ap.changeMessage(false, null, esMedico);
        })
        .catch((err) => {
            console.log('ERROR DISCONNECTING??')
            console.error(err);
        });

})