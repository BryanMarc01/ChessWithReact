const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

// Manejar conexión y desconexión de clientes
io.on('connection', (socket) => {
  console.log('New client connected');

  // Escuchar el evento 'move' desde el cliente
  socket.on('move', (move) => {
    console.log(`Received move: ${JSON.stringify(move)}`);
    // Reenviar el movimiento a todos los clientes conectados, excepto el emisor
    socket.broadcast.emit('move', move);
    // Aquí puedes agregar lógica adicional para validar el movimiento, actualizar el estado del juego, etc.
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;
