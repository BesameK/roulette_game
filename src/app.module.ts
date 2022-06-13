import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BetModule } from './modules/bet/bet.module';

@Module({
  imports: [BetModule,ConfigModule.forRoot(),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
