import { db } from "../../../astro.config.mjs";

export async function POST({ request }) {
    const formData = await request.formData();

    let tipo = formData.get("tipo");
    let pacienteId = formData.get("pacienteId");
    let medicoId = formData.get("medicoId");
    let file = formData.get("file");
    let descripcion = formData.get("descripcion");
    const fecha = new Date();

    if (!file) {
        return new Response("No file uploaded", { status: 400 });
    }

    // Convertir el archivo a base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = buffer.toString("base64");

    // Enviar base64 al servidor
    await db
        .execute({
            sql: "INSERT INTO resultado( medicoId, pacienteId, descripcion, fecha, tipoResultado, archivo) VALUES($medicoId, $pacienteId, $descripcion, $fecha, $tipoResultado, $archivo)",
            args: {
                medicoId,
                pacienteId,
                descripcion,
                fecha,
                tipoResultado: tipo,
                archivo: base64String,
            },
        })
        .then((a) => {
            if (a.rowsAffected > 0) {
                console.log("Archivo enviado");
            } else {
                console.log("Error al enviar el archivo");
            }
        });

    return new Response(null, {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}