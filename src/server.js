import { Server } from "socket.io"

import { createServer } from "node:http"

const server = createServer();

const io = new Server(server, {
   connectionStateRecovery: {},
   cors: {
      origin: "http://localhost:4321",  // Asegúrate de cambiar esto por tu URL de cliente
      methods: ["GET", "POST"]
   }
})

io.on('connection', async (socket) => {
   console.log(`Nuevo cliente conectado: ${socket.handshake.auth.username} \n`);

   socket.on('message', async (msg) => {
      console.log(`${socket.handshake.auth.username}: mensaje enviado: ${msg} \n`);
   })

   socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.handshake.auth.username} \n`);
   })
})

server.listen(3000, () => {
   console.log('listening on localhost:3000');
})