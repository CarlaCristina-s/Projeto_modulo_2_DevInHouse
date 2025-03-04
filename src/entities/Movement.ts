import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { Branch } from "./Branch";
import { Product } from "./Product";
import { Driver } from "./Driver";

export type MovementStatus = "PENDING" | "IN_PROGRESS" | "FINISHED";

@Entity("movements")
export class Movement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Branch)
  @JoinColumn({ name: "destination_branch_id" })
  destinationBranch: Branch;

  @Column({ type: "int", nullable: false })
  destination_branch_id: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column({ type: "int", nullable: false })
  product_id: number;

  @ManyToOne(() => Driver)
  @JoinColumn({ name: "driver_id" })
  driver: Driver;

  @Column({ type: "int", nullable: true })
  driver_id: number;

  @Column({ type: "int", nullable: false })
  quantity: number;

  @Column({
    type: "enum",
    enum: ["PENDING", "IN_PROGRESS", "FINISHED"],
    default: "PENDING",
  })
  status: MovementStatus;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}