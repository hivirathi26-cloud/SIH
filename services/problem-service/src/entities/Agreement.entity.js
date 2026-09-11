var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Proposal } from "./Proposal.entity";
import { IndustryPartner } from "./IndustryPartner.entity";
let Agreement = class Agreement {
    id;
    proposalId;
    proposal;
    industryPartnerId;
    industryPartner;
    agreementType; // funding, mentorship, prototyping, tech_transfer
    amount;
    signedAt;
    documentUrl;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Agreement.prototype, "id", void 0);
__decorate([
    Column({ name: "proposal_id", type: "uuid" }),
    __metadata("design:type", String)
], Agreement.prototype, "proposalId", void 0);
__decorate([
    ManyToOne(() => Proposal),
    JoinColumn({ name: "proposal_id" }),
    __metadata("design:type", typeof (_a = typeof Proposal !== "undefined" && Proposal) === "function" ? _a : Object)
], Agreement.prototype, "proposal", void 0);
__decorate([
    Column({ name: "industry_partner_id", type: "uuid" }),
    __metadata("design:type", String)
], Agreement.prototype, "industryPartnerId", void 0);
__decorate([
    ManyToOne(() => IndustryPartner),
    JoinColumn({ name: "industry_partner_id" }),
    __metadata("design:type", typeof (_b = typeof IndustryPartner !== "undefined" && IndustryPartner) === "function" ? _b : Object)
], Agreement.prototype, "industryPartner", void 0);
__decorate([
    Column({ name: "agreement_type", length: 30 }),
    __metadata("design:type", String)
], Agreement.prototype, "agreementType", void 0);
__decorate([
    Column("numeric", { nullable: true }),
    __metadata("design:type", Number)
], Agreement.prototype, "amount", void 0);
__decorate([
    Column({ name: "signed_at", type: "timestamptz", nullable: true }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Agreement.prototype, "signedAt", void 0);
__decorate([
    Column({ name: "document_url", type: "text", nullable: true }),
    __metadata("design:type", String)
], Agreement.prototype, "documentUrl", void 0);
Agreement = __decorate([
    Entity("agreements")
], Agreement);
export { Agreement };
