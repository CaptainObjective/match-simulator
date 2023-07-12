import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Tournament } from '../models/tournament.model';
import { FootballTournamentOutgoingEventsGateway } from '../gateways/football-tournament-outgoing-events.gateway';

const oneSecond = 1000;

@Injectable()
export class SimulationService {
  private simulations: Tournament[] = [];

  constructor(private readonly outgoingEventsGateway: FootballTournamentOutgoingEventsGateway) {}

  @Interval(oneSecond)
  updateTournaments() {
    this.simulations.forEach((tournament) => {
      if (tournament.isFinished) return;

      tournament.update();

      if (tournament.isCurrentMinuteDivisibleByTen) {
        this.outgoingEventsGateway.updateScoreForConnectedClients(tournament);
      }
    });
  }

  addTournament(tournament: Tournament) {
    this.simulations.push(tournament);
  }

  stopSimulation(id: string) {
    const simulation = this.findSimulationById(id);
    if (simulation) {
      simulation.finish();
    }
  }

  restartSimulation(id: string) {
    const simulation = this.findSimulationById(id);

    if (simulation && simulation.isFinished) {
      simulation.restart();
    }
  }

  findSimulationById(id: string) {
    return this.simulations.find((simulation) => id === simulation.id);
  }
}
