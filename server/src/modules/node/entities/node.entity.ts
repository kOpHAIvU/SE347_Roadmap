import { Roadmap } from '../../roadmap/entities/roadmap.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import {Comment} from  '../../comment/entities/comment.entity'  
import { Progress } from '../../progress/entities/progress.entity';
import { Timeline } from 'src/modules/timeline/entities/timeline.entity';

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

    @Column({default: null})
    dueTime?: number;

    @Column()
    content: string;

    @Column({nullable: false})
    detail: string; 

    @ManyToOne(() => Roadmap, roadmap => roadmap.node, { eager: true })
    roadmap: Roadmap;

    @OneToMany(() => Comment, comment => comment.node, { eager: true })
    comment: Comment[];

    @Column({ type: 'boolean', default: true }) 
    isActive: boolean;

    @CreateDateColumn()  
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null;

    @OneToMany(() => Progress, progress => progress.node)
    progress: Progress[];

    @ManyToOne(() => Timeline, timeline => timeline.node, { eager: true })
    timeline: Timeline;

    
}
