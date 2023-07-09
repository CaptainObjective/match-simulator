import { IsNotEmpty, IsUUID } from 'class-validator';

export class StopSimulationPayload {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
