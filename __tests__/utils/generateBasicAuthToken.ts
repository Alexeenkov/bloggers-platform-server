import {appConfig} from "../../src/shared/appConfig";

export function generateBasicAuthToken() {
  const credentials = `${appConfig.adminUsername}:${appConfig.adminPassword}`;
  const token = Buffer.from(credentials).toString('base64');
  return `Basic ${token}`;
}
