import { Roadmap } from '../../roadmap/entities/roadmap.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import {Comment} from  '../../comment/entities/comment.entity'  
import { Progress } from '../../progress/entities/progress.entity';

@Entity()
export class Node {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    level: number;

    @Column({nullable: false})
    xAxis: number;

    @Column({nullable: false})
    yAxis: number;

    @Column({nullable: false})
    type: string;

    @Column({nullable: false})
    tick: boolean;

    @Column({nullable: false})
    dueTime: number;

    @Column()
    attachFile: string;

    @Column()
    content: string;

    @Column({nullable: false})
    detail: string; 

    @ManyToOne(() => Roadmap, roadmap => roadmap.node, { eager: true })
    roadmap: Roadmap;

    @OneToMany(() => Comment, comment => comment.node)
    comment: Comment[];

    @Column({ type: 'boolean', default: true }) 
    isActive: boolean;

    @CreateDateColumn()  
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null;

    @OneToMany(() => Progress, progress => progress.node)
    progress: Progress[];
}
