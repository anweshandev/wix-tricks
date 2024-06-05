import { Permissions, webMethod } from "wix-web-module";

import { publish } from "wix-realtime-backend";

export const authenticate = webMethod(Permissions.Anyone, (memberId, sessionId, formFactor = "Desktop") => {
      let channel = { "name": "members" };
      console.log({
        memberId,
        sessionId,
        formFactor,
        channel
      });
      return publish(channel, {
          auth: true,
          sessionId,
          memberId,
          formFactor
      }).then( () => true).catch(() => false);
});