export interface LoginInputDataModel {
    loginOrEmail: string
    password: string
}

export interface AccessTokenResponseModel {
    accessToken: string | null
}

export interface RegistrationInputDataModel {
    login: string
    email: string
    password: string
}