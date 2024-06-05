export async function POST({ request }) {
    const data = await request.json();
    const { emisorId, receptorId, textoEncriptado } = data;

    const rs = await db.execute({
        sql: "INSERT INTO mensaje (emisorId, receptorId, textoEncriptado, fechaEnvio) VALUES ($emisorId, $receptorId, $textoEncriptado, $fechaEnvio)",
        args: {
            emisorId,
            receptorId,
            textoEncriptado,
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