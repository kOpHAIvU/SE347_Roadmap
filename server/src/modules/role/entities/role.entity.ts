import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 , unique: true, nullable: false})
    name: string;

    @OneToMany(() => User, user => user.role)
    user: User[]
    
}
