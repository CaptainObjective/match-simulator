import { Module } from '@nestjs/common';
import { FootballTournamentGateway } from './football-tournament.gateway';

@Module({
  providers: [FootballTournamentGateway],
})
export class FootballTournamentModule {}
