import { IsNotEmpty, IsUUID } from 'class-validator';

export class RestartSimulationPayload {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
