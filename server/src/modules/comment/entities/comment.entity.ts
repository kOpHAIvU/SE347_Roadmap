import { Roadmap } from "src/modules/roadmap/entities/roadmap.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    content: string;

    @ManyToOne(() => User, poster => poster.comment)
    poster: User;

    @ManyToOne(() => Roadmap, roadmap => roadmap.id)
    roadmap: Roadmap;

    @OneToOne(() => Comment)
    @JoinColumn()
    parentComment: Comment;

    @Column({type: 'boolean', default: true})
    isActive: boolean;

    @CreateDateColumn()  
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null;

}
