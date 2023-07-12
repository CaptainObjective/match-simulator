import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { err, ok } from 'neverthrow';

import { FootballSimulationOutgoingEventsGateway } from '../gateways/football-simulation-outgoing-events.gateway';
import { Simulation } from '../domain/simulation';

const oneSecond = 1000;

@Injectable()
export class SimulationRunnerService {
  private simulations: Simulation[] = [];

  constructor(private readonly outgoingEventsGateway: FootballSimulationOutgoingEventsGateway) {}

  @Interval(oneSecond)
  updateSimulations() {
    this.simulations.forEach((simulation) => {
      if (simulation.isFinished) return;

      simulation.update();

      if (simulation.isCurrentMinuteDivisibleByTen) {
        this.outgoingEventsGateway.updateScoreForConnectedClients(simulation);
      }
    });
  }

  addSimulation(name: string) {
    const simulation = new Simulation(name);
    this.simulations.push(simulation);

    return simulation;
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
