import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import battlerRoutes from './routes/battler.router.mjs';

const PORT = process.env.PORT || 5000;

const server = express();
server.use(cors());
server.use(helmet());
server.use(morgan('combined'));
server.use(express.json());
server.use(battlerRoutes);

server.listen(PORT, () => {
  console.log(`Estou rodando na porta ${PORT}`);
});
