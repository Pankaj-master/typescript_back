import { IsNotEmpty, IsNumber, IsString, IsArray, IsDateString, IsOptional, IsObject } from 'class-validator';

export class CreateTreatmentPlanDto {
  @IsNumber()
  @IsNotEmpty()
  practitionerId: number;

  @IsNumber()
  @IsNotEmpty()
  clientId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsObject()
  @IsNotEmpty()
  dailyRoutine: {
    morning: string[];
    afternoon: string[];
    evening: string[];
  };

  @IsObject()
  @IsNotEmpty()
  dietPlan: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };

  @IsArray()
  @IsNotEmpty()
  herbsSupplements: string[];

  @IsArray()
  @IsNotEmpty()
  lifestyleRecommendations: string[];

  @IsArray()
  @IsOptional()
  yogaPranayama?: string[];

  @IsArray()
  @IsOptional()
  panchakarmaTherapies?: string[];

  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @IsString()
  @IsOptional()
  status?: string = 'active';
}