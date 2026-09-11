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
import { Problem } from "./Problem.entity";
import { University } from "./University.entity";
let RoutingRecommendation = class RoutingRecommendation {
    id;
    problemId;
    problem;
    universityId;
    university;
    matchScore;
    rank;
    status; // suggested, accepted, declined
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], RoutingRecommendation.prototype, "id", void 0);
__decorate([
    Column({ name: "problem_id", type: "uuid" }),
    __metadata("design:type", String)
], RoutingRecommendation.prototype, "problemId", void 0);
__decorate([
    ManyToOne(() => Problem),
    JoinColumn({ name: "problem_id" }),
    __metadata("design:type", typeof (_a = typeof Problem !== "undefined" && Problem) === "function" ? _a : Object)
], RoutingRecommendation.prototype, "problem", void 0);
__decorate([
    Column({ name: "university_id", type: "uuid" }),
    __metadata("design:type", String)
], RoutingRecommendation.prototype, "universityId", void 0);
__decorate([
    ManyToOne(() => University),
    JoinColumn({ name: "university_id" }),
    __metadata("design:type", typeof (_b = typeof University !== "undefined" && University) === "function" ? _b : Object)
], RoutingRecommendation.prototype, "university", void 0);
__decorate([
    Column("float"),
    __metadata("design:type", Number)
], RoutingRecommendation.prototype, "matchScore", void 0);
__decorate([
    Column("int"),
    __metadata("design:type", Number)
], RoutingRecommendation.prototype, "rank", void 0);
__decorate([
    Column({ length: 20, default: "suggested" }),
    __metadata("design:type", String)
], RoutingRecommendation.prototype, "status", void 0);
RoutingRecommendation = __decorate([
    Entity("routing_recommendations")
], RoutingRecommendation);
export { RoutingRecommendation };
