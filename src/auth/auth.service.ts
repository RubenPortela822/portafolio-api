import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService,               
    ) { }

    async register(userDto: RegisterDto) {
        const userEmailCreated = await this.usersService.findByEmail(userDto.email);
        if (userEmailCreated) {
            throw new BadRequestException('Email ya registrado');
        }  
        
        const userUsuarioCreated = await this.usersService.findByUsername(userDto.usuario);
        if (userUsuarioCreated) {
            throw new BadRequestException('Usuario ya registrado');
        }

        const {password, ...restUser} = await this.usersService.create(userDto);
        return restUser;
    }
    
    async validateUser(userLogin: LoginDto) {
        const { usuario, password } = userLogin;
        const user = await this.usersService.findByUsername(usuario);        
        
        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado');
        }
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            throw new UnauthorizedException('Contraseña incorrecta');
        }
        return user;
    }

    
    async login(userLogin: LoginDto) {
        const user = await this.validateUser(userLogin);
        const payload = { username: user.usuario, sub: user.id };
        return {
            ...userLogin,
            access_token: this.jwtService.sign(payload),
        };
    }
}
