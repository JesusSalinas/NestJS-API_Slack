import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SlackModule } from './slack/slack.module';
import { ConfigModule } from '@nestjs/config';
import global from 'config/global';

@Module({
  imports: [
    SlackModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [global],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
