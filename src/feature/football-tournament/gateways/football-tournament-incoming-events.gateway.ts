import { ConnectedSocket, MessageBody, Socket, SubscribeMessage, WebSocketGateway } from 'src/shared/websockets';
import { StartTournamentPayload } from '../models/start-tournament-payload.model';
import { Tournament } from '../models/tournament.model';
import { SimulationService } from '../services/simulation.service';
import { StopSimulationPayload } from '../models/stop-simulation-payload.model';
import { SubscribeSimulationPayload } from '../models/subscribe-simulation-payload.model';
import { RestartSimulationPayload } from '../models/restart-simulation-payload.model';

@WebSocketGateway('football-tournament')
export class FootballTournamentIncomingEventsGateway {
  constructor(private readonly simulationService: SimulationService) {}

  @SubscribeMessage('start')
  handleStart(@ConnectedSocket() socket: Socket, @MessageBody() { name }: StartTournamentPayload) {
    const simulation = new Tournament(name);
    this.simulationService.addTournament(simulation);
    socket.join(simulation.id);

    return { simulation: simulation.info };
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(@ConnectedSocket() socket: Socket, @MessageBody() { id }: SubscribeSimulationPayload) {
    const simulation = this.simulationService.findSimulationById(id);

    if (!simulation) {
      return { message: 'Simulation does not exists' };
    }

    socket.join(simulation.id);

    return { simulation: simulation.info };
  }

  @SubscribeMessage('stop')
  handleStop(@MessageBody() { id }: StopSimulationPayload) {
    const simulation = this.simulationService.findSimulationById(id);

    if (!simulation) {
      return { message: 'Simulation with given id does not exist' };
    }

    this.simulationService.stopSimulation(id);

    return id;
  }

  @SubscribeMessage('restart')
  handleRestart(@MessageBody() { id }: RestartSimulationPayload) {
    const simulation = this.simulationService.findSimulationById(id);

    if (!simulation) {
      return { message: 'Simulation does not exists' };
    }

    this.simulationService.restartSimulation(id);
  }
}
