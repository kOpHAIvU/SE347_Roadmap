import { Exclude } from "class-transformer";
import { Roadmap } from "../../roadmap/entities/roadmap.entity";
import { User } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import {Node} from '../../node/entities/node.entity'

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: ""})
    title: string;

    @Column({nullable: false})
    content: string;

    @Column({default: -1})
    left: number;

    @Column({default: -1})
    right: number;

    @ManyToOne(() => User, poster => poster.comment, { eager: true })

    poster: User;

    @ManyToOne(() => Roadmap, roadmap => roadmap.id, { eager: false})
    roadmap: Roadmap;

    @ManyToOne(() => Comment, comment => comment.childComments, { eager: false })
    @JoinColumn({ name: 'parentCommentId' })  
    parentComment: Comment;

    @OneToMany(() => Comment, comment => comment.parentComment)
    childComments: Comment[];

    @Column({type: 'boolean', default: true})
    isActive: boolean;

    @CreateDateColumn()  
    @Exclude()
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })  
    @Exclude()
    deletedAt: Date | null;

    @ManyToOne(() => Node,  node => node.comment)
    node: Node 

}
