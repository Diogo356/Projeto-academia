import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
dotenv.config();

import authRoutes from './src/routes/auth.route.js'
import workoutRoutes from './src/routes/workouts.route.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // URL do seu frontend
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/academia', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado ao MongoDB'))
.catch(err => console.log('❌ Erro MongoDB:', err));

// Socket.IO
io.on('connection', (socket) => {
  console.log('🔌 Usuário conectado:', socket.id);
  
  // Exemplo: enviar usuários online
  socket.on('userOnline', (userId) => {
    socket.join(userId);
    console.log(`👤 Usuário ${userId} online`);
  });
  
  socket.on('disconnect', () => {
    console.log('🔌 Usuário desconectado:', socket.id);
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API Academia funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Rota padrão
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API Academia' });
});


server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});