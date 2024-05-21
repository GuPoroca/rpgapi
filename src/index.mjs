import express from 'express';

import battlerRoutes from './routes/battler.router.mjs';

const PORT = process.env.PORT || 5000;

const server = express();

server.use(express.json());
server.use(battlerRoutes);

server.listen(PORT, () => {
  console.log(`Estou rodando na porta ${PORT}`);
});
