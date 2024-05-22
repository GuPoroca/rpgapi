import z from 'zod';

const characterSchema = z.object({
    id: z.string().optional(),
    nome: z.string().optional(),
    raca: z.string().optional(),
    classe: z.string().optional(),
    vida: z.number().positive(),
    ataque: z.number().positive(),
    defesa: z.number().positive(),
  });

let characters = [];

//Personagens de teste:
characters.push({
  "id": "123",
  "nome": "Poroca Mago",
	"raca": "Elfo",
	"classe": "Mago",
	"vida": 20,
	"ataque": 16,
	"defesa": 7
});
characters.push({
  "id": "456",
  "nome": "Poroca Guerreiro",
	"raca": "Humano",
	"classe": "Guerreiro",
	"vida": 35,
	"ataque": 9,
	"defesa": 12
});

export default class BattlerController {

    index(request, response) {
        response.send({
          page: 1,
          pageSize: 20,
          totalCount: characters.length,
          items: characters,
        });
      }

    getOneChar(request, response) {
        const { id } = request.params;
    
        const character = characters.find((character) => character.id === id);
    
        if (!character) {
          return response.status(404).send({ message: 'Character not found.' });
        }
    
        response.send(character);
    }

    batalhem(request, response) {
        const ids = request.body;
        const char1 = characters.find((character) => character.id === ids.id1);
        const char2 = characters.find((character) => character.id === ids.id2);
        if (!char1 || !char2) {
          return response.status(404).send({ message: 'Character not found.' });
        }
        response.status(200).send(this.calculaVencedor(char1,char2));
    }

    calculaVencedor(char1, char2){
      let turnos1 = this.turnosParaVencer(char2.vida, char2.defesa, char1.ataque);
      let turnos2 = this.turnosParaVencer(char1.vida, char1.defesa, char2.ataque);
      if(turnos1 == turnos2) return {message: "Empate!"};
      return {message: (turnos1<turnos2) ? `O personagem ${char1.nome} ganhou!` : `O personagem ${char2.nome} ganhou!`};
    }

    turnosParaVencer(vida1, defesa1, ataque2){
        if(ataque2<=defesa1) return Infinity;
        return vida1/(ataque2-defesa1);
    }

    storeChar(request, response) {
        const character = request.body;
    
        const { success, data, error } = characterSchema.safeParse({
          nome: character.nome,
          raca: character.raca,
          classe: character.classe,
          vida: character.vida,
          ataque: character.ataque,
          defesa: character.defesa,
        });
    
        if (!success) {
          return response.status(400).send(error);
        }
    
        const [...id] = crypto.randomUUID().split('-');
        //checar se ta armazenando os nome tudo ou nem
        data.id = id.join('-');
    
        characters.push(data);
    
        response.send({ message: 'store', data });
    }

    updateChar(request, response) {
        const { id } = request.params;
        const updatedCharacter = request.body;

        const characterToBeUpdated = characters.find((character) => character.id === id);
    
        if (!characterToBeUpdated) {
          return response.status(404).send({ message: 'Character not found.' });
        }
        
        const newcharacters = characters.map((character) => {
          if (character.id === id) {
            return {
              ...characterToBeUpdated,
              ...updatedCharacter,
            };
          }
          
          return character;
        });
    
        characters = newcharacters;
    
        response.send({ message: `Character ${id} Updated` });
    }

    destroyChar(request, response) {
        const { id } = request.params;
        const oldCharacters = characters;

        characters = characters.filter((character) => character.id !== id);
        if (JSON.stringify(oldCharacters) == JSON.stringify(characters)) {
          console.log("eh igual");
          return response.status(404).send({ message: 'Character not found.' });
        }
    
        response.status(200).send({ message: `Character ${id} Deleted` });
    }
}