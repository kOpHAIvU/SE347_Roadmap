import { Roadmap } from "src/modules/roadmap/entities/roadmap.entity";
import { Team } from "src/modules/team/entities/team.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Timeline {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    title: string;

    @Column({nullable: false})
    content: string;

    @ManyToOne(() => Roadmap, roadmap => roadmap.timeline)
    roadmap: Roadmap;

    @OneToMany(() => Team, team => team.id)
    team: Team[];

    @Column({ type: 'boolean', default: true }) 
    isActive: boolean;

    @CreateDateColumn()  
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null;
}
