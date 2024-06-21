import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class UserCode {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.userCodes)
    user: User;

    @Column('text')
    code: string

    //sqlite does not support date
    @Column('text')
    expires: Date
}