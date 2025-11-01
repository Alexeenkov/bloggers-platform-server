import {TypeHttpStatus} from "../constants/httpStatuses";

export class CustomError extends Error {
    public statusCode: TypeHttpStatus;
    public field: string;

    constructor(field: string, message: string, statusCode: TypeHttpStatus) {
        super(message);

        this.statusCode = statusCode;
        this.field = field;
    };
}