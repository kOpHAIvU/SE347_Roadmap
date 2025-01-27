import { GroupDivision } from "src/modules/group-division/entities/group-division.entity";
import { Roadmap } from "../../roadmap/entities/roadmap.entity";
import { User } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Node } from "src/modules/node/entities/node.entity";
import { Progress } from "src/modules/progress/entities/progress.entity";

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

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    startTime: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dueTime: Date;

    @ManyToOne(() => Roadmap, roadmap => roadmap.timeline, { eager: true })
    roadmap: Roadmap;

    // @OneToMany(() => Team, team => team.id)
    // team: Team[];

    @Column({ type: 'boolean', default: true }) 
    isActive: boolean;

    @Column({default: "avatar.png"})
    avatar: string;

    @CreateDateColumn()  
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null;

    @OneToMany(() => GroupDivision, groupDivision => groupDivision.timeline)
    groupDivision: GroupDivision[];

    @OneToMany(() => Node, node => node.timeline)
    node: Node[];

    @OneToMany(() => Progress, progress => progress.timeline)
    progress: Progress[];
}
