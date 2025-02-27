import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Branch } from "./Branch";
import { Movement } from "./Movement";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 200, nullable: false })
  name: string;

  @Column({ type: "int", nullable: false })
  amount: number;

  @Column({ type: "varchar", length: 200, nullable: false })
  description: string;

  @Column({ type: "varchar", length: 200 })
  url_cover: string;

  @ManyToOne(() => Branch, (branch) => branch.products)
  @JoinColumn({ name: "branch_id" })
  branch: Branch;

  @Column({ type: "int", nullable: false })
  branch_id: number;

  @OneToMany(() => Movement, (movement) => movement.product)
  movements: Movement[];

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}
