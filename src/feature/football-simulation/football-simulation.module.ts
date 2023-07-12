import { Module } from '@nestjs/common';
import { FootballSimulationIncomingEventsGateway } from './gateways/football-simulation-incoming-events.gateway';
import { SimulationRunnerService } from './services/simulation-runner.service';
import { FootballSimulationOutgoingEventsGateway } from './gateways/football-simulation-outgoing-events.gateway';
import { RateLimitInterceptor } from './interceptors/rate-limit.interceptor';

@Module({
  providers: [
    FootballSimulationIncomingEventsGateway,
    FootballSimulationOutgoingEventsGateway,
    SimulationRunnerService,
    RateLimitInterceptor,
  ],
})
export class FootballSimulationModule {}
