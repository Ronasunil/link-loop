import { Request, Response } from 'express';

import httpStatus from 'http-status-codes';

class Signout {
  delete(req: Request, res: Response) {
    req.session = null;

    res.status(httpStatus.NO_CONTENT).json({});
  }
}

export const signout = new Signout();
