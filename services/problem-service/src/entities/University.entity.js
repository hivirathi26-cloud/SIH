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
import { User } from "./User.entity";
let University = class University {
    id;
    name;
    district;
    expertiseDomains;
    nodalOfficerId;
    nodalOfficer;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], University.prototype, "id", void 0);
__decorate([
    Column({ length: 200 }),
    __metadata("design:type", String)
], University.prototype, "name", void 0);
__decorate([
    Column({ length: 100, nullable: true }),
    __metadata("design:type", String)
], University.prototype, "district", void 0);
__decorate([
    Column("text", { array: true, default: "{}" }),
    __metadata("design:type", Array)
], University.prototype, "expertiseDomains", void 0);
__decorate([
    Column({ name: "nodal_officer_id", type: "uuid", nullable: true }),
    __metadata("design:type", String)
], University.prototype, "nodalOfficerId", void 0);
__decorate([
    ManyToOne(() => User),
    JoinColumn({ name: "nodal_officer_id" }),
    __metadata("design:type", typeof (_a = typeof User !== "undefined" && User) === "function" ? _a : Object)
], University.prototype, "nodalOfficer", void 0);
University = __decorate([
    Entity("universities")
], University);
export { University };
