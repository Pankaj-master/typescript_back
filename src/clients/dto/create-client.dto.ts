import { IsNotEmpty, IsOptional, IsBoolean, IsObject, IsArray, IsString } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty()
  userId: number;

  @IsObject()
  @IsOptional()
  prakriti?: {
    vata: number;
    pitta: number;
    kapha: number;
    dominant: string;
  };

  @IsObject()
  @IsOptional()
  vikriti?: {
    vata: number;
    pitta: number;
    kapha: number;
    imbalance: string;
  };

  @IsString()
  @IsOptional()
  medicalHistory?: string;

  @IsString()
  @IsOptional()
  lifestyleInfo?: string;

  @IsArray()
  @IsOptional()
  dietaryPreferences?: string[];

  @IsString()
  @IsOptional()
  allergies?: string;

  @IsString()
  @IsOptional()
  medications?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}