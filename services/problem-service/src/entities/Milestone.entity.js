var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Proposal } from "./Proposal.entity";
import { Document } from "./Document.entity";
let Milestone = class Milestone {
    id;
    proposalId;
    proposal;
    name; // research_design, prototype_build, testing_validation, pilot_deployment, full_implementation
    status; // pending, in_progress, submitted, approved, rejected
    dueDate;
    completedAt;
    documents;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Milestone.prototype, "id", void 0);
__decorate([
    Column({ name: "proposal_id", type: "uuid" }),
    __metadata("design:type", String)
], Milestone.prototype, "proposalId", void 0);
__decorate([
    ManyToOne(() => Proposal),
    JoinColumn({ name: "proposal_id" }),
    __metadata("design:type", typeof (_a = typeof Proposal !== "undefined" && Proposal) === "function" ? _a : Object)
], Milestone.prototype, "proposal", void 0);
__decorate([
    Column({ length: 100 }),
    __metadata("design:type", String)
], Milestone.prototype, "name", void 0);
__decorate([
    Column({ length: 20, default: "pending" }),
    __metadata("design:type", String)
], Milestone.prototype, "status", void 0);
__decorate([
    Column({ name: "due_date", type: "date", nullable: true }),
    __metadata("design:type", String)
], Milestone.prototype, "dueDate", void 0);
__decorate([
    Column({ name: "completed_at", type: "timestamptz", nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Milestone.prototype, "completedAt", void 0);
__decorate([
    OneToMany(() => Document, (doc) => doc.milestone),
    __metadata("design:type", Array)
], Milestone.prototype, "documents", void 0);
Milestone = __decorate([
    Entity("milestones")
], Milestone);
export { Milestone };
