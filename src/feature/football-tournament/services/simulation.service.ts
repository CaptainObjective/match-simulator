import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Tournament } from '../models/tournament.model';
import { FootballTournamentOutgoingEventsGateway } from '../gateways/football-tournament-outgoing-events.gateway';
import { err, ok } from 'neverthrow';

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
    const result = this.findSimulationById(id);
    if (result.isErr()) return result;

    const simulation = result.value;
    if (!simulation) return err('Simulation with given id does not exist');

    simulation.finish();
    return ok(simulation);
  }

  restartSimulation(id: string) {
    const result = this.findSimulationById(id);
    if (result.isErr()) return result;

    const simulation = result.value;
    if (!simulation.isFinished) return err('Simulation is still running');

    simulation.restart();
    return ok(simulation);
  }

  findSimulationById(id: string) {
    const simulation = this.simulations.find((simulation) => id === simulation.id);
    return simulation ? ok(simulation) : err('Simulation with given id does not exist');
  }
}
