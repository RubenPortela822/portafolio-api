import { UserMedia } from "src/media/entities/user-media.entity";
import { Project } from "src/project/entities/project.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombres: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true, length: 30, })
    usuario: string;

    @Column({ select: false, length: 100 })
    password: string;

    @Column({ type: "date" })
    fecha_nacimiento: string;

    @Column({ unique: true })
    slug: string;

    @Column({
        type: "longtext",
        nullable: true
    })
    descripcion: string;


    @OneToOne(() => UserMedia, (media) => media.usuario, { cascade: false, nullable: true, eager: false })
    @JoinColumn()
    imagen: UserMedia;

    @OneToMany(() => Project, (project) => project.usuario,{ cascade: false, nullable: true, eager: false })
    proyectos: Project[];

    @BeforeInsert()
    createSlug() {
        this.createURL();
    }

    @BeforeUpdate()
    updateSlug() {
        this.createURL();
    }

    private createURL() {
        this.slug = this.nombres.toLowerCase().toString()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase()
            .replace(/&/g, '-y-')
            .replace(/[^a-z0-9\-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-*/, '')
            .replace(/-*$/, '') +'-'+ Date.now() + Math.round(Math.random() * 1e9);
    }

}
