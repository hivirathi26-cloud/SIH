import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "full_name", length: 150 })
  fullName: string;

  @Column({ unique: true, length: 15 })
  phone: string;

  @Column({ unique: true, length: 150, nullable: true })
  email: string;

  @Column({ name: "password_hash", type: "text", nullable: true })
  passwordHash: string;

  @Column({ length: 30 })
  role: string; // citizen, community_group, pri, ulb, govt_officer, university_nodal, faculty, student, startup, msme, csr, research_lab, state_admin, district_officer

  @Column({ name: "organization_name", length: 200, nullable: true })
  organizationName: string;

  @Column({ length: 100, nullable: true })
  district: string;

  @Column({ name: "aadhaar_verified", default: false })
  aadhaarVerified: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
