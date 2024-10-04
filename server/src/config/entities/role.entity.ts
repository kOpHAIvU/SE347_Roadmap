import { Entity, PrimaryColumn, Column, Unique } from 'typeorm';

@Entity('ROLE')
@Unique(['name'])
export class Role {
  @PrimaryColumn()
  id: number;

  @Column({ length: 100 })
  name: string;
}
