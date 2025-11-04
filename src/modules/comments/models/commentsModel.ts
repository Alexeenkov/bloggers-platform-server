import type {ISO8601StringModel} from "../../../shared/models/ISO8601StringModel";
import {SortDirectionType} from "../../../shared/constants/sortDirection";
import type {ParsedQs} from "qs";

export interface CommentatorInfoModel {
    userId: string,
    userLogin: string
}

export interface CommentModel {
    content: string,
    commentatorInfo: CommentatorInfoModel,
    createdAt: ISO8601StringModel
}

export interface CommentOutputDataModel extends CommentModel {
    id: string
}

export interface CommentInputDataModel {
    content: string
    commentatorInfo: CommentatorInfoModel
}

export interface CommentInputQueryModel extends ParsedQs {
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: SortDirectionType
}

export interface CommentQueryModel {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirectionType
}

export interface CommentsOutputWithPaginationModel {
    page: number
    pageSize: number
    pagesCount: number
    totalCount: number
    items: CommentOutputDataModel[]
}

export interface CommentDBModel {
    _id: string;
    postId: string;
    content: string;
    commentatorInfo: CommentatorInfoModel;
    createdAt: ISO8601StringModel;
}