import { Router } from 'express';
import BattlerController from '../controllers/battler.controller.mjs';

const routes = Router();

const battlerController = new BattlerController();
  
  routes.get('/api/battler', (request, response) =>
    battlerController.index(request, response)
  );
  
  routes.get('/api/battler/:id', (request, response) =>
    battlerController.getOneChar(request, response)
  );

  routes.get('/api/batalhem', (request, response) =>
    battlerController.batalhem(request, response)
  );
  
  routes.post('/api/battler', (request, response) =>
    battlerController.storeChar(request, response)
  );
  
  routes.patch('/api/battler/:id', (request, response) =>
    battlerController.updateChar(request, response)
  );
  
  routes.delete('/api/battler/:id', (request, response) =>
    battlerController.destroyChar(request, response)
  );
  
  export default routes;