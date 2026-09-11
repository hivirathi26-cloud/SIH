var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Problem } from "./Problem.entity";
import { University } from "./University.entity";
import { User } from "./User.entity";
import { TeamMember } from "./TeamMember.entity";
let Team = class Team {
    id;
    problemId;
    problem;
    universityId;
    university;
    facultyMentorId;
    facultyMentor;
    members;
    createdAt;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Team.prototype, "id", void 0);
__decorate([
    Column({ name: "problem_id", type: "uuid" }),
    __metadata("design:type", String)
], Team.prototype, "problemId", void 0);
__decorate([
    ManyToOne(() => Problem),
    JoinColumn({ name: "problem_id" }),
    __metadata("design:type", typeof (_a = typeof Problem !== "undefined" && Problem) === "function" ? _a : Object)
], Team.prototype, "problem", void 0);
__decorate([
    Column({ name: "university_id", type: "uuid" }),
    __metadata("design:type", String)
], Team.prototype, "universityId", void 0);
__decorate([
    ManyToOne(() => University),
    JoinColumn({ name: "university_id" }),
    __metadata("design:type", typeof (_b = typeof University !== "undefined" && University) === "function" ? _b : Object)
], Team.prototype, "university", void 0);
__decorate([
    Column({ name: "faculty_mentor_id", type: "uuid" }),
    __metadata("design:type", String)
], Team.prototype, "facultyMentorId", void 0);
__decorate([
    ManyToOne(() => User),
    JoinColumn({ name: "faculty_mentor_id" }),
    __metadata("design:type", typeof (_c = typeof User !== "undefined" && User) === "function" ? _c : Object)
], Team.prototype, "facultyMentor", void 0);
__decorate([
    OneToMany(() => TeamMember, (member) => member.team),
    __metadata("design:type", Array)
], Team.prototype, "members", void 0);
__decorate([
    CreateDateColumn({ name: "created_at" }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Team.prototype, "createdAt", void 0);
Team = __decorate([
    Entity("teams")
], Team);
export { Team };
