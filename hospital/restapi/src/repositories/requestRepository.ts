import { BaseRepository } from "./baseRepository";
import { Request } from "../model/request";

export class RequestRepository extends BaseRepository {
  constructor(mongoClient: any) {
    super(mongoClient, "requests");
  }

  public async createRequest(request: Request): Promise<string> {
    await super.insertOne(request);
    return request.getId();
  }

  public async getRequests(filter: any): Promise<Request[]> {
    const result = await super.find(filter);

    let requests: Request[] = [];
    result.forEach((element: any) => {
      let request: Request = new Request(
        element.patient,
        element.resource,
        element.shape
      );

      request.setId(element._id);
      requests.push(request);
      request.setCompleted(element.completed);
    });

    return requests;
  }

  async getRequest(filter: any): Promise<Request> {
    const result = await super.findOne(filter);

    let request: Request = new Request(
      result.patient,
      result.resource,
      result.shape
    );

    request.setId(result._id);
    request.setCompleted(result.completed);

    return request;
  }

  async updateRequest(filter: any, update: any): Promise<void> {
    await super.updateOne(filter, update);
  }
}
