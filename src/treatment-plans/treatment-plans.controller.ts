import { Controller, Get, Post, Body, Param, Put, Delete, Patch } from '@nestjs/common';
import { TreatmentPlansService } from './treatment-plans.service';
import { CreateTreatmentPlanDto } from './dto/create-treatment-plan.dto';
import { UpdateTreatmentPlanDto } from './dto/update-treatment-plan.dto';
import { TreatmentPlan } from './entities/treatment-plan.entity';

@Controller('treatment-plans')
export class TreatmentPlansController {
  constructor(private readonly treatmentPlansService: TreatmentPlansService) {}

  @Post()
  create(@Body() createTreatmentPlanDto: CreateTreatmentPlanDto): Promise<TreatmentPlan> {
    return this.treatmentPlansService.create(createTreatmentPlanDto);
  }

  @Get()
  findAll(): Promise<TreatmentPlan[]> {
    return this.treatmentPlansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<TreatmentPlan> {
    return this.treatmentPlansService.findOne(+id);
  }

  @Get('client/:clientId')
  findByClient(@Param('clientId') clientId: string): Promise<TreatmentPlan[]> {
    return this.treatmentPlansService.findByClient(+clientId);
  }

  @Get('practitioner/:practitionerId')
  findByPractitioner(@Param('practitionerId') practitionerId: string): Promise<TreatmentPlan[]> {
    return this.treatmentPlansService.findByPractitioner(+practitionerId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTreatmentPlanDto: UpdateTreatmentPlanDto): Promise<TreatmentPlan> {
    return this.treatmentPlansService.update(+id, updateTreatmentPlanDto);
  }

  @Patch(':id/status/:status')
  changeStatus(@Param('id') id: string, @Param('status') status: string): Promise<TreatmentPlan> {
    return this.treatmentPlansService.changeStatus(+id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.treatmentPlansService.remove(+id);
  }
}