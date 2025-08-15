import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { UserMedia } from 'src/media/entities/user-media.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async findByUsername(usuario: string) {
    const user = await this.userRepository.findOne({
      where: { usuario },
      select: ['id', 'usuario', 'password', 'email'],
    });

    return user ?? null;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user ?? null;
  }

  async create(createUserDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return await this.userRepository.save(user);
  }


  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['imagen'],
    });

    return user ?? null;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const {password,...rest} = await this.userRepository.save(user);
    return rest;
  }

  remove(id: number) {
    // #TODO HACER EL ELIMINADO CON LOS PROYECTOS Y BLOGS 
    return `This action removes a #${id} user`;
  }

  async assingImage(user, media: UserMedia | null) {
    user.imagen = media;
    await this.userRepository.save(user);
  }
}
