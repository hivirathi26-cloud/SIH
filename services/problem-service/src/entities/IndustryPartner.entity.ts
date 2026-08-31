import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User.entity";

@Entity("industry_partners")
export class IndustryPartner {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id", type: "uuid" })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: "org_type", length: 30 })
  orgType: string; // startup, msme, csr, research_lab, large_industry

  @Column("text", { array: true, default: "{}" })
  sectors: string[];
}
