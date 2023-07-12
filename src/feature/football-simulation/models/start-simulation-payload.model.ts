import { IsNotEmpty } from 'class-validator';
import { IsSimulationName } from '../validators/is-simulation-name.validator';

export class StartSimulationPayload {
  @IsNotEmpty()
  @IsSimulationName()
  name: string;
}
