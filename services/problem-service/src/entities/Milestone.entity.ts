import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Proposal } from "./Proposal.entity";
import { Document } from "./Document.entity";

@Entity("milestones")
export class Milestone {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "proposal_id", type: "uuid" })
  proposalId: string;

  @ManyToOne(() => Proposal)
  @JoinColumn({ name: "proposal_id" })
  proposal: Proposal;

  @Column({ length: 100 })
  name: string; // research_design, prototype_build, testing_validation, pilot_deployment, full_implementation

  @Column({ length: 20, default: "pending" })
  status: string; // pending, in_progress, submitted, approved, rejected

  @Column({ name: "due_date", type: "date", nullable: true })
  dueDate: string;

  @Column({ name: "completed_at", type: "timestamptz", nullable: true })
  completedAt: Date;

  @OneToMany(() => Document, (doc) => doc.milestone)
  documents: Document[];
}
