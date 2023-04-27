import { deleteAnimalSchema, listAnimalsSchema } from "./schema";
import { getAnimalContractService } from "../common/ServiceFactory";
import { Animal } from "./entity";

export default function animalHandler(server, options, next) {
  server.get("/", { schema: listAnimalsSchema }, async (req, res) => {
    req.log.info("list animals from db");
    const animals = await server.db.animals.find();
    animals.transaction = await getAnimalContractService().getAllAnimal();
    res.send(animals);
  });

  server.get("/:_id", async (req, res) => {
    req.log.info("get one animals from db");
    const animal = await server.db.animals.findOne(req.params._id);
    animal.transaction = await getAnimalContractService().readAnimal(
      animal._id
    );
    res.send(animal);
  });

  server.get("/:name/name", async (req, res) => {
    req.log.info("get animals with same name to db");
    const name = req.params.name;
    const animal = await server.db.animals.findOne(name);

    res
      .status(200)
      .send(await getAnimalContractService().getAnimalByName(name));
  });

  server.get("/:owner_id/owner", async (req, res) => {
    req.log.info("get animals with same owner to db");
    const owner = req.params.owner_id;
    const animal = await server.db.animals.findOne(owner);

    res
      .status(200)
      .send(await getAnimalContractService().getAnimalByOwner(owner));
  });

  server.get("/:_id/history", async (req, res) => {
    req.log.info("transaction animal history");
    res.send(await getAnimalContractService().animalHistory(req.params._id));
  });

  server.post("/", async (req, res) => {
    req.log.info("Add animals to db");
    let animals = (await server.db.animals.save(req.body)) as Animal;
    animals.transactionHash = await getAnimalContractService().creteAnimal(
      animals
    );
    animals = (await server.db.animals.save(req.body)) as Animal;
    res.status(201).send(animals);
  });

  server.put("/:_id", async (req, res) => {
    req.log.info("Update animal to db");
    const _id = req.params._id;
    const animal = await server.db.animals.findOne(req.params._id);
    animal.transactionHash = await getAnimalContractService().updateAnimal(
      animal._id,
      req.body
    );
    const animals = await server.db.animals.save({ _id, ...req.body });
    res.status(200).send(animals);
  });

  server.put("/:_id/name", async (req, res) => {
    req.log.info("Update animal name to db");
    const _id = req.params._id;
    const animal = await server.db.animals.findOne(req.params._id);
    animal.transactionHash = await getAnimalContractService().updateAnimalName(
      animal._id,
      req.body.name
    );
    animal.name = req.body.name;
    const animals = await server.db.animals.save({ _id, ...animal });
    res.status(200).send(animals);
  });

  server.put("/:_id/owner", async (req, res) => {
    req.log.info("Update animal owner to db");
    const _id = req.params._id;
    const Owner = {
      Id: req.body.ownerId,
      lastName: req.body.ownerLastname,
      name: req.body.ownerName,
    };
    const animal = await server.db.animals.findOne(req.params._id);
    animal.transactionHash = await getAnimalContractService().changeOwner(
      animal._id,
      Owner.Id,
      Owner.lastName,
      Owner.name
    );
    animal.ownerId = Owner.Id;
    animal.ownerLastname = Owner.lastName;
    animal.ownerName = Owner.name;
    const animals = await server.db.animals.save({ _id, ...animal });
    res.status(200).send(animals);
  });

  server.delete("/:_id", { schema: deleteAnimalSchema }, async (req, res) => {
    req.log.info(`delete animal ${req.params._id} from db`);
    const animal = await server.db.animals.findOne(req.params._id);
    animal.transaction = await getAnimalContractService().deleteAnimal(
      animal._id
    );
    await server.db.animals.remove(animal);
    res.code(200).send({});
  });

  next();
}
