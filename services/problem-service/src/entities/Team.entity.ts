import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Problem } from "./Problem.entity";
import { University } from "./University.entity";
import { User } from "./User.entity";
import { TeamMember } from "./TeamMember.entity";

@Entity("teams")
export class Team {
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

  @Column({ name: "faculty_mentor_id", type: "uuid" })
  facultyMentorId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "faculty_mentor_id" })
  facultyMentor: User;

  @OneToMany(() => TeamMember, (member) => member.team)
  members: TeamMember[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
