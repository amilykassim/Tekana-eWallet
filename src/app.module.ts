import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserUtils } from './user/user.helper';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService, UserUtils],
})
export class AppModule { }
