import * as ap from "./apareance.js";
import * as cb from "./chatbox.js";
import * as cbm from "./chatboxmedic.js";
import * as pa from "./socket/paciente.js";
import * as m from "./socket/medic.js";

const form = document.getElementById("form");

const btnDisconnect = document.getElementById("btnDisconnect");
const iEmail = document.getElementById("email");
const userId = document.getElementById("userId");
const inputPassword = document.getElementById("inputPassword");
const forgetPassword = document.getElementById("forgetPassword");

let esMedico;

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
            if (res.ok) {
                return res.json();
            }
            else if (res.status == 401) {
                forgetPassword.innerHTML = "Email o contraseña incorrecta";
                forgetPassword.classList.remove("hidden");
            } else if (res.status == 409) {
                forgetPassword.innerHTML = "El usuario ya está conectado";
                forgetPassword.classList.remove("hidden");
            }
            ap.loading(false);
            return { error: true };
        })
        .then((data) => {
            if (data.error) {
                return;
            }
            userId.value = data.usuarioId;
            esMedico = data.medico;
            ap.changeMessage(true, data.nombre, data.medico);
            if (data.medico) {
                m.getUsers();
                cbm.getChats();
            } else {
                pa.getResults(userId.value);
                cb.getChats();
            }
        })
        .catch((err) => {
            ap.loading(false);
            console.error(err);
        });
})

// --------------------------------------- //

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
            userId.innerHTML = '';
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

// --------------------------------------- //

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

