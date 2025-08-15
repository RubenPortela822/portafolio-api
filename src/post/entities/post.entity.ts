import { PostMedia } from "src/media/entities/post-media.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
export type statusPost = "inactivo" | "activo";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    titulo: string;

    @Column({
        type: "longtext"
    })
    descripcion: string;

    @Column({
        type: "longtext"
    })
    detalle: string;

    @Column({ type: "date" })
    fecha: string;

    @Column({ unique: true })
    slug: string;

    @Column({
        type: "enum",
        enum: ["inactivo", "activo"],
        default: "activo"
    })
    estado: statusPost

    @OneToMany(() => PostMedia, (media) => media.post)
    media: PostMedia[];
}
