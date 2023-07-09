import { IsNotEmpty, IsUUID } from 'class-validator';

export class SubscribeSimulationPayload {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
