import { Entity, ManyToOne } from 'typeorm';
import { BaseMedia } from './base-media.entity';
import { Project } from 'src/project/entities/project.entity';

@Entity()
export class ProjectMedia extends BaseMedia {
  @ManyToOne(() => Project, (proyecto) => proyecto.media, { onDelete: 'CASCADE' })
  proyecto: Project;
}