import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Problem } from "./Problem.entity";

@Entity("problem_media")
export class ProblemMedia {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "problem_id", type: "uuid" })
  problemId: string;

  @ManyToOne(() => Problem, (problem) => problem.media)
  @JoinColumn({ name: "problem_id" })
  problem: Problem;

  @Column({ name: "media_type", length: 20 })
  mediaType: string; // image, video, document, audio

  @Column({ name: "storage_url", type: "text" })
  storageUrl: string;

  @Column({ name: "cv_validation_label", type: "text", nullable: true })
  cvValidationLabel: string;

  @Column({ name: "cv_validation_confidence", type: "float", nullable: true })
  cvValidationConfidence: number;
}
