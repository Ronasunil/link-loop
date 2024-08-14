// remote imports
import {
  Application,
  json,
  urlencoded,
  Request,
  Response,
  NextFunction,
} from 'express';
import http from 'http';
import httpStatus from 'http-status-codes';
import cookieSession from 'cookie-session';
import compression from 'compression';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { Socket, Server as socketServer } from 'socket.io';

// local imports
import { config } from './config';
import { CustomError } from './shared/global/helpers/errorHandler';

export class Server {
  private PORT = config.PORT;

  constructor(public app: Application) {}

  public start(): void {
    this.standardMiddlewares(this.app);
    this.securityMiddlewares(this.app);
    this.globalMiddlewares(this.app);
    this.routeMiddlewares(this.app);
    this.errorHandler(this.app);
    this.startServer(this.app);
  }

  private standardMiddlewares(app: Application): void {
    app.use(json({ limit: '3mb' }));
    app.use(urlencoded({ extended: false, limit: '3mb' }));
    app.use(compression());

    // prettier-ignore
    app.use(cookieSession({ name: "session", keys: [config.SESSION_SECRET!], maxAge: 24 * 30 * 3600000, secure: false }));
  }

  private securityMiddlewares(app: Application): void {
    app.use(helmet());
    app.use(hpp());

    // prettier-ignore
    app.use(cors({origin:"*", credentials:true , methods:["GET", "PATCH", "POST", "OPTIONS", "DELETE"]}));
  }

  private globalMiddlewares(app: Application): void {}

  private routeMiddlewares(app: Application): void {}

  private errorHandler(app: Application): void {
    app.all('*', (req: Request, res: Response) => {
      res
        .status(httpStatus.NOT_FOUND)
        .json({ message: `${req.originalUrl} not found` });
    });

    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      if (error instanceof CustomError)
        return res.status(error.statusCode).json(error.serializeError());

      res
        .status(520)
        .json([{ message: 'Unknown error', status: 'error', statusCode: 520 }]);
    });
  }

  private httpServer(httpServer: http.Server): void {
    httpServer.listen(this.PORT, () => {
      console.log(`Server start listening on port ${this.PORT}`);
    });
  }

  private async createSocketConnection(
    httpServer: http.Server
  ): Promise<socketServer> {
    const io: socketServer = new socketServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      },
    });

    const pubClient = createClient({ url: config.REDIS_CLIENT });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    console.log('connected to redis');

    io.adapter(createAdapter(pubClient, subClient));

    return io;
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer = new http.Server(app);
      this.httpServer(httpServer);
      this.createSocketConnection(httpServer);
    } catch (err) {
      console.error(err);
    }
  }
}
