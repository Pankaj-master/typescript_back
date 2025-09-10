export class AppointmentResponseDto {
  id: number;
  title: string;
  startTime: Date;
  endTime: Date;
  status: string;
  notes?: string;
  prescription?: string;
  recommendations?: string;
  practitioner: { id: number; firstName: string; lastName: string };
  client: { id: number; firstName: string; lastName: string };
  createdAt: Date;
  updatedAt: Date;
}