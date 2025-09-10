import { User } from '../../users/entities/user.entity';

export class ClientResponseDto {
  id: number;
  prakriti: any;
  vikriti: any;
  medicalHistory: string;
  lifestyleInfo: string;
  dietaryPreferences: string[];
  allergies: string;
  medications: string;
  isActive: boolean;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}