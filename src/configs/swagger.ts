import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';

const api_documentation_credentials = {
  name: 'admin',
  pass: 'admin',
};

export function configSwagger(app: INestApplication) {
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 3000;
  const BACKEND_URL = configService.get<string>('BACKEND_URL');
  const env = process.env.NODE_ENV;
  const serverUrl = env === 'beta' ? BACKEND_URL : `http://localhost:${PORT}`;
  const serverDescription = env === 'beta' ? 'Beta server' : 'Local server';

  const config = new DocumentBuilder()
    .setTitle('Interview API')
    .setDescription('RESTful API for use with Interview')
    .setVersion('2.0')
    .addSecurity('token', { type: 'http', scheme: 'bearer' })
    .addServer(serverUrl, serverDescription, {
      port: { default: PORT, description: 'The port of the server' },
    }) // Server variables and templating: https://swagger.io/docs/specification/api-host-and-base-path/
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // Save Swagger spec file
  fs.writeFileSync(
    path.join(__dirname, '../../public/swagger.json'),
    JSON.stringify(document, null, 2),
  );

  const http_adapter = app.getHttpAdapter();
  http_adapter.use(
    '/docs',
    (req: Request, res: Response, next: NextFunction) => {
      function parseAuthHeader(input: string): { name: string; pass: string } {
        const [, encodedPart] = input.split(' ');

        const buff = Buffer.from(encodedPart, 'base64');
        const text = buff.toString('ascii');
        const [name, pass] = text.split(':');

        return { name, pass };
      }

      function unauthorizedResponse(): void {
        if (http_adapter.getType() === 'fastify') {
          res.statusCode = 401;
          res.setHeader('WWW-Authenticate', 'Basic');
        } else {
          res.status(401);
          res.set('WWW-Authenticate', 'Basic');
        }

        next();
      }

      if (!req.headers.authorization) {
        return unauthorizedResponse();
      }

      const credentials = parseAuthHeader(req.headers.authorization);

      if (
        credentials?.name !== api_documentation_credentials.name ||
        credentials?.pass !== api_documentation_credentials.pass
      ) {
        return unauthorizedResponse();
      }

      next();
    },
  );
  if (env === 'beta' || env === 'development') {
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        operationsSorter: 'method',
        tagsSorter: 'alpha',
      },
    });
  }
}
