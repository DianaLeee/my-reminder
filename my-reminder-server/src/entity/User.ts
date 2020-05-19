import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  setUser = async (email: string, password: string, name: string) => {
    this.email = email;
    this.password = password;
    this.name = name;
  };

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;
}
