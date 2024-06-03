import { db } from "../../../astro.config.mjs";

let usersConnected = [];

export async function POST({ request }) {
    const data = await request.json();

    if (data.disconnect) {
        usersConnected.push(rs.rows[0].email);
        // pasar al siguiente middle ware
        console.log('Desconectar a ', data.email)
        return new Response(JSON.stringify({ message: "Usuario desconectado" }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    const clientMail = data.email;
    const password = data.password;
    console.log(clientMail, password);

    const rs = await db.execute({
        sql: "SELECT usuarioId, nombre, email FROM usuario WHERE email = $mail AND contraseñaHash = $pass LIMIT 1",
        args: {
            mail: clientMail,
            pass: password
        }
    });

    if (rs.rows.length === 0) {
        return new Response(JSON.stringify({ error: "Usuario no encontrado" }), {
            status: 404,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    const rs1 = await db.execute({
        sql: "SELECT 1 FROM medico WHERE usuarioId = $id",
        args: {
            id: rs.rows[0].usuarioId
        }
    })

    let respo = {
        nombre: rs.rows[0].nombre,
        id: rs.rows[0].usuarioId,
        email: rs.rows[0].email,
        medico: rs1.rows.length > 0
    };
    usersConnected.push(rs.rows[0].email);

    return new Response(JSON.stringify(respo), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
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