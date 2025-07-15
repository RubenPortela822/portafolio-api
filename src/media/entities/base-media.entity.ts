import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BaseMedia {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()    
    tipo: string;

    @Column()    
    nombre: string;

    @Column()
    url: string;

    @Column()
    peso: string;

}
