import { Entity, ManyToOne } from 'typeorm';
import { BaseMedia } from './base-media.entity';
import { Post } from 'src/post/entities/post.entity';

@Entity()
export class PostMedia extends BaseMedia {
  @ManyToOne(() => Post, (proyecto) => proyecto.media, { onDelete: 'CASCADE' })
  post: Post;
}