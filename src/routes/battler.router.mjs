import { Router } from 'express';
import BattlerController from '../controllers/battler.controller.mjs';

const routes = Router();

const battlerController = new BattlerController();
  
  //getAll
  routes.get('/api/battler', (request, response) =>
    battlerController.index(request, response)
  );
  //get 1 Char
  routes.get('/api/battler/:id', (request, response) =>
    battlerController.getOneChar(request, response)
  );
  //faz 2 Char batalharem
  routes.get('/api/batalhem', (request, response) =>
    battlerController.batalhem(request, response)
  );
  //cria 1 char
  routes.post('/api/battler', (request, response) =>
    battlerController.storeChar(request, response)
  );
  //updata 1 char
  routes.patch('/api/battler/:id', (request, response) =>
    battlerController.updateChar(request, response)
  );
  //deleta 1 char
  routes.delete('/api/battler/:id', (request, response) =>
    battlerController.destroyChar(request, response)
  );
  //cria 1 user
  routes.post('/api/user', (request, response) =>
    battlerController.storeUser(request, response)
  );
  //get 1 user
  routes.get('/api/user/:email', (request, response) =>
    battlerController.getOneUser(request, response)
  );
  //delete 1 user
  routes.delete('/api/user/:email', (request, response) =>
    battlerController.destroyUser(request, response)
  );
  
  export default routes;