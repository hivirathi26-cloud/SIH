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
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
let User = class User {
    id;
    fullName;
    phone;
    email;
    passwordHash;
    role; // citizen, community_group, pri, ulb, govt_officer, university_nodal, faculty, student, startup, msme, csr, research_lab, state_admin, district_officer
    organizationName;
    district;
    aadhaarVerified;
    createdAt;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    Column({ name: "full_name", length: 150 }),
    __metadata("design:type", String)
], User.prototype, "fullName", void 0);
__decorate([
    Column({ unique: true, length: 15 }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    Column({ unique: true, length: 150, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Column({ name: "password_hash", type: "text", nullable: true }),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    Column({ length: 30 }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    Column({ name: "organization_name", length: 200, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "organizationName", void 0);
__decorate([
    Column({ length: 100, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "district", void 0);
__decorate([
    Column({ name: "aadhaar_verified", default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "aadhaarVerified", void 0);
__decorate([
    CreateDateColumn({ name: "created_at" }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], User.prototype, "createdAt", void 0);
User = __decorate([
    Entity("users")
], User);
export { User };
