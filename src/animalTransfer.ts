/*
 * SPDX-License-Identifier: Apache-2.0
 */
// Deterministic JSON.stringify()
import {
  Context,
  Contract,
  Info,
  Returns,
  Transaction,
} from "fabric-contract-api";
import stringify from "json-stringify-deterministic";
import sortKeysRecursive from "sort-keys-recursive";
import { Animal, Owner } from "./animal";

@Info({
  title: "AniamlTransfer",
  description: "Smart contract for trading assets",
})
export class AnimalContract extends Contract {
  @Transaction()
  public async InitLedger(ctx: Context): Promise<void> {}

  @Transaction()
  public async CreateAnimal(
    ctx: Context,
    id: string,
    name: string,
    type: string,
    bread: string,
    birthDate: string,
    description: string,
    peedigree: string,
    Id: string,
    oName: string,
    oLastname: string
  ) {
    const exist = await this.AnimalExist(ctx, id);
    if (exist) {
      throw new Error(`the animal ${id} already exists`);
    }
    const animal = {
      ID: id,
      name: name,
      type: type,
      bread: bread,
      birthDate: birthDate,
      description: description,
      peedigree: peedigree,
      Id: Id,
      oName: oName,
      oLastname: oLastname,
    };

    await ctx.stub.putState(
      id,
      Buffer.from(stringify(sortKeysRecursive(animal)))
    );
  }

  @Transaction()
  public async UpdateAnimalName(
    ctx: Context,
    id: string,
    newName: string
  ): Promise<void> {
    const exists = await this.AnimalExist(ctx, id);
    if (!exists) {
      throw new Error(`The animal ${id} does not exist`);
    }
    const animalString = await this.ReadAnimal(ctx, id);
    const animal = JSON.parse(animalString) as Animal;
    animal.name = newName;

    return ctx.stub.putState(id, Buffer.from(stringify(animal)));
  }

  @Transaction(false)
  public async ReadAnimal(ctx: Context, id: string): Promise<string> {
    const animalJSON = await ctx.stub.getState(id);
    if (!animalJSON || animalJSON.length === 0) {
      throw new Error(`The animal ${id} does not exist`);
    }
    return animalJSON.toString();
  }

  @Transaction(false)
  @Returns("boolean")
  public async AnimalExist(ctx: Context, id: string): Promise<boolean> {
    const animalJSON = await ctx.stub.getState(id);
    return animalJSON && animalJSON.length > 0;
  }

  @Transaction()
  public async UpdateAnimal(
    ctx: Context,
    id: string,
    name: string,
    type: string,
    bread: string,
    birthDate: string,
    description: string,
    peedigree: boolean,
    Id: string,
    oName: string,
    oLastname: string
  ): Promise<void> {
    const exists = await this.AnimalExist(ctx, id);
    if (!exists) {
      throw new Error(`The animal ${id} does not exist`);
    }

    const updatedAnimal = {
      ID: id,
      name: name,
      type: type,
      bread: bread,
      birthDate: birthDate,
      description: description,
      peedigree: peedigree,
      Id: Id,
      oName: oName,
      oLastname: oLastname,
    };

    return ctx.stub.putState(
      id,
      Buffer.from(stringify(sortKeysRecursive(updatedAnimal)))
    );
  }

  @Transaction()
  public async DeleteAnimal(ctx: Context, id: string): Promise<void> {
    const exists = await this.AnimalExist(ctx, id);
    if (!exists) {
      throw new Error(`The animal ${id} does not exist`);
    }
    return ctx.stub.deleteState(id);
  }

  @Transaction(false)
  @Returns("string")
  public async GetAllAnimals(ctx: Context): Promise<string> {
    const allResults = [];
    const iterator = await ctx.stub.getStateByRange("", "");
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        "utf8"
      );
      let record;
      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.log(err);
        record = strValue;
      }
      allResults.push(record);
      result = await iterator.next();
    }
    return JSON.stringify(allResults);
  }

  @Transaction(false)
  public async GetAnimalHistory(ctx: Context, id: string) {
    let resultsIterator = await ctx.stub.getHistoryForKey(id);
    let results = await this._GetAllResults(resultsIterator, true);

    return JSON.stringify(results);
  }

  public async _GetAllResults(iterator, isHistory) {
    let allResults = [];
    let res = await iterator.next();
    while (!res.done) {
      if (res.value && res.value.value.toString()) {
        let jsonRes: any = {};
        console.log(res.value.value.toString("utf8"));
        if (isHistory && isHistory === true) {
          jsonRes.TxId = res.value.txId;
          jsonRes.Timestamp = res.value.timestamp;
          try {
            jsonRes.Value = JSON.parse(res.value.value.toString("utf8"));
          } catch (err) {
            console.log(err);
            jsonRes.Value = res.value.value.toString("utf8");
          }
        } else {
          jsonRes.Key = res.value.key;
          try {
            jsonRes.Record = JSON.parse(res.value.value.toString("utf8"));
          } catch (err) {
            console.log(err);
            jsonRes.Record = res.value.value.toString("utf8");
          }
        }
        allResults.push(jsonRes);
      }
      res = await iterator.next();
    }
    iterator.close();
    return allResults;
  }

  @Transaction(false)
  public async GetAnimalByName(ctx: Context, name: string): Promise<string> {
    const allResults = [];
    const iterator = await ctx.stub.getQueryResult(name);
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        "utf8"
      );
      let record;
      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.log(err);
        record = strValue;
      }
      allResults.push(record);
      result = await iterator.next();
    }
    return JSON.stringify(allResults);
  }

  @Transaction(false)
  public async GetAnimalByOwner(
    ctx: Context,
    ownerId: string
  ): Promise<string> {
    const allResults = [];

    const iterator = await ctx.stub.getQueryResult(ownerId);
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        "utf8"
      );
      let record;
      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.log(err);
        record = strValue;
      }
      allResults.push(record);
      result = await iterator.next();
    }
    return JSON.stringify(allResults);
  }

  @Transaction()
  public async ChangeOwner(
    ctx: Context,
    id: string,
    newId: string,
    newOwName: string,
    newOwLastname: string
  ): Promise<void> {
    const exists = await this.AnimalExist(ctx, id);
    if (!exists) {
      throw new Error(`The animal ${id} does not exist`);
    }

    const updatedOwner: Owner = {
      ownerId: newId,
      oName: newOwName,
      oLastname: newOwLastname,
    };

    return ctx.stub.putState(id, Buffer.from(stringify(updatedOwner)));
  }
}
