import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { eager: true, cascade: true })
  @JoinColumn()
  user: User;

  @Column({ type: 'json', nullable: true })
  prakriti: {
    vata: number;
    pitta: number;
    kapha: number;
    dominant: string;
  };

  @Column({ type: 'json', nullable: true })
  vikriti: {
    vata: number;
    pitta: number;
    kapha: number;
    imbalance: string;
  };

  @Column({ type: 'text', nullable: true })
  medicalHistory: string;

  @Column({ type: 'text', nullable: true })
  lifestyleInfo: string;

  @Column({ type: 'json', nullable: true })
  dietaryPreferences: string[];

  @Column({ type: 'text', nullable: true })
  allergies: string;

  @Column({ type: 'text', nullable: true })
  medications: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Appointment, appointment => appointment.client)
  appointments: Appointment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}