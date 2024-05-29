import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
import * as ap from "./apareance.js";

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


ap.btnState();

function discon() {
    ap.loading(false)
    socket.disconnect();
    ap.changeMessage(false);
    console.log("Desconectado del servidor");
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
        socket = io("http://localhost:3000", {
            auth: {
                username: inputUsername.value,
                serverOffset: 1,
                password: inputPassword.value
            },
        });

        socket.on("disconnect", (server) => {
            console.log("Desconectado del servidor por el cliente");
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
            socket.on('name', (clientName) => {
                ap.changeMessage(true, clientName)
            })
        });

        socket.on('message', (msg, serverOffset, clientUser) => {
            let item = `<li class="bg-slate-300 border border-black px-5 py-2 flex flex-col rounded-2xl text-end"><span class="text-xl text-wrap break-words">${msg}</span><small class="text-xs text-wrap break-words">${clientUser}</small> </li>`
            if (clientUser != inputUsername.value) {
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

btnDisconnect.addEventListener("click", discon);
iMessage.addEventListener("input", ap.btnState);
inputPassword.addEventListener("input", ap.removeForgetPassword);
