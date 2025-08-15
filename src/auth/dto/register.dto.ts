import { IsDateString, IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto {

    @IsString()
    nombres: string;

    @IsEmail()
    email:string;

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    usuario:string;

    @IsString()
    @MinLength(6)    
    password:string;

    @IsDateString()
    fecha_nacimiento:string;

    @IsOptional()
    descripcion: string;
}