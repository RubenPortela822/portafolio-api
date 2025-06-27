import { Entity, ManyToOne, OneToOne } from 'typeorm';
import { BaseMedia } from './base-media.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class UserMedia extends BaseMedia {
  @OneToOne(() => User, (usuario) => usuario.imagen)
  usuario: User;

}