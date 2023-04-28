import { AnimalContractServiceInterface } from "./interface/AnimalContractServiceInterface";
import { Animal } from "./entity";
import { BlockchainServiceInterface } from "../fabric/interface/BlockchainServiceInterface";
import { getBlockchainService } from "../common/ServiceFactory";
import config from "../../config/Config";
import { TextDecoder } from "util";

export class AnimalContractService implements AnimalContractServiceInterface {
  private blockchainService: BlockchainServiceInterface =
    getBlockchainService();
  private utf8Decoder = new TextDecoder();

  async creteAnimal(animal: Animal): Promise<string> {
    const gateway = await this.blockchainService.connect();
    const network = gateway.getNetwork(config.fabric.channel.name);
    const contract = network.getContract(config.fabric.chaincode.name);

    try {
      const commit = await contract.submitAsync("CreateAnimal", {
        arguments: [
          animal._id,
          animal.name,
          animal.type,
          animal.breed,
          animal.birthDate.toString(),
          animal.description,
          String(animal.pedigree),
          animal.ownerId,
          animal.ownerName,
          animal.ownerLastname,
        ],
      });

      const resultJson = this.utf8Decoder.decode(commit.getResult());
      console.log(resultJson);
      return commit.getTransactionId();
    } catch (error) {
      console.log("Error during the transaction with message: ", error);
      throw error;
    }
  }

  async updateAnimalName(_id: string, name: string): Promise<string> {
    const gateway = await this.blockchainService.connect();
    const network = gateway.getNetwork(config.fabric.channel.name);
    const contract = network.getContract(config.fabric.chaincode.name);
    try {
      const commit = await contract.submitAsync("UpdateAnimalName", {
        arguments: [_id, name],
      });
      console.log(
        "questi qui sono gli argomenti per cambiare nome: " + arguments
      );
      const resultJson = this.utf8Decoder.decode(commit.getResult());
      console.log(resultJson);
      return commit.getTransactionId();
    } catch (error) {
      console.log("Error during the animal name update with message: ", error);
      throw error;
    }
  }

  async updateAnimal(_id: string, animal: Animal): Promise<string> {
    const gateway = await this.blockchainService.connect();
    const network = gateway.getNetwork(config.fabric.channel.name);
    const contract = network.getContract(config.fabric.chaincode.name);
    try {
      const commit = await contract.submitAsync(`UpdateAnimal`, {
        arguments: [
          _id,
          animal.name,
          animal.type,
          animal.breed,
          animal.birthDate.toString(),
          animal.description,
          String(animal.pedigree),
          animal.ownerId,
          animal.ownerName,
          animal.ownerLastname,
        ],
      });
      const resultJson = this.utf8Decoder.decode(commit.getResult());
      console.log(resultJson);
      return commit.getTransactionId();
    } catch (error) {
      console.log("Errore durante l update dell animale", error);
      throw error;
    }
  }

  async deleteAnimal(_id: string): Promise<void> {
    const gateway = await this.blockchainService.connect();
    const network = gateway.getNetwork(config.fabric.channel.name);
    const contract = network.getContract(config.fabric.chaincode.name);
    try {
      const commit = await contract.submitAsync(`DeleteAnimal`, {
        arguments: [_id],
      });
    } catch (error) {
      console.log("erorre durante la delete", error);
      throw error;
    }
  }

  async getAllAnimal(): Promise<string> {
    const gateway = await this.blockchainService.connect();
    const network = gateway.getNetwork(config.fabric.channel.name);
    const contract = network.getContract(config.fabric.chaincode.name);
    try {
      const commit = await contract.submitAsync(`GetAllAnimals`, {
        arguments: [],
      });
      const resultJson = this.utf8Decoder.decode(commit.getResult());
      return commit.getTransactionId();
    } catch (error) {
      console.log("Errore durante la presa di tutti l animali", error);
      throw error;
    }
  }

  async readAnimal(_id: string): Promise<string> {
    const gateway = await this.blockchainService.connect();
    const network = gateway.getNetwork(config.fabric.channel.name);
    const contract = network.getContract(config.fabric.chaincode.name);
    try {
      const commit = await contract.submitAsync(`ReadAnimal`, {
        arguments: [_id],
      });
      const resultJson = this.utf8Decoder.decode(commit.getResult());
      return commit.getTransactionId();
    } catch (error) {
      console.log("Errore durante la lettura dell animale", error);
      throw error;
    }
  }

  async animalExist(_id: string): Promise<string> {
    const gateway = await this.blockchainService.connect();
    const network = gateway.getNetwork(config.fabric.channel.name);
    const contract = network.getContract(config.fabric.chaincode.name);
    try {
      const commit = await contract.submitAsync(`AnimalExist`, {
        arguments: [_id],
      });
      const resultJson = this.utf8Decoder.decode(commit.getResult());
      return commit.getTransactionId();
    } catch (error) {
      console.log("Errore durante la visione dell esistenza ", error);
      throw error;
    }
  }

  async animalHistory(_id: string): Promise<string> {
    const gateway = await this.blockchainService.connect();
    const network = gateway.getNetwork(config.fabric.channel.name);
    const contract = network.getContract(config.fabric.chaincode.name);
    try {
      const resultBytes = await contract.evaluateTransaction(
        "GetAnimalHistory",
        _id
      );
      const resultJson = this.utf8Decoder.decode(resultBytes);
      return JSON.stringify(JSON.parse(resultJson));
    } catch (error) {
      console.log("Error during the animal name update with message: ", error);
      throw error;
    }
  }

  async getAnimalByName(animalName: string): Promise<Animal> {
    const gateway = await this.blockchainService.connect();
    const network = gateway.getNetwork(config.fabric.channel.name);
    const contract = network.getContract(config.fabric.chaincode.name);
    try {
      const resultBytes = await contract.evaluateTransaction(
        "GetAnimalByName",
        `{"selector":{"name": "${animalName}"} }`
      );
      const resultJson = this.utf8Decoder.decode(resultBytes);
      return JSON.parse(resultJson) as Animal;
    } catch (error) {
      console.log("Error during the animal name update with message: ", error);
      throw error;
    }
  }

  private prettyJSONString(inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2);
  }

  async getAnimalByOwner(ownerId: string): Promise<Animal> {
    const gateway = await this.blockchainService.connect();
    const network = gateway.getNetwork(config.fabric.channel.name);
    const contract = network.getContract(config.fabric.chaincode.name);
    try {
      const resultBytes = await contract.evaluateTransaction(
        "GetAnimalByOwner",
        `{"selector":{"owner_id": "${ownerId}"} }`
      );
      const resultJson = this.utf8Decoder.decode(resultBytes);
      return JSON.parse(resultJson) as Animal;
    } catch (error) {
      console.log("Error during the animal name update with message: ", error);
      throw error;
    }
  }

  async changeOwner(
    _id: string,
    ownerId: string,
    ownerName: string,
    ownerLastname: string
  ): Promise<string> {
    const gateway = await this.blockchainService.connect();
    const network = gateway.getNetwork(config.fabric.channel.name);
    const contract = network.getContract(config.fabric.chaincode.name);
    try {
      const commit = await contract.submitAsync("ChangeOwner", {
        arguments: [_id, ownerId, ownerLastname, ownerName],
      });
      const resultJson = this.utf8Decoder.decode(commit.getResult());
      console.log(resultJson);
      return commit.getTransactionId();
    } catch (error) {
      console.log("Error during the change of the owner with message: ", error);
      throw error;
    }
  }
}
