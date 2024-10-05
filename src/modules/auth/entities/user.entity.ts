import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserCode } from './user-code.entity';
import { Collection } from 'src/modules/collection/entities/collection.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 255, // Especificar la longitud máxima
    unique: true,
  })
  username: string;

  @Column('text')
  password: string;

  @OneToMany(() => UserCode, (userCode) => userCode.user)
  userCodes: UserCode[];

  @OneToMany(() => Collection, (collection) => collection.user)
  collections?: Collection[];
}
