import { IsNotEmpty } from 'class-validator';
import { IsTournamentName } from '../validators/is-tournament-name';

export class StartTournamentPayload {
  @IsNotEmpty()
  @IsTournamentName()
  name: string;
}
