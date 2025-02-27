import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from "typeorm"; 
import { User } from "./User";
import { Product } from "./Product";
import { Movement } from "./Movement";

@Entity("branches")
export class Branch {
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

  @OneToMany(() => Product, product => product.branch)
  products: Product[];

  @OneToMany(() => Movement, (movement) => movement.destinationBranch)
  receivedMovements: Movement[];

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}