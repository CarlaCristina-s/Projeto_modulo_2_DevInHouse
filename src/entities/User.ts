import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export type UserProfile = "ADMIN" | "DRIVER" | "BRANCH";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar", length: 200, nullable: false })
  name: string;

  @Column({ type: "enum", enum: ["ADMIN", "DRIVER", "BRANCH"], nullable: false })
  profile: UserProfile;

  @Column({ type: "varchar", length: 150, unique: true, nullable: false })
  email: string;

  @Column({ type: "varchar", length: 150, nullable: false })
  password_hash: string;

  @Column({ type: "boolean", default: true })
  status: boolean;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}