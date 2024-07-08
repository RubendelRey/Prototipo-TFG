import { Meeting } from "../model/meeting";
import { BaseRepository } from "./baseRepository";

export class MeetingRepository extends BaseRepository {
  constructor(mongoClient: any) {
    super(mongoClient, "meetings");
  }

  public async createMeeting(meeting: any): Promise<string> {
    await super.insertOne(meeting);
    return meeting.getId();
  }

  public async getMeetings(filter: any): Promise<Meeting[]> {
    const result = await super.find(filter);

    let meetings: Meeting[] = [];
    result.forEach((element: any) => {
      let meeting: Meeting = new Meeting(
        element.date,
        element.patient,
        element.doctor
      );
      meetings.push(meeting);
    });

    return meetings;
  }
}
