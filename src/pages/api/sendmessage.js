import { db } from "../../../astro.config.mjs";

export async function POST({ request }) {
    const data = await request.json();
    const { emisorId, receptorId, texto } = data;

    const rs = await db.execute({
        sql: "INSERT INTO mensaje (emisorId, receptorId, textoEncriptado, fechaEnvio) VALUES ($emisorId, $receptorId, $texto, $fechaEnvio)",
        args: {
            emisorId,
            receptorId,
            texto,
            fechaEnvio: Date.now(),
        },
    });

    return new Response(JSON.stringify(rs), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}