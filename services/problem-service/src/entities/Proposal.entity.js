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
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Team } from "./Team.entity";
let Proposal = class Proposal {
    id;
    teamId;
    team;
    title;
    summary;
    needsIndustrySupport;
    status; // draft, submitted, under_review, approved
    submittedAt;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Proposal.prototype, "id", void 0);
__decorate([
    Column({ name: "team_id", type: "uuid" }),
    __metadata("design:type", String)
], Proposal.prototype, "teamId", void 0);
__decorate([
    ManyToOne(() => Team),
    JoinColumn({ name: "team_id" }),
    __metadata("design:type", typeof (_a = typeof Team !== "undefined" && Team) === "function" ? _a : Object)
], Proposal.prototype, "team", void 0);
__decorate([
    Column({ length: 200, nullable: true }),
    __metadata("design:type", String)
], Proposal.prototype, "title", void 0);
__decorate([
    Column("text", { nullable: true }),
    __metadata("design:type", String)
], Proposal.prototype, "summary", void 0);
__decorate([
    Column({ name: "needs_industry_support", default: false }),
    __metadata("design:type", Boolean)
], Proposal.prototype, "needsIndustrySupport", void 0);
__decorate([
    Column({ length: 30, default: "draft" }),
    __metadata("design:type", String)
], Proposal.prototype, "status", void 0);
__decorate([
    Column({ name: "submitted_at", type: "timestamptz", nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Proposal.prototype, "submittedAt", void 0);
Proposal = __decorate([
    Entity("proposals")
], Proposal);
export { Proposal };
