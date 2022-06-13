import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as createRedisStore from 'connect-redis';
import * as passport from 'passport';
import * as session from 'express-session';
import { createClient } from 'redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const RedisStore = createRedisStore(session);
  const redisHost: string = process.env.REDIS_HOST
  const redisPort: number = Number(process.env.REDIS_PORT);
  const redisClient = createClient({
    host: redisHost,
    port: redisPort,
  });
  redisClient.on('error', (err) =>
    Logger.error('Could not establish a connection with redis. ' + err)
  );
  redisClient.on('connect', () =>
    Logger.verbose('Connected to redis successfully')
  );
  app.use(
    session({
      store: new RedisStore({ client: redisClient as any }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'strict',
        secure: false,
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3000);
}
bootstrap();
