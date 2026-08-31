import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User.entity";
import { ProblemMedia } from "./ProblemMedia.entity";

@Entity("problems")
export class Problem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "submitted_by", type: "uuid" })
  submittedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "submitted_by" })
  user: User;

  @Column({ length: 200 })
  title: string;

  @Column("text")
  description: string;

  @Column({ name: "description_original_lang", type: "text", nullable: true })
  descriptionOriginalLang: string;

  @Column({ name: "detected_language", length: 10, nullable: true })
  detectedLanguage: string;

  @Column({ length: 50, nullable: true })
  category: string;

  @Column({ name: "sub_category", length: 80, nullable: true })
  subCategory: string;

  @Column({ name: "category_confidence", type: "float", nullable: true })
  categoryConfidence: number;

  @Column({ name: "priority_score", type: "float", nullable: true })
  priorityScore: number;

  @Column({ length: 30, default: "submitted" })
  status: string; // submitted, under_ai_review, pending_nodal_review, rejected, routed, accepted_by_hei, team_formed, in_progress, industry_matched, deployed, closed

  @Column({ length: 100, nullable: true })
  district: string;

  @Column({ type: "double precision", nullable: true })
  latitude: number;

  @Column({ type: "double precision", nullable: true })
  longitude: number;

  @Column({ name: "is_duplicate_of", type: "uuid", nullable: true })
  isDuplicateOf: string;

  @Column({ name: "citizen_support_count", default: 1 })
  citizenSupportCount: number;

  @Column("text", { array: true, default: "{}" })
  sdgTags: string[];

  @OneToMany(() => ProblemMedia, (media) => media.problem)
  media: ProblemMedia[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
