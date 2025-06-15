// @ts-ignore
import request from 'supertest';
import {TypeHttpStatus} from "../../../src/shared/constants/httpStatuses";
import {Express} from "express";
import {AUTH_ROUTER_PATH} from "../../../src/shared/constants/routersPaths";
import {LoginInputDataModel} from "../../../src/modules/auth/models/authModels";

export const authTestManager = (app: Express) => {
    return {
        authByLoginOrEmail: async (
            data: LoginInputDataModel,
            expectedHttpStatus: TypeHttpStatus,
        ) => {
            return await request(app)
                .post(`${AUTH_ROUTER_PATH}/login`)
                .send(data)
                .expect(expectedHttpStatus);
        },
    };
};