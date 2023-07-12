import { Module } from '@nestjs/common';
import { FootballTournamentIncomingEventsGateway } from './gateways/football-tournament-incoming-events.gateway';
import { SimulationService } from './services/simulation.service';
import { FootballTournamentOutgoingEventsGateway } from './gateways/football-tournament-outgoing-events.gateway';
import { RateLimitInterceptor } from './interceptors/rate-limit.interceptor';

@Module({
  providers: [
    FootballTournamentIncomingEventsGateway,
    FootballTournamentOutgoingEventsGateway,
    SimulationService,
    RateLimitInterceptor,
  ],
})
export class FootballTournamentModule {}
