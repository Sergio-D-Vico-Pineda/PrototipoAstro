import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

let socket;
const form = document.getElementById("form");
const btnConnect = document.getElementById("btnConnect");
const btnDisconnect = document.getElementById("btnDisconnect");
const username = document.getElementById("username");

const discon = () => {
    username.disabled = false;
    btnConnect.disabled = false;
    btnDisconnect.disabled = true;
    console.log('Disconnecting...');

    socket.disconnect();
    console.log("Desconectado del servidor");
};

form.addEventListener('submit', (e) => {
    e.preventDefault()

    if (username.value == "") {
        alert("Por favor, ingresa tu nombre de usuario");
        return;
    }

    btnConnect.disabled = true;
    username.disabled = true;
    btnDisconnect.disabled = false;
    console.log('Connecting...');

    socket = io("http://localhost:3000", {
        auth: {
            username: username.value,
            serverOffset: 1,
        },
    });

    socket.on("connect", () => {
        console.log("Conectado al servidor");
    });

    socket.on('message', (msg, serverOffset, username) => {
        console.log(msg, serverOffset, username);
        socket.auth.serverOffset = serverOffset
    })

    socket.on("myDisconnect", discon);
})

btnDisconnect.addEventListener("click", discon);





/* socket.emit("message", "Hola"); */