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
let IndustryPartner = class IndustryPartner {
    id;
    userId;
    user;
    orgType; // startup, msme, csr, research_lab, large_industry
    sectors;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], IndustryPartner.prototype, "id", void 0);
__decorate([
    Column({ name: "user_id", type: "uuid" }),
    __metadata("design:type", String)
], IndustryPartner.prototype, "userId", void 0);
__decorate([
    ManyToOne(() => User),
    JoinColumn({ name: "user_id" }),
    __metadata("design:type", typeof (_a = typeof User !== "undefined" && User) === "function" ? _a : Object)
], IndustryPartner.prototype, "user", void 0);
__decorate([
    Column({ name: "org_type", length: 30 }),
    __metadata("design:type", String)
], IndustryPartner.prototype, "orgType", void 0);
__decorate([
    Column("text", { array: true, default: "{}" }),
    __metadata("design:type", Array)
], IndustryPartner.prototype, "sectors", void 0);
IndustryPartner = __decorate([
    Entity("industry_partners")
], IndustryPartner);
export { IndustryPartner };
