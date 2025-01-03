import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    title: string;

    @Column({nullable: false})
    content: string;

    @ManyToOne(() => User, postNotification => postNotification.poster, { eager: true })
    postNotification: User;

    @CreateDateColumn()  
    createdAt: Date;

    @Column({ type: 'boolean', default: false }) // Default status is 0 (false)
    isCheck: boolean;

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null;

    @Column({ type: 'boolean', default: true }) // Default status is 1 (true)
    isActive: boolean;

    @ManyToOne(() => User, receiver => receiver.notification)
    receiver: User;

    // type is in ['sms', 'email', 'push']
    @Column({nullable: false})
    type: string;

}
