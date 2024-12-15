import { User } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from './../../comment/entities/comment.entity';
import { Timeline } from "../../timeline/entities/timeline.entity";
import {Node} from "../../node/entities/node.entity"
import { Favorite } from "src/modules/favorite/entities/favorite.entity";

@Entity()
export class Roadmap {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, unique: true })
    code: string;

    @Column({nullable: false })
    title: string;

    @Column({nullable: false })
    type: string;

    @Column()
    avatar: string;

    @Column({nullable: false })
    content: string;
    
    @ManyToOne(() => User, owner => owner.roadmap, { eager: true })
    owner: User

    @OneToMany(() => Node, node => node.roadmap)
    node: Node[]

    @OneToMany(() => Comment, comment => comment.roadmap)
    comment: Comment[]

    @OneToMany(() => Timeline, timeline => timeline.roadmap)
    timeline: Timeline[]

    @Column({default: 0})
    clone: number;

    @Column({default: 0})
    react: number;

    @Column({ type: 'boolean', default: false })
    isPublic: boolean;

    @Column({ type: 'boolean', default: true }) // Default status is 1 (true)
    isActive: boolean;

    @CreateDateColumn()  
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null;

    @OneToMany(() => Favorite, favorite => favorite.roadmap)
    favorite: Favorite[]
}
