import { H3Event } from "h3";

import {
  App,
  getApps,
  initializeApp,
  applicationDefault,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const useFirebase = () => {
  let app: App;
  if (!getApps().length) {
    app = initializeApp({
      credential: applicationDefault(),
    });
  } else {
    [app] = getApps();
  }

  const auth = getAuth(app);

  return {
    app,
    auth,
  };
};

export const authenticateRequest = async (event: H3Event) => {
  const { auth } = useFirebase();

  const sessCookie = getCookie(event, "__session");
  if (sessCookie) {
    try {
      const decodedUser = await auth.verifySessionCookie(sessCookie);

      return decodedUser;
    } catch (error) {
      console.log("failed to authenticate request", error);
    }
  }

  return null;
};
