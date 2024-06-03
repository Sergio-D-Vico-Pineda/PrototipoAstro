
import * as ap from "./apareance.js";

let socket;
const form = document.getElementById("form");

const btnDisconnect = document.getElementById("btnDisconnect");
const iEmail = document.getElementById("email");

const forgetPassword = document.getElementById("forgetPassword");
const inputPassword = document.getElementById("inputPassword");
const userSpan = document.getElementById("userSpan");

let esMedico;

ap.btnState();

function discon() {
    /* ap.loading(false) */
    /* ap.changeMessage(false, null, esMedico); */

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

    console.log("Desconectado del servidor por el cliente");
};

function discon2() {
    discon();
    forgetPassword.classList.add("hidden");
};

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
        })
        .catch((err) => {
            ap.loading(false);
            console.error(err);
        });
})



btnDisconnect.addEventListener("click", discon2);

inputPassword.addEventListener("input", ap.removeForgetPassword);

// --------------------------------------- //

const selUsers = document.getElementById("selUsers");


async function countResultsUsers(e) {
    console.log(e.target.value);

    await fetch("/api/upload", {
        method: "GET",
        body: formData,
        /* headers: {
            "Content-Type": "multipart/form-data",
        }, */
    })
        .then((res) => {
            if (res.ok) {
                alert("File uploaded successfully");
            }
        })
        .catch((err) => {
            alert(err);
        });
}

async function getData(datas) {
    let edata = {};
    await fetch('/api/db', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datas),
        signal: signalA
    }).then((res) => {
        if (!res.ok) {
            alert("Error: " + res.status);
        }
        return res.json();
    }).then((data) => {
        edata.medico = data.medico
        edata.nombre = data.nombre
    }).catch((err) => {
        console.error(err);
    })
    return edata
}

selUsers.addEventListener("change", countResultsUsers)

// create async function
