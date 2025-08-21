import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMedia } from './entities/user-media.entity';
import { ProjectMedia } from './entities/project-media.entity';
import { ProjectModule } from 'src/project/project.module';

@Module({
  controllers: [MediaController],
  providers: [MediaService],
  imports: [
    TypeOrmModule.forFeature([UserMedia, ProjectMedia]),
    UserModule,
    ProjectModule
  ]
})
export class MediaModule { }
