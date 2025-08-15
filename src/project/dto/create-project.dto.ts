import { IsDateString, IsOptional, IsString } from "class-validator";

export class CreateProjectDto {

    @IsString()
    titulo: string;

    @IsString()
    link: string;

    @IsDateString()
    fecha_subida: string;

    @IsOptional()
    descripcion: string;

    @IsOptional()
    @IsString({
        each:true
    })
    tecnologias: string[];

    
}
