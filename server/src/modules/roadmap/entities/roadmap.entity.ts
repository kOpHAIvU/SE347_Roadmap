import { User } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from './../../comment/entities/comment.entity';

@Entity()
export class Roadmap {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false })
    title: string;

    @Column({nullable: false })
    content: string;
    
    @ManyToOne(() => User, owner => owner.roadmap)
    owner: User

    @OneToMany(() => Comment, comment => comment.roadmap)
    comment: Comment[]

    @Column({nullable: false })
    clone: number;

    @Column({nullable: false })
    react: number;

    @Column({ type: 'boolean', default: false }) // Default status is 0 (false)
    isActive: boolean;

    @CreateDateColumn()  
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null;


}
