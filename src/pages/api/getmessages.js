import { db } from "../../../astro.config.mjs";

export async function POST({ request }) {
    const { emisorId, receptorId } = await request.json();

    const rs = await db.execute({
        sql: "SELECT m.emisorId, m.receptorId, m.textoEncriptado, m.fechaEnvio, u.nombre FROM mensaje m LEFT JOIN usuario u ON m.emisorId = u.usuarioId WHERE ((emisorId = $emisorId AND receptorId = $receptorId) OR (emisorId = $receptorId AND receptorId = $emisorId)) ORDER BY fechaEnvio ASC",
        args: {
            emisorId,
            receptorId
        }
    });

    return new Response(JSON.stringify(rs.rows), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}

""