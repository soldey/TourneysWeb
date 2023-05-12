import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ConfigService } from './config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const validationPipe = new ValidationPipe({
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  });

  app.setGlobalPrefix(configService.get('PREFIX'));

  return app
    .useGlobalPipes(validationPipe)
    .listen(process.env.PORT || configService.get('PORT'), configService.get('HOST'));
}
bootstrap();
