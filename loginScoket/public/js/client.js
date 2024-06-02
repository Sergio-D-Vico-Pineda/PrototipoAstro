import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
import * as ap from "./apareance.js";

const clientUserDisc = document.getElementById("disconnectContainer").querySelector("span");

let socket;
const form = document.getElementById("form");
const formMessage = document.getElementById("formMessage");

const btnDisconnect = document.getElementById("btnDisconnect");
const inputUsername = document.getElementById("username");
const iMessage = document.getElementById("message");
const messages = document.getElementById("messages");
const chat = document.getElementById("chat");

const forgetPassword = document.getElementById("forgetPassword");
const inputPassword = document.getElementById("inputPassword");
const userSpan = document.getElementById("userSpan");

ap.btnState();

function discon() {
    ap.loading(false)
    ap.outMessage();
    socket.disconnect();
    console.log("Desconectado del servidor por el cliente");
};

function discon2() {
    discon();
    forgetPassword.classList.add("hidden");
};

form.addEventListener('submit', (e) => {
    e.preventDefault()

    if (inputUsername.value == "") {
        alert("Por favor, ingresa un nombre de usuario");
        return;
    }

    if (inputPassword.value == "") {
        forgetPassword.classList.remove("hidden");
        return;
    }

    ap.loading();

    try {
        //socket = io("https://automatic-meme-pv7j9j4j4vqf9pxp-3000.app.github.dev/", {
        socket = io("http://localhost:3000", {
            auth: {
                username: inputUsername.value,
                serverOffset: 1,
                password: inputPassword.value
            },
        });

        socket.on("disconnect", () => {
            console.log("Desconectado por el servidor");
            forgetPassword.classList.remove("hidden");
            discon();
        });

        socket.on("error", (err) => {
            console.log(err);
            discon();
        });

        socket.on("connect", () => {
            console.log("Conectado al servidor");
            messages.innerHTML = "";
            ap.changeMessage(true, inputUsername.value);
        });

        socket.on('message', (msg, serverOffset, clientUser) => {
            let item = `<li class="bg-slate-300 border border-black px-5 py-2 flex flex-col rounded-2xl text-end"><span class="text-xl text-wrap break-words">${msg}</span><small class="text-xs text-wrap break-words">${clientUser}</small> </li>`
            if (clientUser != userSpan.innerText) {
                item = `<li class="bg-slate-400 border border-black px-5 py-2 flex flex-col rounded-2xl"><span class="text-xl text-wrap break-words">${msg}</span><small class="text-xs text-wrap break-words">${clientUser}</small></li>`
            }
            console.log(`${clientUser}: ${msg}`);

            messages.insertAdjacentHTML('beforeend', item)
            socket.auth.serverOffset = serverOffset

            chat.scrollTop = chat.scrollHeight
        })
    }
    catch (error) {
        console.error(error);
    }
})

formMessage.addEventListener("submit", (e) => {
    e.preventDefault();
    if (iMessage.value == "") {
        alert("Por favor, ingresa un mensaje");
        return;
    }
    socket.emit("message", iMessage.value);
    iMessage.value = "";
    ap.btnState();
    iMessage.focus();
});

btnDisconnect.addEventListener("click", discon2);
iMessage.addEventListener("input", ap.btnState);
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

selUsers.addEventListener("change", countResultsUsers)

// create async function
