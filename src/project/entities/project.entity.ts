import { ProjectMedia } from "src/media/entities/project-media.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from 'src/user/entities/user.entity';

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
        type: "longtext",
        nullable: true
    })
    descripcion: string;

    @Column({
        type: "simple-array",
        nullable: true
    })
    tecnologias: string[];

    @Column({ unique: true })
    slug: string;

    @Column({
        type: "enum",
        enum: ["inactivo", "activo"],
        default: "activo"
    })
    estado: statusProject

    @OneToMany(() => ProjectMedia, (media) => media.proyecto, { cascade: true })
    media: ProjectMedia[];

    @ManyToOne(() => User, (usuario) => usuario.proyectos, { eager: true })
    usuario: User;


    @BeforeInsert()
    createSlug() {
        this.createURL();
    }

    @BeforeUpdate()
    updateSlug() {
        this.createURL();
    }

    private createURL() {
        this.slug = this.titulo.toLowerCase().toString()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase()
            .replace(/&/g, '-y-')
            .replace(/[^a-z0-9\-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-*/, '')
            .replace(/-*$/, '') + '-' + Date.now() + Math.round(Math.random() * 1e9);
    }

}
