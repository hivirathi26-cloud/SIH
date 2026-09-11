var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Problem } from "./Problem.entity";
let ProblemMedia = class ProblemMedia {
    id;
    problemId;
    problem;
    mediaType; // image, video, document, audio
    storageUrl;
    cvValidationLabel;
    cvValidationConfidence;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], ProblemMedia.prototype, "id", void 0);
__decorate([
    Column({ name: "problem_id", type: "uuid" }),
    __metadata("design:type", String)
], ProblemMedia.prototype, "problemId", void 0);
__decorate([
    ManyToOne(() => Problem, (problem) => problem.media),
    JoinColumn({ name: "problem_id" }),
    __metadata("design:type", typeof (_a = typeof Problem !== "undefined" && Problem) === "function" ? _a : Object)
], ProblemMedia.prototype, "problem", void 0);
__decorate([
    Column({ name: "media_type", length: 20 }),
    __metadata("design:type", String)
], ProblemMedia.prototype, "mediaType", void 0);
__decorate([
    Column({ name: "storage_url", type: "text" }),
    __metadata("design:type", String)
], ProblemMedia.prototype, "storageUrl", void 0);
__decorate([
    Column({ name: "cv_validation_label", type: "text", nullable: true }),
    __metadata("design:type", String)
], ProblemMedia.prototype, "cvValidationLabel", void 0);
__decorate([
    Column({ name: "cv_validation_confidence", type: "float", nullable: true }),
    __metadata("design:type", Number)
], ProblemMedia.prototype, "cvValidationConfidence", void 0);
ProblemMedia = __decorate([
    Entity("problem_media")
], ProblemMedia);
export { ProblemMedia };
