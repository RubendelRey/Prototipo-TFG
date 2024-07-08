import { MongoUtil } from "./mongoUtil";
import { v4 as uuid } from "uuid";

export class BaseRepository {
  private mongoClient: any;
  private collection: string;

  constructor(mongoClient: any, collection: string) {
    this.mongoClient = mongoClient;
    this.collection = collection;
  }

  async insertOne(entity: any): Promise<string> {
    const collection = await MongoUtil.getCollection(
      this.mongoClient,
      this.collection
    );
    entity._id = uuid();
    return (await collection.insertOne(entity)).insertedId.toString();
  }

  async find(filter: any): Promise<any[]> {
    const collection = await MongoUtil.getCollection(
      this.mongoClient,
      this.collection
    );
    return await collection.find(filter).toArray();
  }

  async findOne(filter: any): Promise<any> {
    const collection = await MongoUtil.getCollection(
      this.mongoClient,
      this.collection
    );
    return await collection.findOne(filter);
  }

  async deleteAll() {
    const collection = await MongoUtil.getCollection(
      this.mongoClient,
      this.collection
    );
    await collection.deleteMany({});
  }

  async updateOne(filter: any, update: any) {
    const collection = await MongoUtil.getCollection(
      this.mongoClient,
      this.collection
    );
    await collection.updateOne(filter, update);
  }
}
