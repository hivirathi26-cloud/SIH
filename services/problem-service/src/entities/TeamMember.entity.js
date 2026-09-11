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
import { User } from "./User.entity";
let TeamMember = class TeamMember {
    id;
    teamId;
    team;
    studentId;
    student;
    discipline;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], TeamMember.prototype, "id", void 0);
__decorate([
    Column({ name: "team_id", type: "uuid" }),
    __metadata("design:type", String)
], TeamMember.prototype, "teamId", void 0);
__decorate([
    ManyToOne(() => Team, (team) => team.members),
    JoinColumn({ name: "team_id" }),
    __metadata("design:type", typeof (_a = typeof Team !== "undefined" && Team) === "function" ? _a : Object)
], TeamMember.prototype, "team", void 0);
__decorate([
    Column({ name: "student_id", type: "uuid" }),
    __metadata("design:type", String)
], TeamMember.prototype, "studentId", void 0);
__decorate([
    ManyToOne(() => User),
    JoinColumn({ name: "student_id" }),
    __metadata("design:type", typeof (_b = typeof User !== "undefined" && User) === "function" ? _b : Object)
], TeamMember.prototype, "student", void 0);
__decorate([
    Column({ length: 80 }),
    __metadata("design:type", String)
], TeamMember.prototype, "discipline", void 0);
TeamMember = __decorate([
    Entity("team_members")
], TeamMember);
export { TeamMember };
