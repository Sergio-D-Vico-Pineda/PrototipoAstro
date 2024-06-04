import { defineConfig } from 'astro/config';
import { createClient } from "@libsql/client";
import { Server as SocketIOServer } from 'socket.io';
import tailwind from "@astrojs/tailwind";
import dotenv from 'dotenv';
import http from "node:http";

function log(text) {
   console.log('SERVER: ' + text);
}

let rs;
let isMedico;
let usersConnected = [];

dotenv.config();

// https://astro.build/config
export default defineConfig(
   {
      vite: {
         plugins: [
            {
               name: 'socket.io-server',
               configureServer(server) {
                  const httpServer = http.createServer(server);
                  // https://automatic-meme-pv7j9j4j4vqf9pxp-4321.app.github.dev
                  // http://localhost:4321
                  const io = new SocketIOServer(httpServer, {
                     cors: {
                        origin: "*",
                        methods: ["GET", "POST"],
                     }
                  });

                  server.httpServer.on('close', () => {
                     io.close();
                  });

                  io.on("error", (err) => {
                     console.error(err);
                  });

                  io.on('connection', async (socket) => {
                     const clientMail = socket.handshake.auth.username;
                     const password = socket.handshake.auth.password;
                     log(`Intento conectarse : ${clientMail} \n`);

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
                        log(`HAS ROTO ALGO: ${err}`);
                     })

                     const clientName = rs.rows[0].nombre;

                     socket.on('message', async (msg) => {
                        log(`Mensaje enviado: ${clientName}: ${msg} \n`);
                        io.emit('message', msg, socket.handshake.auth.serverOffset, clientName);
                     })

                     /* io.emit('name', clientName, isMedico); */
                     io.emit('message', `¡Hola, ${clientName}!`, socket.handshake.auth.serverOffset, 'Server');
                     usersConnected.push(rs.rows[0].email);

                     log(`Nuevo cliente conectado: ${clientMail} \n`);
                     log(`Conectados: ${usersConnected}`);
                  })

                  httpServer.listen(3000, () => {
                     log('listening on localhost:3000');
                  })
               }
            }
         ]
      },
      output: 'server',
      integrations: [tailwind()]
   });

export const db = createClient(
   {
      url: process.env.URL_DB,
      authToken: process.env.TOKEN_DB,
   });

await db.execute(`
CREATE TABLE IF NOT EXISTS usuario (
  usuarioId INTEGER PRIMARY KEY,
  email VARCHAR,
  dni VARCHAR,
  nombre VARCHAR,
  contraseñaHash VARCHAR,
  contraseñaSalt VARCHAR,
  fechaRegistro TIMESTAMP
);
`);

await db.execute(`
CREATE TABLE IF NOT EXISTS paciente (
  usuarioId INTEGER PRIMARY KEY,
  fechaNacimiento DATE,
  dirección VARCHAR,
  sexo VARCHAR,
  prefComunicacion VARCHAR,
  FOREIGN KEY (usuarioId) REFERENCES usuario(usuarioId)
);
`);

await db.execute(`
CREATE TABLE IF NOT EXISTS medico (
  usuarioId INTEGER PRIMARY KEY,
  especialidades VARCHAR,
  puesto VARCHAR,
  idiomas VARCHAR,
  fechaNacimiento DATE,
  FOREIGN KEY (usuarioId) REFERENCES usuario(usuarioId)
);
`);

await db.execute(`
CREATE TABLE IF NOT EXISTS resultado (
  resultadoId INTEGER PRIMARY KEY,
  medicoId INTEGER,
  pacienteId INTEGER,
  descripcion TEXT,
  fecha TIMESTAMP,
  tipoResultado VARCHAR,
  archivo VARCHAR,
  FOREIGN KEY (medicoId) REFERENCES medico(usuarioId),
  FOREIGN KEY (pacienteId) REFERENCES paciente(usuarioId)
);
`);

await db.execute(`
CREATE TABLE IF NOT EXISTS mensaje (
  mensajeId INTEGER PRIMARY KEY,
  emisorId INTEGER,
  receptorId INTEGER,
  textoEncriptado TEXT,
  fechaEnvio TIMESTAMP,
  FOREIGN KEY (emisorId) REFERENCES usuario(usuarioId),
  FOREIGN KEY (receptorId) REFERENCES usuario(usuarioId)
);
`);
log('DB created')
