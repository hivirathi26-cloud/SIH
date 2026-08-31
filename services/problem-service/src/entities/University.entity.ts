import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User.entity";

@Entity("universities")
export class University {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column({ length: 100, nullable: true })
  district: string;

  @Column("text", { array: true, default: "{}" })
  expertiseDomains: string[];

  @Column({ name: "nodal_officer_id", type: "uuid", nullable: true })
  nodalOfficerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "nodal_officer_id" })
  nodalOfficer: User;
}
