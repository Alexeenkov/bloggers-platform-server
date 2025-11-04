import {Response} from "express";
import type {RequestWithBodyModel} from "../../../../shared/models";
import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";
import type {UserInputDataModel, UserOutputDataModel} from "../../models/usersModels";
import {usersService} from "../../application/usersService";
import {usersQueryRepository} from "../../repository/usersQueryRepository";

export const createUserHandler = async (
    req: RequestWithBodyModel<UserInputDataModel>,
    res: Response<UserOutputDataModel>,
) => {
    const createdUser: UserOutputDataModel = await usersService.create(req.body);

    res.status(HTTP_STATUSES.CREATED).json(createdUser);
}