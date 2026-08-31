import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Proposal } from "./Proposal.entity";
import { IndustryPartner } from "./IndustryPartner.entity";

@Entity("agreements")
export class Agreement {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "proposal_id", type: "uuid" })
  proposalId: string;

  @ManyToOne(() => Proposal)
  @JoinColumn({ name: "proposal_id" })
  proposal: Proposal;

  @Column({ name: "industry_partner_id", type: "uuid" })
  industryPartnerId: string;

  @ManyToOne(() => IndustryPartner)
  @JoinColumn({ name: "industry_partner_id" })
  industryPartner: IndustryPartner;

  @Column({ name: "agreement_type", length: 30 })
  agreementType: string; // funding, mentorship, prototyping, tech_transfer

  @Column("numeric", { nullable: true })
  amount: number;

  @Column({ name: "signed_at", type: "timestamptz", nullable: true })
  signedAt: Date;

  @Column({ name: "document_url", type: "text", nullable: true })
  documentUrl: string;
}
