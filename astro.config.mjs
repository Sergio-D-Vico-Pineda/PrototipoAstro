import
{
    defineConfig
}
from 'astro/config';
import tailwind from "@astrojs/tailwind";
import dotenv from 'dotenv';

dotenv.config();

// https://astro.build/config
export default defineConfig(
{
    integrations: [tailwind()]
});

import
{
    createClient
}
from "@libsql/client";

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