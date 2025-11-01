import {ADMIN_PASSWORD, ADMIN_USERNAME} from "../../src/shared/middlewares/auth/basicAuthGuardMiddleware";

export function generateBasicAuthToken() {
  const credentials = `${ADMIN_USERNAME}:${ADMIN_PASSWORD}`;
  const token = Buffer.from(credentials).toString('base64');
  return `Basic ${token}`;
}
