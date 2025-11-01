import {Response} from "express";
import type {RequestWithBodyModel} from "@/shared/models";
import {HTTP_STATUSES} from "@/shared/constants/httpStatuses";
import type {UserInputDataModel, UserOutputDataModel} from "@/modules/users/models/usersModels";
import {usersService} from "@/modules/users/application/usersService";
import {usersQueryRepository} from "@/modules/users/repository/usersQueryRepository";

export const createUserHandler = async (
    req: RequestWithBodyModel<UserInputDataModel>,
    res: Response<UserOutputDataModel>,
) => {
    const insertedId: string = await usersService.create(req.body);

    const createdUser = await usersQueryRepository.findById(insertedId);

    res.status(HTTP_STATUSES.CREATED).json(<UserOutputDataModel>createdUser);
}