import z from "zod";
import prismaClient from "../utils/prismaClient.mjs";

const characterSchema = z.object({
  id: z.string().optional(),
  nome: z.string().optional(),
  raca: z.string().optional(),
  classe: z.string().optional(),
  vida: z.number().positive(),
  ataque: z.number().positive(),
  defesa: z.number().positive(),
  userid: z.string().optional(),
});

const userSchema = z.object({
  id: z.string().optional(),
  nome: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
});

export default class BattlerController {
  async index(request, response) {
    response.send({
      page: 1,
      pageSize: 20,
      totalCount: await prismaClient.character.count(),
      items: await prismaClient.character.findMany(),
    });
  }

  async getOneChar(request, response) {
    const { id } = request.params;

    const character = await prismaClient.character.findUnique({
      where: {
        id: id,
      },
    });

    if (!character) {
      return response.status(404).send({ message: "Character not found." });
    }

    response.send(character);
  }

  async batalhem(request, response) {
    const ids = request.body;
    const char1 = await prismaClient.character.findUnique({
      where: {
        id: ids.id1,
      },
    });
    const char2 = await prismaClient.character.findUnique({
      where: {
        id: ids.id2,
      },
    });
    if (!char1 || !char2) {
      return response.status(404).send({ message: "Character not found." });
    }
    response.status(200).send(this.calculaVencedor(char1, char2));
  }

  calculaVencedor(char1, char2) {
    let turnos1 = this.turnosParaVencer(char2.vida, char2.defesa, char1.ataque);
    let turnos2 = this.turnosParaVencer(char1.vida, char1.defesa, char2.ataque);
    if (turnos1 == turnos2) return { message: "Empate!" };
    return {
      message:
        turnos1 < turnos2
          ? `O personagem ${char1.nome} ganhou!`
          : `O personagem ${char2.nome} ganhou!`,
    };
  }

  turnosParaVencer(vida1, defesa1, ataque2) {
    if (ataque2 <= defesa1) return Infinity;
    return vida1 / (ataque2 - defesa1);
  }

  async storeChar(request, response) {
    const character = request.body;
    console.log(request.body);

    const { success, data, error } = characterSchema.safeParse({
      nome: character.nome,
      raca: character.raca,
      classe: character.classe,
      vida: character.vida,
      ataque: character.ataque,
      defesa: character.defesa,
      userid: character.userid,
    });

    if (!success) {
      return response.status(400).send(error);
    }

    const user = await prismaClient.user.findUnique({
      where: {
        id: data.userid,
      },
    });

    if (!user) {
      return response.status(400).send({ error: "User ID is not valid" });
    }
    const newCharacter = await prismaClient.character.create({
      data: {
        nome: data.nome,
        raca: data.raca,
        classe: data.classe,
        vida: data.vida,
        ataque: data.ataque,
        defesa: data.defesa,
        user: { connect: { id: data.userid } },
      },
    });

    response.send({ message: "store", data: newCharacter });
  }

  async updateChar(request, response) {
    const { id } = request.params;
    const updatedCharacter = request.body;

    const oldCharacter = await prismaClient.character.findUnique({
      where: {
        id: id,
      },
    });

    if (!oldCharacter) {
      return response.status(404).send({ message: "Character not found." });
    }

    await prismaClient.character.update({
      where: {
        id: id,
      },
      data: {
        ...oldCharacter,
        ...updatedCharacter,
      },
    });

    response.send({ message: `Character ${id} Updated` });
  }

  async destroyChar(request, response) {
    const { id } = request.params;

    const deleteChar = await prismaClient.character.findUnique({
      where: {
        id: id,
      },
    });

    if (!deleteChar) {
      return response.status(404).send({ message: "Character not found." });
    }

    await prismaClient.character.delete({
      where: {
        id: id,
      },
    });

    response.status(200).send({ message: `Character ${id} Deleted` });
  }

  async storeUser(request, response) {
    const user = request.body;

    const { success, data, error } = userSchema.safeParse({
      nome: user.nome,
      email: user.email,
      password: user.password,
    });

    if (!success) {
      return response.status(400).send(error);
    }
    const newUser = await prismaClient.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (newUser) {
      return response.status(404).send({ message: "User already exists." });
    }

    await prismaClient.user.create({
      data: {
        nome: data.nome,
        email: data.email,
        password: data.password,
      },
    });

    response.send({
      message: "store",
      data: { nome: newUser.nome, email: newUser.email },
    });
  }

  async getOneUser(request, response) {
    const { email } = request.params;

    const user = await prismaClient.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return response.status(404).send({ message: "User not found." });
    }

    response.send({ nome: user.nome, email: user.email, id: user.id });
  }

  async destroyUser(request, response) {
    const { email } = request.params;

    const deleteUser = await prismaClient.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!deleteUser) {
      return response.status(404).send({ message: "User not found." });
    }

    await prismaClient.user.delete({
      where: {
        email: email,
      },
    });

    response.status(200).send({ message: `User ${email} Deleted` });
  }
}
