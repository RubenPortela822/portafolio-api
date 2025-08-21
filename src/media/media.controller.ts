import * as fs from 'fs';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Request, UploadedFiles, BadRequestException, } from '@nestjs/common';
import { MediaService } from './media.service';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { v4 as uuidv4 } from 'uuid';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { extname, join } from 'path';
import { diskStorage } from 'multer';
import { ProjectService } from 'src/project/project.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService, private readonly projectService: ProjectService) { }

  @UseGuards(JwtGuard)
  @Post('user-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/users',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const user = req.user as { userId: number };
          const filename = `user-${user.userId}-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|webp|gif)$/)) {
          return cb(new Error('Solo se permiten imágenes (jpeg, png, webp, gif)'), false);
        }
        cb(null, true);
      }
    }),
  )
  async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const ruta = `uploads/users/${file.filename}`;
    return this.mediaService.saveUserImage(req.user.userId, {
      nombre: file.originalname,
      url: ruta,
      tipo: file.mimetype,
      peso: file.size.toString(),
    });

  }


  //#TODO HACER EL AGREGADO DE IMAGENES AL PROYECTO

  @UseGuards(JwtGuard)
  @Post('project-images/:projectId')
  @UseInterceptors(
    FilesInterceptor('images', 20, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const projectId = req.params.projectId;
          const uploadPath = `./uploads/projects/${projectId}`;
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|webp|gif)$/)) {
          return cb(new Error('Solo se permiten imágenes (jpeg, png, webp, gif)'), false);
        }
        cb(null, true);
      }
    }),
  )
  async uploadProjectImages(
    @Param('projectId') projectId: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req
  ) {

    const project = await this.projectService.findOne(projectId);
    if (!project) {
      throw new BadRequestException('El proyecto no existe');
    }

    if (project.media.length + files.length > 20) {
      files.forEach(fileSave => {
        this.mediaService.deleteImagesUploaded(join(__dirname, '..', '..', 'uploads', 'projects', `${projectId}`, fileSave.filename))
      });
      throw new BadRequestException(`No se pueden subir las imagenes, ya tiene ${project.media.length}`);
    }

    const savedImages = await this.mediaService.saveImagesProject(
      project,
      files.map(file => {
        return {
          nombre: file.originalname,
          url: `uploads/projects/${projectId}/${file.filename}`,
          tipo: file.mimetype,
          peso: file.size.toString(),
        }
      }),
    );

    return {
      message: 'Imágenes subidas correctamente',
      images: savedImages,
    };
    
  }
}


