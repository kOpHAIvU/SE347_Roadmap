import { Role } from 'src/modules/role/entities/role.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, OneToMany, ManyToMany, ManyToOne } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ length: 100, nullable: false })
    username: string;
    
    @Column({ length: 100, nullable: false })
    password: string;

    @Column({nullable: false })
    fullName: string;

    @Column({ length: 10, nullable: false })
    gender: string;

    @Column({ length: 100, unique: true, nullable: false })
    email: string;

    @CreateDateColumn()  
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null;

    @ManyToOne(() => Role, role => role.user)
    role: Role

}
