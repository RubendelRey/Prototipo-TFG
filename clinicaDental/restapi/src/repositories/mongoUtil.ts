import { Collection, Document } from "mongodb";

export class MongoUtil {
  static async getCollection(
    mongoClient: any,
    collectionName: string
  ): Promise<Collection<Document>> {
    await mongoClient.connect();
    const database = mongoClient.db("clinicadental");
    const collection = database.collection(collectionName);
    return collection;
  }
}
