import { getUrlAll, Thing } from "@inrupt/solid-client";
import { FOAF } from "@inrupt/vocab-common-rdf";
import { User } from "../model/user";
import { Session } from "@inrupt/solid-client-authn-browser";
import { getProfile, getUser } from "./solidProfile";

export async function getFriends(session: Session): Promise<User[]> {
  if (session.info.webId === undefined) {
    throw new Error("The user is not logged in");
  }
  let profile: Thing = await getProfile(session, session.info.webId);

  let webIds: string[] = getUrlAll(profile, FOAF.knows);

  let friends: User[] = [];

  for (let f in webIds) {
    let user: User = await getUser(session, webIds[f]);
    friends.push(user);
  }

  return friends;
}
