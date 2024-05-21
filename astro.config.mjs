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
                  const httpServer = http.createServer(server);
                  const io = new SocketIOServer(httpServer, {
                     cors: {
                        origin: "http://localhost:4321",
                        methods: ["GET", "POST"]
                     }
                  });

                  server.httpServer.on('close', () => {
                     io.close();
                  });

                  io.on("error", (err) => {
                     console.error(err);
                  });

                  io.on('connection', async (socket) => {
                     const clientUser = socket.handshake.auth.username;
                     console.log(`Nuevo cliente conectado: ${clientUser} \n`);
                     io.emit('message', `¡Hola, ${clientUser}!`, socket.handshake.auth.serverOffset, 'Server');

                     if (clientUser === 'a' || !clientUser) {
                        console.log(`Cliente desconectado: ${clientUser} \n`);
                        io.emit('myDisconnect', `Desconectado por el servidor: cliente ${clientUser}`, socket.handshake.auth.serverOffset, clientUser);
                        io.emit('forceDisconnect');
                        socket.disconnect();
                     }

                     socket.on('message', async (msg) => {
                        console.log(`${clientUser}: mensaje enviado: ${msg} \n`);
                     })

                     socket.on('disconnect', () => {
                        console.log(`Cliente desconectado: ${clientUser} \n`);
                     })
                  })

                  httpServer.listen(3000, () => {
                     console.log('listening on localhost:3000');
                  })
               }
            }
         ]
      },
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