import {Request} from "express";
import {ParamsDictionary} from 'express-serve-static-core';
import {ParsedQs} from 'qs';

export interface RequestWithBodyModel<T> extends Request {
    body: T
}

export interface RequestWithPathParamsModel<T extends ParamsDictionary> extends Request {
    params: T
}

export interface RequestWithQueryParamsModel<T extends ParsedQs> extends Request {
    query: T
}

export interface RequestWithPathAndQueryParamsModel<T extends ParamsDictionary, K extends ParsedQs> extends Request {
    params: T
    query: K
}

export interface RequestWithPathParamsAndBodyModel<T extends ParamsDictionary, K> extends Request {
    params: T
    body: K
}
