import { MiddlewareConsumer, Module, NestModule, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection as MongooseConnection } from 'mongoose';
import { mongooseToJson } from './common/mongoosePlugins/toJson';
import { RestaurantModule } from './core/restaurant/restaurant.module';
import { AuthModule } from './core/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, RolesGuard } from 'core/auth/guards';
import { LoggerMiddleware } from 'middleware/logger.middleware';

const provideGlobalGuards = [
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },

  {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },
];
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        autoIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectionFactory: (connection: MongooseConnection) => {
          // Global plugins
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          connection.plugin(require('mongoose-unique-validator'));
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          connection.plugin(require('mongoose-paginate-v2'));
          connection.plugin(mongooseToJson);
          connection.on('connected', async () => {
            console.log('Database connected');
          });
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    RestaurantModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger, ...provideGlobalGuards],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // Apply the LoggerMiddleware to all routes
  }
}
