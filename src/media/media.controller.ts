import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Request, } from '@nestjs/common';
import { MediaService } from './media.service';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) { }

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


}
