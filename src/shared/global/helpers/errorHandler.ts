import httpStatus, { StatusCodes } from 'http-status-codes';

export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract status: string;

  constructor(msg: string) {
    super(msg);
  }

  abstract serializeError(): {
    message: string;
    status: string;
    statusCode: number;
    path?: string;
  }[];
}

class BadRequestError extends CustomError {
  statusCode = httpStatus.BAD_REQUEST;
  status = 'error';

  constructor(msg: string) {
    super(msg);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeError() {
    return [
      {
        message: this.message,
        status: this.status,
        statusCode: this.statusCode,
      },
    ];
  }
}

class NotAuthorizedError extends CustomError {
  statusCode = httpStatus.UNAUTHORIZED;
  status = 'error';

  constructor(msg: string) {
    super(msg);

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeError() {
    return [
      {
        message: this.message,
        status: this.status,
        statusCode: this.statusCode,
      },
    ];
  }
}
