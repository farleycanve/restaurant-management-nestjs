import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection as MongooseConnection } from 'mongoose';
import { mongooseToJson } from './common/mongoosePlugins/toJson';
import { RestaurantModule } from './core/restaurant/restaurant.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
