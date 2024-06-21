import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserCode } from "./user-code.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', {
        unique: true,
    })
    username: string;
    
    @Column('text')
    password: string;

    @OneToMany(() => UserCode, userCode => userCode.user)
    userCodes: UserCode[];
}