import {Entity, PrimaryGeneratedColumn} from "typeorm"

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number
}