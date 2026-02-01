export interface LoginInputDataModel {
    loginOrEmail: string
    password: string
}

export interface AccessTokenResponseModel {
    accessToken: string | null
}