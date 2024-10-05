import { User } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from './../../comment/entities/comment.entity';

@Entity()
export class Roadmap {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, unique: true })
    code: string;

    @Column({nullable: false })
    title: string;

    @Column({nullable: false })
    content: string;
    
    @ManyToOne(() => User, owner => owner.roadmap)
    owner: User

    @OneToMany(() => Comment, comment => comment.roadmap)
    comment: Comment[]

    @Column({default: 0})
    clone: number;

    @Column({default: 0})
    react: number;

    @Column({ type: 'boolean', default: true }) // Default status is 1 (true)
    isActive: boolean;

    @CreateDateColumn()  
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null;

}
