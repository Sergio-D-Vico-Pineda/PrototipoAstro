import { db } from "../../../astro.config.mjs";

export async function GET({ request }) {

    const rs = await db.execute(
        "SELECT m.usuarioId, u.nombre, u.email FROM medico m, usuario u WHERE m.usuarioId = u.usuarioId "
    );

    return new Response(JSON.stringify(rs.rows), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}