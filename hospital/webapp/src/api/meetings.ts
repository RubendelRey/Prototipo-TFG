import { Meeting } from "../model/meeting";
import getApiEndpoint from "./apiEndpoint";

export async function getMeetingsFor(role: string): Promise<Meeting[]> {
  const apiEndPoint = getApiEndpoint();
  let response;
  try {
    response = await fetch(`${apiEndPoint}/meetings/${role}`, {
      credentials: "include",
      mode: "cors",
    });
    if (response.status === 200) {
      let data = await response.json();
      let meetings: Meeting[] = [];
      data.forEach((element: any) => {
        let meeting = new Meeting(
          new Date(element.date),
          element.patient,
          element.doctor
        );
        meeting.setId(element.id);
        meetings.push(meeting);
      });
      return meetings;
    } else {
      throw new Error("Meetings not found");
    }
  } catch (error) {
    throw error;
  }
}
