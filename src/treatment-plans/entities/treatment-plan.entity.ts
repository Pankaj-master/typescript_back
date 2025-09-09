import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { User } from '../../users/entities/user.entity';

@Entity('treatment_plans')
export class TreatmentPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  practitioner: User;

  @ManyToOne(() => Client, client => client.appointments, { eager: true })
  client: Client;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'json' })
  dailyRoutine: {
    morning: string[];
    afternoon: string[];
    evening: string[];
  };

  @Column({ type: 'json' })
  dietPlan: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };

  @Column({ type: 'json' })
  herbsSupplements: string[];

  @Column({ type: 'json' })
  lifestyleRecommendations: string[];

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ default: 'active' })
  status: string; // active, completed, paused

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}