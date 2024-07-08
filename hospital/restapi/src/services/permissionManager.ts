import { getSessionFromStorage } from "@inrupt/solid-client-authn-node";
import { universalAccess } from "@inrupt/solid-client";
import config from "../resources/config.json";

export class PermissionManager {
  private static adminPod: string = config.adminPod;

  public static async giveReadPermission(sessionId: string, resource: string) {
    let session = await getSessionFromStorage(sessionId);

    if (session == undefined) {
      throw new Error("The user must be logged in.");
    }

    await universalAccess.setAgentAccess(
      resource,
      this.adminPod,
      {
        read: true,
      },
      { fetch: session.fetch }
    );
  }
}
