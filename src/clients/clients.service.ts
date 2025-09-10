import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { User } from '../users/entities/user.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const user = await this.usersRepository.findOne({ 
      where: { id: createClientDto.userId } 
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const client = this.clientsRepository.create({
      ...createClientDto,
      user,
    });

    return await this.clientsRepository.save(client);
  }

  async findAll(): Promise<Client[]> {
    return await this.clientsRepository.find({
      relations: ['user', 'appointments'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientsRepository.findOne({
      where: { id },
      relations: ['user', 'appointments'],
    });
    
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    
    return client;
  }

  async findByUserId(userId: number): Promise<Client> {
    const client = await this.clientsRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'appointments'],
    });
    
    if (!client) {
      throw new NotFoundException(`Client with user ID ${userId} not found`);
    }
    
    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);
    
    if (updateClientDto.userId) {
      const user = await this.usersRepository.findOne({ 
        where: { id: updateClientDto.userId } 
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      client.user = user;
    }

    Object.assign(client, updateClientDto);
    return await this.clientsRepository.save(client);
  }

  async remove(id: number): Promise<void> {
    const client = await this.findOne(id);
    await this.clientsRepository.remove(client);
  }

  async deactivate(id: number): Promise<Client> {
    const client = await this.findOne(id);
    client.isActive = false;
    return await this.clientsRepository.save(client);
  }

  async activate(id: number): Promise<Client> {
    const client = await this.findOne(id);
    client.isActive = true;
    return await this.clientsRepository.save(client);
  }
}