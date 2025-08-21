import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, BadRequestException, NotFoundException } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    return await this.projectService.create(createProjectDto, req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    const project = await this.projectService.findOne(+id);
    if (!project) {
      throw new NotFoundException(`Proyecto con id ${id} no encontrado`);
    }

    return project;
  }

  @Get('user/:userId')
  async findProjectByUserId(@Param('userId') userId: string) {
    return await this.projectService.findProjectByUserId(+userId);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Request() req) {
    return this.projectService.update(+id, updateProjectDto, req.user.userId);
  }

}
