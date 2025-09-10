import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TreatmentPlan } from './entities/treatment-plan.entity';
import { CreateTreatmentPlanDto } from './dto/create-treatment-plan.dto';
import { UpdateTreatmentPlanDto } from './dto/update-treatment-plan.dto';
import { User } from '../users/entities/user.entity';
import { Client } from '../clients/entities/client.entity';

@Injectable()
export class TreatmentPlansService {
  constructor(
    @InjectRepository(TreatmentPlan)
    private treatmentPlansRepository: Repository<TreatmentPlan>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async create(createTreatmentPlanDto: CreateTreatmentPlanDto): Promise<TreatmentPlan> {
    const practitioner = await this.usersRepository.findOne({ 
      where: { id: createTreatmentPlanDto.practitionerId } 
    });
    if (!practitioner) {
      throw new NotFoundException('Practitioner not found');
    }

    const client = await this.clientsRepository.findOne({ 
      where: { id: createTreatmentPlanDto.clientId } 
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const treatmentPlan = this.treatmentPlansRepository.create({
      ...createTreatmentPlanDto,
      practitioner,
      client,
    });

    return await this.treatmentPlansRepository.save(treatmentPlan);
  }

  async findAll(): Promise<TreatmentPlan[]> {
    return await this.treatmentPlansRepository.find({
      relations: ['practitioner', 'client'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<TreatmentPlan> {
    const treatmentPlan = await this.treatmentPlansRepository.findOne({
      where: { id },
      relations: ['practitioner', 'client'],
    });
    if (!treatmentPlan) {
      throw new NotFoundException(`Treatment plan with ID ${id} not found`);
    }
    return treatmentPlan;
  }

  async findByClient(clientId: number): Promise<TreatmentPlan[]> {
    return await this.treatmentPlansRepository.find({
      where: { client: { id: clientId } },
      relations: ['practitioner', 'client'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByPractitioner(practitionerId: number): Promise<TreatmentPlan[]> {
    return await this.treatmentPlansRepository.find({
      where: { practitioner: { id: practitionerId } },
      relations: ['practitioner', 'client'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updateTreatmentPlanDto: UpdateTreatmentPlanDto): Promise<TreatmentPlan> {
    const treatmentPlan = await this.findOne(id);
    
    if (updateTreatmentPlanDto.practitionerId) {
      const practitioner = await this.usersRepository.findOne({ 
        where: { id: updateTreatmentPlanDto.practitionerId } 
      });
      if (!practitioner) {
        throw new NotFoundException('Practitioner not found');
      }
      treatmentPlan.practitioner = practitioner;
    }

    if (updateTreatmentPlanDto.clientId) {
      const client = await this.clientsRepository.findOne({ 
        where: { id: updateTreatmentPlanDto.clientId } 
      });
      if (!client) {
        throw new NotFoundException('Client not found');
      }
      treatmentPlan.client = client;
    }

    Object.assign(treatmentPlan, updateTreatmentPlanDto);
    return await this.treatmentPlansRepository.save(treatmentPlan);
  }

  async remove(id: number): Promise<void> {
    const treatmentPlan = await this.findOne(id);
    await this.treatmentPlansRepository.remove(treatmentPlan);
  }

  async changeStatus(id: number, status: string): Promise<TreatmentPlan> {
    const treatmentPlan = await this.findOne(id);
    treatmentPlan.status = status;
    return await this.treatmentPlansRepository.save(treatmentPlan);
  }
}