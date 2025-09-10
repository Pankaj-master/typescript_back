import { Controller, Get, Post, Body, Param, Put, Delete, Patch } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  findAll(): Promise<Client[]> {
    return this.clientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Client> {
    return this.clientsService.findOne(+id);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string): Promise<Client> {
    return this.clientsService.findByUserId(+userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto): Promise<Client> {
    return this.clientsService.update(+id, updateClientDto);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string): Promise<Client> {
    return this.clientsService.deactivate(+id);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string): Promise<Client> {
    return this.clientsService.activate(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.clientsService.remove(+id);
  }
}