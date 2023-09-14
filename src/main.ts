import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

import { ConfigService } from './config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const validationPipe = new ValidationPipe({
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  });

  app.enableCors({
    credentials: configService.get('CORS_CREDENTIALS'),
    origin: configService.get('CORS_ORIGIN'),
  });

  app.use(cookieParser());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  if (configService.get('SWAGGER_MODULE')) {
    const config = new DocumentBuilder()
      .setVersion(configService.get('npm_package_version'))
      .setTitle(configService.get('npm_package_name'))
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/v1', app, document);
  }

  return app
    .useGlobalPipes(validationPipe)
    .listen(process.env.PORT || configService.get('PORT'), configService.get('HOST'));
}
bootstrap();
