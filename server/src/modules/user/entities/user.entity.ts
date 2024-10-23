import { Roadmap } from './../../roadmap/entities/roadmap.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, OneToMany, ManyToMany, ManyToOne, OneToOne } from 'typeorm';
import { Comment } from './../../comment/entities/comment.entity';
import { Member } from 'src/modules/member/entities/member.entity';
import { Team } from 'src/modules/team/entities/team.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ length: 100, nullable: false })
    username: string;
    
    @Column({ length: 100, nullable: false })
    @Exclude()
    password: string;

    @Column({nullable: false })
    fullName: string;

    @Column({ length: 10, nullable: false })
    gender: string;

    @Column({ length: 100, unique: true, nullable: false })
    email: string;

    @Column({ type: 'boolean', default: false }) // Default status is 0 (false)
    isActive: boolean;

    @CreateDateColumn()  
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null;

    @ManyToOne(() => Role, role => role.user)
    role: Role
    
    @OneToMany(() => Roadmap, roadmap => roadmap.owner)
    roadmap: Roadmap[]

    @OneToMany(() => Comment, comment => comment.poster)
    comment: Comment[]

    @OneToMany(() => Team, team => team.leader)
    team: Team[]

    @OneToMany(() => Member, member => member.member)
    member: Member[]
}
