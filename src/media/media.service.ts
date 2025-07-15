import * as fs from 'fs';
import * as path from 'path';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { UserMedia } from './entities/user-media.entity';


@Injectable()
export class MediaService {

  constructor(
    private readonly usersService: UserService,

    @InjectRepository(UserMedia)
    private readonly userMediaRepository: Repository<UserMedia>,
  ) { }

  async saveUserImage(userId: number, file: any) {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (user.imagen) {
      const filePath = path.join(__dirname, '..', '..', user.imagen.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      const imageId = user.imagen.id;
      await this.usersService.assingImage(user, null);
      await this.userMediaRepository.delete(imageId );
    }
    
    const media = this.userMediaRepository.create({
      nombre: file.nombre,
      url: file.url,
      tipo: file.tipo,
      peso: `${Math.round(file.peso / 1024)} KB`,
    });

    await this.userMediaRepository.save(media);

    await this.usersService.assingImage(user, media);

    return media;

  }

}
