import './services/dependency-injection';
import Koa from 'koa';
import { bodyParser } from '@koa/bodyparser';
import * as cors from '@koa/cors';
import initMainRouter from './main.routing';
import sseMiddleware from './sse.middleware';
import * as dotenv from 'dotenv';
import * as chalk from 'chalk';
dotenv.config();

const app = new Koa();
const port = Number(process.env.SERVER_PORT ?? 8080);
const host = process.env.SERVER_HOST ?? '0.0.0.0';
const mainRouter = initMainRouter();

app
  .use(cors())
  .use(bodyParser())
  .use(mainRouter.allowedMethods())
  .use(mainRouter.routes())
  .use(sseMiddleware);

const server = app.listen(Number(port), host, undefined, async () => {
  console.log(chalk.cyan('🐳 Server started! '), server.address());
});
