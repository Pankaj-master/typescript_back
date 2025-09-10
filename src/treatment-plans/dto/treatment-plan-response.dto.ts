export class TreatmentPlanResponseDto {
  id: number;
  title: string;
  description: string;
  dailyRoutine: any;
  dietPlan: any;
  herbsSupplements: string[];
  lifestyleRecommendations: string[];
  yogaPranayama: string[];
  panchakarmaTherapies: string[];
  startDate: Date;
  endDate: Date;
  status: string;
  practitioner: { id: number; firstName: string; lastName: string };
  client: { id: number; firstName: string; lastName: string };
  createdAt: Date;
  updatedAt: Date;
}