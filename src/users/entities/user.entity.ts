import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Appointment } from '../../appointments/entities/appointment.entity';

export type UserRole = 'practitioner' | 'patient' | 'admin';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  // FIXED: Proper enum type for role
  @Column({
    type: 'enum',
    enum: ['practitioner', 'patient', 'admin', 'dietitian'], // Added 'dietitian' role
    default: 'patient'
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  // Relationships
  @OneToMany(() => Appointment, appointment => appointment.practitioner)
  appointments: Appointment[];

  @OneToMany(() => Appointment, appointment => appointment.client)
  clientAppointments: Appointment[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}