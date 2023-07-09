import { Module } from '@nestjs/common';
import { FootballTournamentIncomingEventsGateway } from './gateways/football-tournament-incoming-events.gateway';
import { SimulationService } from './services/simulation.service';
import { FootballTournamentOutgoingEventsGateway } from './gateways/football-tournament-outgoing-events.gateway';

@Module({
  providers: [FootballTournamentIncomingEventsGateway, FootballTournamentOutgoingEventsGateway, SimulationService],
})
export class FootballTournamentModule {}
