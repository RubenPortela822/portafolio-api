import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from './jwt/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() body: RegisterDto) {
        return this.authService.register(body);
    }

    @Post('login')
    async login(@Body() body: LoginDto) {
        return this.authService.login(body);
    }

    @UseGuards(JwtGuard)
    @Get('perfil')
    getPerfil(@Request() req) {
        return {
            mensaje: 'Acceso autorizado',
            usuario: req.user,
        };
    }

}
