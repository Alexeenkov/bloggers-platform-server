import type {ISO8601StringModel, WithPaginationModel} from "../../../shared/models";
import {SortDirectionType} from "../../../shared/constants/sortDirection";
import {ParsedQs} from "qs";

export interface UserInputDataModel {
    login: string
    password: string
    email: string
}

export interface UserModel {
    accountData: {
        login: string
        password: string
        email: string
        createdAt: ISO8601StringModel
    }
    emailConfirmation: {
        confirmationCode: string
        expirationDate: ISO8601StringModel
        isConfirmed: boolean
    }
}

export interface UserOutputDataModel {
    id: string
    login: string
    email: string
    createdAt: ISO8601StringModel
}

export interface UsersQueryModel {
    sortBy: string
    sortDirection: SortDirectionType
    pageNumber: number
    pageSize: number
    searchLoginTerm: string
    searchEmailTerm: string
}

export interface UserInputQueryModel extends ParsedQs {
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: SortDirectionType
    searchLoginTerm: string
    searchEmailTerm: string
}

export interface UsersOutputWithPaginationModel extends WithPaginationModel<UserOutputDataModel> { }
