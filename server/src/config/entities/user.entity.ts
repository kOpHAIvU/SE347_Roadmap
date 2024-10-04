import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity('USER')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 255, nullable: true })
  fullName: string;

  @Column({ length: 10, nullable: true })
  gender: string;

  @Column({ length: 255, nullable: true, unique: true })
  email: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role' })
  role: Role;

  @Column({ length: 50, nullable: true })
  createdAt: string;

  @Column({ length: 50, nullable: true })
  deletedAt: string;
}
