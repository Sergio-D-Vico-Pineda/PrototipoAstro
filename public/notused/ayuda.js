import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

const formMessage = document.getElementById("formMessage");
const iMessage = document.getElementById("message");
const messages = document.getElementById("messages");
const chat = document.getElementById("chat");

try {
    //socket = io("https://automatic-meme-pv7j9j4j4vqf9pxp-3000.app.github.dev/", {
    socket = io("http://localhost:3000", {
        auth: {
            username: iEmail.value,
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

        getData({
            email: iEmail.value
        }).then((a) => {
            ap.changeMessage(true, a.nombre, a.medico);
        });


        /* socket.on('name', (clientName, isMedico) => {
            esMedico = isMedico
            ap.changeMessage(true, clientName, esMedico)
        }) */
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
iMessage.addEventListener("input", ap.btnState);