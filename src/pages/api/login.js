import { db } from "../../../astro.config.mjs";

let usersConnected = [];

export async function POST({ request }) {
    const data = await request.json();

    const clientMail = data.email;
    const password = data.password;

    if (data.disconnect === false && clientMail === 'admin') {
        console.log('Desconectar a todos los usuarios')
        usersConnected = [];
        return new Response(JSON.stringify({ message: "TODOS desconectados" }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    if (data.disconnect) {
        console.log('Desconectar a ', data.email)
        usersConnected = usersConnected.filter(email => email !== clientMail);
        return new Response(JSON.stringify({ message: "Usuario desconectado" }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    console.log(clientMail, password);

    const rs = await db.execute({
        sql: "SELECT usuarioId, nombre, email FROM usuario WHERE email = $mail AND contraseñaHash = $pass LIMIT 1",
        args: {
            mail: clientMail,
            pass: password
        }
    });

    if (rs.rows.length === 0 || usersConnected.includes(rs.rows[0].email)) {
        console.log("Usuario no encontrado o ya está conectado");
        return new Response(JSON.stringify({ error: "Usuario no encontrado o ya está conectado" }), {
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
        usuarioId: rs.rows[0].usuarioId,
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