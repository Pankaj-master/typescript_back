import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { User } from '../users/entities/user.entity';
import { Client } from '../clients/entities/client.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const practitioner = await this.usersRepository.findOne({ 
      where: { id: createAppointmentDto.practitionerId } 
    });
    if (!practitioner) {
      throw new NotFoundException('Practitioner not found');
    }

    const client = await this.clientsRepository.findOne({ 
      where: { id: createAppointmentDto.clientId } 
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const appointment = this.appointmentsRepository.create({
      ...createAppointmentDto,
      practitioner,
      client,
    });

    return await this.appointmentsRepository.save(appointment);
  }

  async findAll(): Promise<Appointment[]> {
    return await this.appointmentsRepository.find({
      relations: ['practitioner', 'client'],
      order: { startTime: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['practitioner', 'client'],
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);
    
    if (updateAppointmentDto.practitionerId) {
      const practitioner = await this.usersRepository.findOne({ 
        where: { id: updateAppointmentDto.practitionerId } 
      });
      if (!practitioner) {
        throw new NotFoundException('Practitioner not found');
      }
      appointment.practitioner = practitioner;
    }

    if (updateAppointmentDto.clientId) {
      const client = await this.clientsRepository.findOne({ 
        where: { id: updateAppointmentDto.clientId } 
      });
      if (!client) {
        throw new NotFoundException('Client not found');
      }
      appointment.client = client;
    }

    Object.assign(appointment, updateAppointmentDto);
    return await this.appointmentsRepository.save(appointment);
  }

  async remove(id: number): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentsRepository.remove(appointment);
  }

  async findByPractitioner(practitionerId: number): Promise<Appointment[]> {
    return await this.appointmentsRepository.find({
      where: { practitioner: { id: practitionerId } },
      relations: ['practitioner', 'client'],
      order: { startTime: 'ASC' },
    });
  }

  async findByClient(clientId: number): Promise<Appointment[]> {
    return await this.appointmentsRepository.find({
      where: { client: { id: clientId } },
      relations: ['practitioner', 'client'],
      order: { startTime: 'ASC' },
    });
  }
}