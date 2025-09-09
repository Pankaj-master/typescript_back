import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { eager: true })
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

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Appointment, appointment => appointment.client)
  appointments: Appointment[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}