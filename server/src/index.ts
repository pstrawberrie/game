import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import accountRouter from './api/account';
import { config } from '../../config';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
const httpServer = createServer(app);
const io = new Server(httpServer);

// Serve a placeholder favicon.ico
app.get('/favicon.ico', (req, res) => {
  const faviconPath = path.join(__dirname, 'favicon.ico');
  if (fs.existsSync(faviconPath)) res.sendFile(faviconPath);
});

app.use('/api/account', accountRouter);

app.get('/', (req, res) => {
  res.send('MMORPG Server running');
});

io.on('connection', (socket) => {
  console.log('A user connected');
});

const PORT = config.SERVER_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}); 