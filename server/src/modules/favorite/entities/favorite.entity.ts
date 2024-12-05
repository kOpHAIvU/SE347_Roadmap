import { Roadmap } from "src/modules/roadmap/entities/roadmap.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export class Favorite {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    time: Date;

    @ManyToOne(() => User, user => user.favorite)
    user: User;

    @ManyToOne(() => Roadmap, roadmap => roadmap.favorite)
    roadmap: Roadmap;

    @CreateDateColumn()  
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null;
}
