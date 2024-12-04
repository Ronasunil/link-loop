import { performance } from 'perf_hooks';

import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';

import { config } from '@utils/config';

class Get {
  health(_req: Request, res: Response) {
<<<<<<< HEAD
    res.status(httpStatus.OK).send(`Instance running on process of ${process.pid} is healthyy`);
=======
    res.status(httpStatus.OK).send(`Instance running on process of ${process.pid} is healthy`);
>>>>>>> stagging
  }

  env(_req: Request, res: Response) {
    res.status(httpStatus.OK).send(config.NODE_ENV);
  }

  private fibonnacci(num: number): number {
    if (num <= 1) return 1;

    return this.fibonnacci(num - 2) + this.fibonnacci(num - 1);
  }

  fib(req: Request, res: Response) {
    const { num } = req.params as { num: string };
    const number = +num;

    const start = performance.now();
    const result = this.fibonnacci(number);
    const end = performance.now();

    res
      .status(httpStatus.OK)
      .send(`Result is ${result} and it took almost ${end - start}ms in this process:${process.pid}`);
  }
}

export const get = new Get();
