import { db } from "../../../astro.config.mjs";

export async function POST({ request }) {

    const data = await request.json();

    const rs = await db.execute({
        sql: "SELECT * FROM resultado WHERE pacienteId = $user",
        args: {
            user: data.userId,
        },
    });

    return new Response(JSON.stringify(rs.rows), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}