// server.js
import { createServer } from 'http';
import { Server } from 'socket.io';

// Crear el servidor HTTP
const server = createServer();

// Inicializar Socket.io con el servidor HTTP
const io = new Server(server, {
   connectionStateRecovery: {},
   /* cors: {
      origin: "*", // Ajusta esto según tus necesidades
      methods: ["GET", "POST"]
   } */
});

// Escuchar eventos de conexión
io.on('connection', (socket) => {
   console.log('Nuevo cliente conectado');

   // Escuchar eventos personalizados
   socket.on('mensaje', (data) => {
      console.log('Mensaje recibido:', data);
   });

   // Desconexión del cliente
   socket.on('disconnect', () => {
      console.log('Cliente desconectado');
   });
});

// Iniciar el servidor en el puerto 3000
server.listen(3000, () => {
   console.log('Servidor escuchando en puerto 3000');
});
