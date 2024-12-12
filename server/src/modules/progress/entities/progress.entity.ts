import { GroupDivision } from "../../group-division/entities/group-division.entity";
import { Node } from "../../node/entities/node.entity";
import { CreateDateColumn, PrimaryGeneratedColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Progress {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Node, node => node.progress, { eager: true })
    node: Node;

    @ManyToOne(() => GroupDivision, groupDivision => groupDivision.progress, { eager: true })
    groupDivision: GroupDivision;

    @CreateDateColumn()  
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null;
}
