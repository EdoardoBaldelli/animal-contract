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
}

@Object()
export class Owner {
  @Property()
  public docType?: string;

  @Property()
  public Id: string;

  @Property()
  public Name: string;

  @Property()
  public Surname: string;
}
