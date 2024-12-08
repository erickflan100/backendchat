require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const messageRoutes = require('./models/messageRoutes'); // Importe as rotas da mensagem

// Conectando ao MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB conectado com sucesso!'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/api', messageRoutes); // Use as rotas de mensagens

let activeUsers = {}; // { socketId: username }

// Conexão Socket.IO
io.on('connection', (socket) => {
  console.log('Usuário conectado:', socket.id);

  socket.on('set_username', (username) => {
    activeUsers[socket.id] = username;
    io.emit('active_users', Object.values(activeUsers)); // Envia a lista atualizada para todos
  });

  socket.on('send_message', (data) => {
    io.emit('receive_message', data); // Envia a mensagem para todos os usuários
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado:', socket.id);
  });
});

module.exports = { app, server };
