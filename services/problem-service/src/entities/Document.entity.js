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
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Milestone } from "./Milestone.entity";
import { User } from "./User.entity";
let Document = class Document {
    id;
    milestoneId;
    milestone;
    docType; // report, test_data, approval, ip_filing
    storageUrl;
    uploadedBy;
    uploader;
    uploadedAt;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Document.prototype, "id", void 0);
__decorate([
    Column({ name: "milestone_id", type: "uuid" }),
    __metadata("design:type", String)
], Document.prototype, "milestoneId", void 0);
__decorate([
    ManyToOne(() => Milestone, (milestone) => milestone.documents),
    JoinColumn({ name: "milestone_id" }),
    __metadata("design:type", typeof (_a = typeof Milestone !== "undefined" && Milestone) === "function" ? _a : Object)
], Document.prototype, "milestone", void 0);
__decorate([
    Column({ name: "doc_type", length: 30 }),
    __metadata("design:type", String)
], Document.prototype, "docType", void 0);
__decorate([
    Column({ name: "storage_url", type: "text", nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "storageUrl", void 0);
__decorate([
    Column({ name: "uploaded_by", type: "uuid" }),
    __metadata("design:type", String)
], Document.prototype, "uploadedBy", void 0);
__decorate([
    ManyToOne(() => User),
    JoinColumn({ name: "uploaded_by" }),
    __metadata("design:type", typeof (_b = typeof User !== "undefined" && User) === "function" ? _b : Object)
], Document.prototype, "uploader", void 0);
__decorate([
    CreateDateColumn({ name: "uploaded_at" }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Document.prototype, "uploadedAt", void 0);
Document = __decorate([
    Entity("documents")
], Document);
export { Document };
