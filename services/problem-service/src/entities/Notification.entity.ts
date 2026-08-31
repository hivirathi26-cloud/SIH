import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User.entity";

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id", type: "uuid" })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ length: 20 })
  channel: string; // sms, whatsapp, email, push

  @Column({ name: "event_type", length: 50 })
  eventType: string;

  @Column("jsonb", { nullable: true })
  payload: any;

  @CreateDateColumn({ name: "sent_at" })
  sentAt: Date;

  @Column({ length: 20, default: "queued" })
  status: string; // queued, sent, delivered, read
}
