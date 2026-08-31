import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Team } from "./Team.entity";

@Entity("proposals")
export class Proposal {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "team_id", type: "uuid" })
  teamId: string;

  @ManyToOne(() => Team)
  @JoinColumn({ name: "team_id" })
  team: Team;

  @Column({ length: 200, nullable: true })
  title: string;

  @Column("text", { nullable: true })
  summary: string;

  @Column({ name: "needs_industry_support", default: false })
  needsIndustrySupport: boolean;

  @Column({ length: 30, default: "draft" })
  status: string; // draft, submitted, under_review, approved

  @Column({ name: "submitted_at", type: "timestamptz", nullable: true })
  submittedAt: Date;
}
