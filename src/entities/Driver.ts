import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "./User";
import { Movement } from "./Movement";

@Entity("drivers")
export class Driver {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar", length: 255 })
  full_address: string;

  @Column({ type: "varchar", length: 30, nullable: false })
  document: string;

  @OneToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "int", nullable: false })
  user_id: number;

  @OneToMany(() => Movement, (movement) => movement.driver)
  movements: Movement[];

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}