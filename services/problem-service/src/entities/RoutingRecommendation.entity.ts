import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Problem } from "./Problem.entity";
import { University } from "./University.entity";

@Entity("routing_recommendations")
export class RoutingRecommendation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "problem_id", type: "uuid" })
  problemId: string;

  @ManyToOne(() => Problem)
  @JoinColumn({ name: "problem_id" })
  problem: Problem;

  @Column({ name: "university_id", type: "uuid" })
  universityId: string;

  @ManyToOne(() => University)
  @JoinColumn({ name: "university_id" })
  university: University;

  @Column("float")
  matchScore: number;

  @Column("int")
  rank: number;

  @Column({ length: 20, default: "suggested" })
  status: string; // suggested, accepted, declined
}
