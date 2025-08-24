import "isomorphic-fetch";
import { Client } from "@microsoft/microsoft-graph-client";

export function graphClient(accessToken: string) {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });
}
