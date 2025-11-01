import {Response} from "express";
import {HTTP_STATUSES} from "@/shared/constants/httpStatuses";
import type {RequestWithQueryParamsModel} from "@/shared/models";
import {withDefaultQueryParams} from "@/modules/users/features/withDefaultQueryParams";
import {usersQueryRepository} from "@/modules/users/repository/usersQueryRepository";
import type {UserInputQueryModel, UsersOutputWithPaginationModel, UsersQueryModel} from "@/modules/users/models/usersModels";

export const getUsersListHandler = async (
    req: RequestWithQueryParamsModel<UserInputQueryModel>,
    res: Response<UsersOutputWithPaginationModel>
) => {
    const queryParams: UsersQueryModel = withDefaultQueryParams(req.query);

    const usersList: UsersOutputWithPaginationModel = await usersQueryRepository.findMany(queryParams);

    res
        .status(HTTP_STATUSES.OK)
        .json(usersList);
}