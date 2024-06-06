'use strict'

// const StatusCode = {
//     FORBIDDEN: 403,
//     CONFLICT: 409
// }

// const ReasonStatusCode = {
//     FORBIDDEN: 'Bad request error',
//     CONFLICT: 'Conflict error'
// }

const {
    StatusCodes,
    ReasonPhrases
} = require('./httpStatusCode')

// extend nodejs Error class
class ErrorResponse extends Error {

    constructor (message, status) {
        // super() thực thi contructor của lớp cha, từ đó this ở lớp con mới được định nghĩa và có thể sử dụng
        super(message)  
        this.status = status
    }

}

// conflict error
class ConflictRequestError extends ErrorResponse {
    constructor (message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.CONFLICT) {
        super(message, statusCode)
    }
}

// bad request error
class BabRequestError extends ErrorResponse {
    constructor (message = ReasonPhrases.BAD_REQUEST, statusCode = StatusCodes.BAD_REQUEST) {
        super(message, statusCode)
    }
}

class AuthFailureError extends ErrorResponse {
    constructor (message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
        super(message, statusCode)
    }
}

class NotFoundError extends ErrorResponse {
    constructor (message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND) {
        super(message, statusCode)
    }
}

class ForbiddenError extends ErrorResponse {
    constructor (message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN) {
        super(message, statusCode)
    }
}

module.exports = {
    ConflictRequestError,
    BabRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError
}