import { ProjectMedia } from "src/media/entities/project-media.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
export type statusProject = "inactivo" | "activo";

@Entity()
export class Project {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titulo: string;

    @Column()
    link: string;

    @Column({ type: "date" })
    fecha_subida: string;

    @Column({
        type: "longtext"
    })
    descripcion: string;

    @Column({
        type: "simple-array"
    })
    tecnologias: string[];

    @Column({
        type: "enum",
        enum: ["inactivo", "activo"],
        default: "activo"
    })
    estado: statusProject

    @OneToMany(() => ProjectMedia, (media) => media.proyecto)
    media: ProjectMedia[];

}
