import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Team } from "./Team.entity";
import { User } from "./User.entity";

@Entity("team_members")
export class TeamMember {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "team_id", type: "uuid" })
  teamId: string;

  @ManyToOne(() => Team, (team) => team.members)
  @JoinColumn({ name: "team_id" })
  team: Team;

  @Column({ name: "student_id", type: "uuid" })
  studentId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "student_id" })
  student: User;

  @Column({ length: 80 })
  discipline: string;
}
