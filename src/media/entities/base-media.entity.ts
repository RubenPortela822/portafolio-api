import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BaseMedia {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:"varchar"})    
    tipo: string;

    @Column({type:"varchar"})    
    nombre: string;

    @Column({type:"varchar"})
    url: string;

    @Column()
    tamaño: number;

}
