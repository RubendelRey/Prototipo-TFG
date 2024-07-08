import { Collection, Document } from "mongodb";

export class MongoUtil {
  static async getCollection(
    mongoClient: any,
    collectionName: string
  ): Promise<Collection<Document>> {
    await mongoClient.connect();
    const database = mongoClient.db("hospital");
    const collection = database.collection(collectionName);
    return collection;
  }
}
