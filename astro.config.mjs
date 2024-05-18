import { defineConfig } from 'astro/config';
import { createClient } from "@libsql/client";
import { Server as SocketIOServer } from 'socket.io';
import tailwind from "@astrojs/tailwind";
import dotenv from 'dotenv';
import http from "node:http";

dotenv.config();

// https://astro.build/config
export default defineConfig(
   {
      vite: {
         plugins: [
            {
               name: 'socket.io-server',
               configureServer(server) {
                  const httpServer = http.createServer(server.middlewares);
                  const io = new SocketIOServer(httpServer, {
                     cors: {
                        origin: "http://localhost:4321",  // Asegúrate de cambiar esto por tu URL de cliente
                        methods: ["GET", "POST"]
                     }
                  });

                  io.on("error", (err) => {
                     console.error(err);
                  });

                  io.on('connection', async (socket) => {
                     console.log(`Nuevo cliente conectado: ${socket.handshake.auth.username} \n`);

                     socket.on('message', async (msg) => {
                        console.log(`${socket.handshake.auth.username}: mensaje enviado: ${msg} \n`);
                     })

                     socket.on('disconnect', () => {
                        console.log(`Cliente desconectado: ${socket.handshake.auth.username} \n`);
                     })
                  })

                  httpServer.listen(4320, () => {
                     console.log('listening on localhost:4320');
                  })

                  server.middlewares.use((req, res, next) => {
                     httpServer.emit('request', req, res);
                     next();
                   });
               }
            }
         ]
      },
      /* output: 'server', */
      integrations: [tailwind()]
   });

const db = createClient(
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
console.log('DB created')