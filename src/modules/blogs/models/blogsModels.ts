import type {ISO8601StringModel, WithPaginationModel} from "@/shared/models";
import {ParsedQs} from "qs";
import {SortDirectionType} from "@/shared/constants/sortDirection";

export interface BlogInputDataModel {
    name: string
    description: string
    websiteUrl: string
}

export interface BlogModel extends BlogInputDataModel {
    createdAt: ISO8601StringModel
    isMembership: boolean
}

export interface BlogOutputDataModel extends BlogModel {
    id: string
}

export interface BlogInputQueryModel extends ParsedQs {
    searchNameTerm: string
    sortBy: string
    sortDirection: SortDirectionType
    pageNumber: string
    pageSize: string
}

export interface BlogQueryModel {
    searchNameTerm: string
    sortBy: string
    sortDirection: SortDirectionType
    pageNumber: number
    pageSize: number
}

export interface BlogsOutputWithPaginationModel extends WithPaginationModel<BlogOutputDataModel> {}