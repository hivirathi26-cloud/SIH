import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Milestone } from "./Milestone.entity";
import { User } from "./User.entity";

@Entity("documents")
export class Document {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "milestone_id", type: "uuid" })
  milestoneId: string;

  @ManyToOne(() => Milestone, (milestone) => milestone.documents)
  @JoinColumn({ name: "milestone_id" })
  milestone: Milestone;

  @Column({ name: "doc_type", length: 30 })
  docType: string; // report, test_data, approval, ip_filing

  @Column({ name: "storage_url", type: "text", nullable: true })
  storageUrl: string;

  @Column({ name: "uploaded_by", type: "uuid" })
  uploadedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "uploaded_by" })
  uploader: User;

  @CreateDateColumn({ name: "uploaded_at" })
  uploadedAt: Date;
}
