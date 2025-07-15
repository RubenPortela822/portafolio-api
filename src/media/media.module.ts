import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMedia } from './entities/user-media.entity';

@Module({
  controllers: [MediaController],
  providers: [MediaService],
  imports:[
    TypeOrmModule.forFeature([UserMedia]),
    UserModule
  ]
})
export class MediaModule { }
