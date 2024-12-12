import { GroupDivision } from "src/modules/group-division/entities/group-division.entity";
import { Roadmap } from "../../roadmap/entities/roadmap.entity";
import { User } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Timeline {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    title: string;

    @Column({nullable: false})
    content: string;

    @ManyToOne(() => User, creator => creator.timeline, { eager: true })
    creator: User;

    @ManyToOne(() => Roadmap, roadmap => roadmap.timeline, { eager: true })
    roadmap: Roadmap;

    // @OneToMany(() => Team, team => team.id)
    // team: Team[];

    @Column({ type: 'boolean', default: true }) 
    isActive: boolean;

    @CreateDateColumn()  
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null;

    @OneToMany(() => GroupDivision, groupDivision => groupDivision.team)
    groupDivision: GroupDivision;
    
}
