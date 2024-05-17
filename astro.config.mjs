import {
   defineConfig
}
   from 'astro/config';
import tailwind from "@astrojs/tailwind";
import dotenv from 'dotenv';
import {
   Server
} from "socket.io"

import {
   createServer
} from "node:http"

import {
   createClient
}
   from "@libsql/client"

dotenv.config();

// https://astro.build/config
export default defineConfig(
   {
      output: 'server',
      integrations: [tailwind()]
   });


const server = createServer();
const io = new Server(server, {
   connectionStateRecovery: {}
})


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


io.on('connection', async (socket) => {
   console.log("USER CONNECTED+++++++++++++++++")

   socket.on('disconnect', () => {
      console.log('USER DISCONNECTED----------------')
   })

   socket.on('chat message', async (msg) => {
      const username = socket.handshake.auth.username ?? 'anonymous'
      console.log(
         {
            username
         })

      console.log("MESSAGE RECIEVED: " + msg)
      /* try {
         result = await db.execute(
            {
               sql: 'INSERT INTO messages (content, user) VALUES (:msg, :username)',
               args:
               {
                  msg,
                  username
               }
            })
      }
      catch (e) {
         console.error(e)
         return
      } */

      io.emit('chat message', msg, result, username)
   })
})


server.listen(4321, () => {
   console.log('listening on localhost:4321');
})