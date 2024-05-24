import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
import * as ap from "./apareance.js";

let socket;
const form = document.getElementById("form");
const formMessage = document.getElementById("formMessage");

const btnDisconnect = document.getElementById("btnDisconnect");
const username = document.getElementById("username");
const iMessage = document.getElementById("message");
const messages = document.getElementById("messages");
const chat = document.getElementById("chat");


ap.btnState();

const discon = () => {
    ap.loading(false)
    socket.disconnect();
    ap.changeMessage(false);
    console.log("Desconectado del servidor");
};

form.addEventListener('submit', (e) => {
    e.preventDefault()

    if (username.value == "") {
        alert("Por favor, ingresa un nombre de usuario");
        return;
    }


     ap.loading();
    

    try {
        socket = io("http://localhost:3000", {
            auth: {
                username: username.value,
                serverOffset: 1,
            },
        });

        socket.on("myDisconnect", (msg, serverOffset, clientUser) => {
            if (socket.auth.username == clientUser) {
                console.log(msg);
                discon();
            }
        });

        socket.on("connect", () => {
            console.log("Conectado al servidor");
            ap.changeMessage(true)
        });

        socket.on('message', (msg, serverOffset, clientUser) => {
            let item = `<li class="bg-slate-300 border border-black px-5 py-2 flex flex-col rounded-2xl text-end"><span class="text-xl">${msg}</span><small class="text-xs">${clientUser}</small> </li>`
            if (clientUser != username.value) {
                item = `<li class="bg-slate-400 border border-black px-5 py-2 flex flex-col rounded-2xl"><span class="text-xl">${msg}</span><small class="text-xs">${clientUser}</small></li>`
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
});

btnDisconnect.addEventListener("click", discon);
iMessage.addEventListener("input", ap.btnState);
