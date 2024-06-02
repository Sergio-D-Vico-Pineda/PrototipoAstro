import { db } from "../../../astro.config.mjs";

export async function POST({ request }) {
    const data = await request.json();

    const mail = data.email;
    console.log(mail);

    const rs = await db.execute({
        sql: "SELECT usuarioId, nombre, email FROM usuario WHERE email = $mail LIMIT 1",
        args: {
            mail,
        },
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

    return new Response(JSON.stringify(respo), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
