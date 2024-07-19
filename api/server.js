const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/games');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/auth', authRoutes); // Usando las rutas de autenticación
app.use('/games', gameRoutes);

// Definir una ruta para la URL raíz
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

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

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
