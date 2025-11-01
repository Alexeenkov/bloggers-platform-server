import {
    DEFAULT_PAGE_NUMBER,
    DEFAULT_PAGE_SIZE,
    DEFAULT_SORT_BY,
    DEFAULT_SORT_DIRECTION,
} from "@/shared/constants/paginationAndSorting";
import {SORT_DIRECTION} from "@/shared/constants/sortDirection";
import {PostInputQueryModel, PostQueryModel} from "@/modules/posts/models/postsModels";


export function withDefaultQueryParams(query: PostInputQueryModel): PostQueryModel {
    return {
        pageNumber: query.pageNumber ? +query.pageNumber : DEFAULT_PAGE_NUMBER,
        pageSize: query.pageSize ? +query.pageSize : DEFAULT_PAGE_SIZE,
        sortBy: query.sortBy ? query.sortBy : DEFAULT_SORT_BY,
        sortDirection: query.sortDirection && SORT_DIRECTION[query.sortDirection] ? query.sortDirection : DEFAULT_SORT_DIRECTION,
    };
}