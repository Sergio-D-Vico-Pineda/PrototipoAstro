import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

const iEmail = document.getElementById("email");
const inputPassword = document.getElementById("inputPassword");

let socket;

async function connect(userId) {
    try {
        //socket = io("http://localhost:3000", {
        socket = await io("https://automatic-meme-pv7j9j4j4vqf9pxp-3000.app.github.dev", {
            auth: {
                username: iEmail.value,
                serverOffset: 1,
                password: inputPassword.value,
                usuarioId: userId
            },
        });

        socket.on("disconnect", () => {
            console.log("Desconectado por el servidor");
            /* forgetPassword.classList.remove("hidden");
            discon(); */
        });

        socket.on("error", (err) => {
            console.log(err);
            /* discon(); */
        });

        socket.on("connect", () => {
            console.log("Conectado al servidor");
            console.log(socket.auth.usuarioId);
           /*  messages.innerHTML = "";
            ap.changeMessage(true, inputUsername.value); */
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
};

/* log(`Intento conectarse : ${clientMail} \n`);

rs = await db.execute({
    sql: "SELECT usuarioId, nombre, email FROM usuario WHERE email = $mail AND contraseñaHash = $pass LIMIT 1",
    args: {
        mail: clientMail,
        pass: password
    }
});

if (rs.rows.length === 0 || usersConnected.includes(rs.rows[0].email)) {
    log('No esta en la BBDD o ya ha iniciado sesión');
    log(`Cliente desconectado: ${clientMail} \n`);
    io.emit('forceDisconnect');
    socket.disconnect();
    return;
}
socket.on('disconnect', () => {
    log(`Cliente desconectado: ${clientMail} \n`);
    usersConnected = usersConnected.filter(email => email !== clientMail);
    socket.disconnect();
    return;
})

await db.execute({
    sql: "SELECT 1 FROM medico WHERE usuarioId = $id",
    args: {
        id: rs.rows[0].usuarioId
    }
}).then(rs1 => {
    isMedico = rs1.rows.length > 0
    isMedico ? log('Es medico') : log('No es medico');
}).catch(err => {
    log('HAS ROTO ALGO:', err);
    return;
})

const clientName = rs.rows[0].nombre;

socket.on('message', async (msg) => {
    log(`Mensaje enviado: ${clientName}: ${msg} \n`);
    io.emit('message', msg, socket.handshake.auth.serverOffset, clientName);
})

io.emit('message', `¡Hola, ${clientName}!`, socket.handshake.auth.serverOffset, 'Server');
usersConnected.push(rs.rows[0].email);

log(`Nuevo cliente conectado: ${clientMail} \n`);
log(`Conectados: ${usersConnected}`); */

export { connect };