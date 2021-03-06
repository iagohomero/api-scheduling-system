import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import routes from './routes';
import './database';
import sentryConfig from './config/sentry';

class App {
  constructor() {
    this.server = express();
    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exception();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exception() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.APP_ENV === 'local') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal error' });
    });
  }
}

export default new App().server;
