import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ProjectService {

  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly userService: UserService
  ) { }

  async create(createProjectDto: CreateProjectDto, userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    const project = this.projectRepository.create({ ...createProjectDto, usuario: user });
    return await this.projectRepository.save(project);
  }

  findAll() {
    return `This action returns all project`;
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });
    return project ?? null;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, userId: number) {

    const projectEdit = await this.projectRepository.preload({
      id,
      ...updateProjectDto,
    });

    if (!projectEdit) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    const projectUser = await this.findOne(id);
    if (projectUser?.usuario.id != userId) {
      throw new UnauthorizedException('No se puede editar un proyecto de otro usuario');
    }

    return await this.projectRepository.save(projectEdit);

  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
