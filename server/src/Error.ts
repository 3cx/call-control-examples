import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from './constants'

export class AppError extends Error {
    errorCode: number
    constructor(name: string, msg: string, code: number) {
        super()
        this.name = name
        this.message = msg
        this.errorCode = code
    }
}

export class BadRequest extends AppError {
    constructor(msg: string) {
        super(BAD_REQUEST, msg, 400)
    }
}

export class NotFound extends AppError {
    constructor(msg: string) {
        super(NOT_FOUND, msg, 404)
    }
}

export class InternalServerError extends AppError {
    constructor(msg: string) {
        super(INTERNAL_SERVER_ERROR, msg, 500)
    }
}
