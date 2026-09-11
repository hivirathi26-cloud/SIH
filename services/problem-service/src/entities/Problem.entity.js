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
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User.entity";
import { ProblemMedia } from "./ProblemMedia.entity";
let Problem = class Problem {
    id;
    submittedBy;
    user;
    title;
    description;
    descriptionOriginalLang;
    detectedLanguage;
    category;
    subCategory;
    categoryConfidence;
    priorityScore;
    status; // submitted, under_ai_review, pending_nodal_review, rejected, routed, accepted_by_hei, team_formed, in_progress, industry_matched, deployed, closed
    district;
    latitude;
    longitude;
    isDuplicateOf;
    citizenSupportCount;
    sdgTags;
    media;
    createdAt;
    updatedAt;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Problem.prototype, "id", void 0);
__decorate([
    Column({ name: "submitted_by", type: "uuid" }),
    __metadata("design:type", String)
], Problem.prototype, "submittedBy", void 0);
__decorate([
    ManyToOne(() => User),
    JoinColumn({ name: "submitted_by" }),
    __metadata("design:type", typeof (_a = typeof User !== "undefined" && User) === "function" ? _a : Object)
], Problem.prototype, "user", void 0);
__decorate([
    Column({ length: 200 }),
    __metadata("design:type", String)
], Problem.prototype, "title", void 0);
__decorate([
    Column("text"),
    __metadata("design:type", String)
], Problem.prototype, "description", void 0);
__decorate([
    Column({ name: "description_original_lang", type: "text", nullable: true }),
    __metadata("design:type", String)
], Problem.prototype, "descriptionOriginalLang", void 0);
__decorate([
    Column({ name: "detected_language", length: 10, nullable: true }),
    __metadata("design:type", String)
], Problem.prototype, "detectedLanguage", void 0);
__decorate([
    Column({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Problem.prototype, "category", void 0);
__decorate([
    Column({ name: "sub_category", length: 80, nullable: true }),
    __metadata("design:type", String)
], Problem.prototype, "subCategory", void 0);
__decorate([
    Column({ name: "category_confidence", type: "float", nullable: true }),
    __metadata("design:type", Number)
], Problem.prototype, "categoryConfidence", void 0);
__decorate([
    Column({ name: "priority_score", type: "float", nullable: true }),
    __metadata("design:type", Number)
], Problem.prototype, "priorityScore", void 0);
__decorate([
    Column({ length: 30, default: "submitted" }),
    __metadata("design:type", String)
], Problem.prototype, "status", void 0);
__decorate([
    Column({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Problem.prototype, "district", void 0);
__decorate([
    Column({ type: "double precision", nullable: true }),
    __metadata("design:type", Number)
], Problem.prototype, "latitude", void 0);
__decorate([
    Column({ type: "double precision", nullable: true }),
    __metadata("design:type", Number)
], Problem.prototype, "longitude", void 0);
__decorate([
    Column({ name: "is_duplicate_of", type: "uuid", nullable: true }),
    __metadata("design:type", String)
], Problem.prototype, "isDuplicateOf", void 0);
__decorate([
    Column({ name: "citizen_support_count", default: 1 }),
    __metadata("design:type", Number)
], Problem.prototype, "citizenSupportCount", void 0);
__decorate([
    Column("text", { array: true, default: "{}" }),
    __metadata("design:type", Array)
], Problem.prototype, "sdgTags", void 0);
__decorate([
    OneToMany(() => ProblemMedia, (media) => media.problem),
    __metadata("design:type", Array)
], Problem.prototype, "media", void 0);
__decorate([
    CreateDateColumn({ name: "created_at" }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Problem.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: "updated_at" }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Problem.prototype, "updatedAt", void 0);
Problem = __decorate([
    Entity("problems")
], Problem);
export { Problem };
