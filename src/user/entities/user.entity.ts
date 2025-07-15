import { UserMedia } from "src/media/entities/user-media.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombres: string;

    @Column()
    apellidos: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true, length: 30, })
    usuario: string;

    @Column({ select: false, length: 100 })
    password: string;

    @Column({ type: "date" })
    fecha_nacimiento: string;

    @Column({
        type: "longtext",
        nullable:true
    })
    descripcion: string;
    

    @OneToOne(() => UserMedia, (media) => media.usuario,  { cascade: false, nullable: true  })
    @JoinColumn()
    imagen: UserMedia;

}
