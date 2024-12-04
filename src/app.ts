// remote imports
import { Application, json, urlencoded, Request, Response, NextFunction } from 'express';

import httpStatus from 'http-status-codes';
import cookieSession from 'cookie-session';
import compression from 'compression';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';

// local imports
import { config } from '@utils/config';
import { CustomError } from '@global/helpers/errorHandler';
import { routes } from '@utils/routes';

export class App {
  constructor(public app: Application) {
    this.start();
  }

  get application(): Application {
    return this.app;
  }

  public start(): void {
    this.standardMiddlewares(this.app);
    this.securityMiddlewares(this.app);
    this.globalMiddlewares(this.app);
    this.routeMiddlewares(this.app);
    this.errorHandler(this.app);
  }

  private standardMiddlewares(app: Application): void {
    app.use(json({ limit: '10mb' }));
    app.use(urlencoded({ extended: false, limit: '10mb' }));
    app.use(compression());

    // prettier-ignore
    app.use(cookieSession({ name: "session", keys: [config.SESSION_SECRET!], maxAge: 24 * 30 * 3600000, secure: false }));
  }

  private securityMiddlewares(app: Application): void {
    app.use(helmet());
    app.use(hpp());

    // prettier-ignore
    app.use(cors({origin:"http://localhost:5173", credentials:true , methods:["GET", "PATCH", "POST", "OPTIONS", "DELETE"]}));
  }

  private globalMiddlewares(app: Application): void {}

  private routeMiddlewares(app: Application): void {
    routes(app);
  }

  private errorHandler(app: Application): void {
    app.all('*', (req: Request, res: Response) => {
      res.status(httpStatus.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
    });

    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      if (error instanceof CustomError) return res.status(error.statusCode).json(error.serializeError());
      console.log(error);
      res.status(520).json([{ message: 'Unknown error', status: 'error', statusCode: 520 }]);
    });
  }
}
