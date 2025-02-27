import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Product } from "./Product";

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

  @OneToMany(() => Product, product => product.branch)
  products: Product[];

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}