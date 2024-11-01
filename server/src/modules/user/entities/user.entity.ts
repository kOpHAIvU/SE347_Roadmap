import { Roadmap } from './../../roadmap/entities/roadmap.entity';
import { Role } from '../../role/entities/role.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, OneToMany, ManyToMany, ManyToOne, OneToOne } from 'typeorm';
import { Comment } from './../../comment/entities/comment.entity';
import { Member } from '../../member/entities/member.entity';
import { Team } from '../../team/entities/team.entity';
import { Timeline } from '../../timeline/entities/timeline.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ length: 100, nullable: false })
    username: string;
    
    @Column({ length: 100})
    password: string;

    @Column({nullable: false })
    fullName: string;

    @Column({ length: 10, nullable: false })
    gender: string;

    @Column()
    avatar: string;

    @Column({ length: 100, unique: true, nullable: false })
    email: string;

    @Column({ type: 'boolean', default: false }) // Default status is 0 (false)
    isActive: boolean;

    @CreateDateColumn()  
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null;

    // Add attribute { eager: true } to return role object when query user

    @ManyToOne(() => Role, role => role.user, { eager: true })
    role: Role
    
    @OneToMany(() => Roadmap, roadmap => roadmap.owner)
    roadmap: Roadmap[]

    @OneToMany(() => Comment, comment => comment.poster)
    comment: Comment[]

    @OneToMany(() => Timeline, team => team.leader)
    team: Team[]

    @OneToMany(() => Member, member => member.member)
    member: Member[]
}
