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
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User.entity";
let Notification = class Notification {
    id;
    userId;
    user;
    channel; // sms, whatsapp, email, push
    eventType;
    payload;
    sentAt;
    status; // queued, sent, delivered, read
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Notification.prototype, "id", void 0);
__decorate([
    Column({ name: "user_id", type: "uuid" }),
    __metadata("design:type", String)
], Notification.prototype, "userId", void 0);
__decorate([
    ManyToOne(() => User),
    JoinColumn({ name: "user_id" }),
    __metadata("design:type", typeof (_a = typeof User !== "undefined" && User) === "function" ? _a : Object)
], Notification.prototype, "user", void 0);
__decorate([
    Column({ length: 20 }),
    __metadata("design:type", String)
], Notification.prototype, "channel", void 0);
__decorate([
    Column({ name: "event_type", length: 50 }),
    __metadata("design:type", String)
], Notification.prototype, "eventType", void 0);
__decorate([
    Column("jsonb", { nullable: true }),
    __metadata("design:type", Object)
], Notification.prototype, "payload", void 0);
__decorate([
    CreateDateColumn({ name: "sent_at" }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Notification.prototype, "sentAt", void 0);
__decorate([
    Column({ length: 20, default: "queued" }),
    __metadata("design:type", String)
], Notification.prototype, "status", void 0);
Notification = __decorate([
    Entity("notifications")
], Notification);
export { Notification };
