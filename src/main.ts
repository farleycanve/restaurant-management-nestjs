import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';
import { configSwagger } from './configs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('PORT') || 3000;
  app.setGlobalPrefix(configService.get<string>('ROOT'));

  app.enableCors({ origin: true, credentials: true });

  app.useStaticAssets(path.join(__dirname, '..', 'public'));

  /** Global pipes */
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  /** api doc */
  configSwagger(app);

  await app.listen(PORT, () => {
    console.clear();
    console.log(`Server started port ${PORT}`);
  });
}
bootstrap();
