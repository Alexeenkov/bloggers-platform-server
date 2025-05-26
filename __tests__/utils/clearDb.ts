// @ts-ignore
import request from 'supertest';
import { Express } from 'express';
import {TESTING_ROUTER_PATH} from "../../src/testing/constants/testingRouterPath";
import {HTTP_STATUSES} from "../../src/shared/constants/httpStatuses";

export async function clearDb(app: Express) {
  await request(app)
    .delete(`${TESTING_ROUTER_PATH}/all-data`)
    .expect(HTTP_STATUSES.NO_CONTENT);

  return;
}
