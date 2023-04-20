import { AnimalContractServiceInterface } from "./interface/AnimalContractServiceInterface";
import { Animal } from "./entity";
import { BlockchainServiceInterface } from "../fabric/interface/BlockchainServiceInterface";
import { getBlockchainService } from "../common/ServiceFactory";
import config from "../../config/Config";
import { TextDecoder } from "util";
import { Any } from "typeorm";

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

  async updateAnimalName(id: string, name: string): Promise<string> {
    const gateway = await this.blockchainService.connect();
    const network = gateway.getNetwork(config.fabric.channel.name);
    const contract = network.getContract(config.fabric.chaincode.name);
    try {
      const commit = await contract.submitAsync("UpdateAnimalName", {
        arguments: [id, name],
      });
      const resultJson = this.utf8Decoder.decode(commit.getResult());

      return commit.getTransactionId();
    } catch (error) {
      console.log("Error during the animal name update with message: ", error);
      throw error;
    }
  }

  async updateAnimal(id: string, animal: Animal): Promise<string> {
    const gateway = await this.blockchainService.connect();
    const network = gateway.getNetwork(config.fabric.channel.name);
    const contract = network.getContract(config.fabric.chaincode.name);
    try {
      const commit = await contract.submitAsync(`UpdateAnimal`, {
        arguments: [id, String(animal)],
      });
      const resultJson = this.utf8Decoder.decode(commit.getResult());

      return commit.getTransactionId();
    } catch (error) {
      console.log("Errore durante l update dell animale", error);
      throw error;
    }
  }

  async deleteAnimal(id: string): Promise<void> {
    const gateway = await this.blockchainService.connect();
    const network = gateway.getNetwork(config.fabric.channel.name);
    const contract = network.getContract(config.fabric.chaincode.name);
    try {
      const commit = await contract.submitAsync(`DeleteAnimal`, {
        arguments: [id],
      });
    } catch (error) {
      console.log("erorre durante la delete", error);
      throw error;
    }
  }

  async getAllAnimals(): Promise<string> {
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

  async readAnimal(id: string): Promise<string> {
    const gateway = await this.blockchainService.connect();
    const network = gateway.getNetwork(config.fabric.channel.name);
    const contract = network.getContract(config.fabric.chaincode.name);
    try {
      const commit = await contract.submitAsync(`ReadAnimal`, {
        arguments: [id],
      });
      const resultJson = this.utf8Decoder.decode(commit.getResult());
      return commit.getTransactionId();
    } catch (error) {
      console.log("Errore durante la lettura dell animale", error);
      throw error;
    }
  }

  async animalExist(id: string): Promise<string> {
    const gateway = await this.blockchainService.connect();
    const network = gateway.getNetwork(config.fabric.channel.name);
    const contract = network.getContract(config.fabric.chaincode.name);
    try {
      const commit = await contract.submitAsync(`AnimalExist`, {
        arguments: [id],
      });
      const resultJson = this.utf8Decoder.decode(commit.getResult());
      return commit.getTransactionId();
    } catch (error) {
      console.log("Errore durante la visione dell esistenza ", error);
      throw error;
    }
  }

  async animalHistory(id: string): Promise<string> {
    const gateway = await this.blockchainService.connect();
    const network = gateway.getNetwork(config.fabric.channel.name);
    const contract = network.getContract(config.fabric.chaincode.name);
    try {
      const resultBytes = await contract.evaluateTransaction(
        "GetAnimalHistory",
        id
      );
      const resultJson = this.utf8Decoder.decode(resultBytes);
      return JSON.stringify(JSON.parse(resultJson));
    } catch (error) {
      console.log("Error during the animal name update with message: ", error);
      throw error;
    }
  }
}
