import {Express} from "express";
import {HTTP_STATUSES} from "@/shared/constants/httpStatuses";
import {REGEXPS} from "@/shared/constants/regexps";
import {runAppForTests} from "../utils/runAppForTests";
import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from "@/shared/constants/paginationAndSorting";
import {USERS_ROUTER_PATH} from "@/shared/constants/routersPaths";
import {usersTestManager} from "../utils/testManagers/usersTestManager";
import {UserInputDataModel, UserOutputDataModel} from "@/modules/users/models/usersModels";
import {authTestManager} from "../utils/testManagers/authTestManager";
import {LoginInputDataModel} from "@/modules/auth/models/authModels";

describe(USERS_ROUTER_PATH, () => {
    const app: Express = runAppForTests();
    const {createNewUser, getAllUsers, deleteUser} = usersTestManager(app);
    const {authByLoginOrEmail} = authTestManager(app);

    let createdNewUser: UserOutputDataModel;

    const correctDataCreateUser: UserInputDataModel = {
        login: "string",
        email: "test@email.com",
        password: "qwerty123",
    }

    const correctAuthDataByLogin: LoginInputDataModel = {
        loginOrEmail: "string",
        password: "qwerty123",
    }

    const correctAuthDataByEmail: LoginInputDataModel = {
        loginOrEmail: "test@email.com",
        password: "qwerty123",
    }

    const expectedResponseCreatedUser: UserOutputDataModel = {
        id: expect.any(String),
        login: "string",
        email: "test@email.com",
        createdAt: expect.stringMatching(REGEXPS.date_ISO),
    }

    it(`✅ Should return ${HTTP_STATUSES.OK} code and empty array`, async () => {
        await getAllUsers();
    });

    it(`✅ Should return ${HTTP_STATUSES.CREATED} code and successfully create user`, async () => {
        const createdUserResponse = await createNewUser(correctDataCreateUser, HTTP_STATUSES.CREATED);

        createdNewUser = createdUserResponse.body;

        expect(createdNewUser).toEqual(expectedResponseCreatedUser);

        const allBlogs = await getAllUsers();
        expect(allBlogs.body).toEqual({
            pagesCount: 1,
            page: DEFAULT_PAGE_NUMBER,
            pageSize: DEFAULT_PAGE_SIZE,
            totalCount: 1,
            items: [expectedResponseCreatedUser],
        });
    });

    it(`✅ Should return ${HTTP_STATUSES.NO_CONTENT} code (login)`, async () => {
        await authByLoginOrEmail(correctAuthDataByLogin, HTTP_STATUSES.NO_CONTENT);
        await authByLoginOrEmail(correctAuthDataByEmail, HTTP_STATUSES.NO_CONTENT);
    });

    it(`✅ Should return ${HTTP_STATUSES.NO_CONTENT} code and delete blog (return empty items array)`, async () => {
        await deleteUser(createdNewUser.id);

        const allBlogs = await getAllUsers();

        expect(allBlogs.body).toEqual({
            page: DEFAULT_PAGE_NUMBER,
            pageSize: DEFAULT_PAGE_SIZE,
            pagesCount: 0,
            totalCount: 0,
            items: [],
        });
    });
});