import {
  getDate,
  getSolidDataset,
  getStringNoLocale,
  getThing,
  getUrl,
  Thing,
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { User } from "../model/user";
import { FOAF, VCARD } from "@inrupt/vocab-common-rdf";

export async function getProfile(session: Session, webId: string) {
  if (session.info.webId === undefined) {
    throw new Error("The user is not logged in");
  }

  webId = webId.split("profile")[0];
  webId += "profile/card#me";

  let myDataset = await getSolidDataset(webId, { fetch: session.fetch });
  const profile = getThing(myDataset, webId) as Thing;
  return profile;
}

export async function getUser(
  session: Session,
  friendWebId?: undefined | string
): Promise<User> {
  if (session.info.webId === undefined) {
    throw new Error("The user is not logged in");
  }

  let webId: string = session.info.webId;

  if (friendWebId !== undefined) {
    webId = friendWebId;
  }
  webId = webId.split("profile")[0] + "profile/card#me";
  let profile = await getProfile(session, webId);

  let name: string | null = getStringNoLocale(profile, FOAF.name) || "No name";
  let photo: string | null = getUrl(profile, VCARD.hasPhoto);
  let organization: string | null = getStringNoLocale(
    profile,
    VCARD.organization_name
  );
  let role: string | null = getStringNoLocale(profile, VCARD.role);
  let address: string | null = getStringNoLocale(profile, VCARD.hasAddress);
  let email: string | null = getStringNoLocale(profile, VCARD.hasEmail);
  let phone: string | null = getStringNoLocale(profile, VCARD.hasTelephone);
  let birthDate: Date | null = getDate(profile, VCARD.bday);
  let notes: string | null = getStringNoLocale(profile, VCARD.note);

  return new User(
    name,
    webId,
    photo,
    organization,
    role,
    address,
    email,
    phone,
    birthDate,
    notes
  );
}
