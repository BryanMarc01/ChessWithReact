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

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('move', (move) => {
    console.log(`Received move: ${JSON.stringify(move)}`);
    socket.broadcast.emit('move', move);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.get('/api', (req, res) => {
  res.send('Server is up and running!');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;
