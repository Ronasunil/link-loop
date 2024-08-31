import httpStatus, { StatusCodes } from 'http-status-codes';
import { ValidationError } from 'joi';

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

export class BadRequestError extends CustomError {
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

export class NotAuthorizedError extends CustomError {
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

export class JoiValidationFailed extends CustomError {
  statusCode = httpStatus.BAD_REQUEST;
  status = 'error';

  constructor(public details: ValidationError) {
    super(details.message);
  }

  serializeError() {
    return this.details.details.map((error) => ({
      message: error.message,
      status: this.status,
      statusCode: this.statusCode,
      path: String(error.path),
    }));
  }
}

export class NotFoundError extends CustomError {
  statusCode = 404;
  status = 'erorr';
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeError(): { message: string; status: string; statusCode: number; path?: string }[] {
    return [{ message: this.message, status: this.status, statusCode: this.statusCode }];
  }
}
