import { Object, Property } from "fabric-contract-api";

@Object()
export class Animal {
  @Property()
  public docType?: string;

  @Property()
  public ID: string;

  @Property()
  public name: string;

  @Property()
  public type: string;

  @Property()
  public bread: string;

  @Property()
  public birthDate: string;

  @Property()
  public description: string;

  @Property()
  public peedigree: string;

  @Property()
  public owner: Owner;
}

@Object()
export class Owner {
  @Property()
  public docType?: string;

  @Property()
  public ownerId: string;

  @Property()
  public oName: string;

  @Property()
  public oLastname: string;
}
