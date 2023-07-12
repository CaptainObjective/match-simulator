import {
  ConnectedSocket,
  MessageBody,
  Socket,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from 'src/shared/websockets';
import { StartTournamentPayload } from '../models/start-tournament-payload.model';
import { SimulationService } from '../services/simulation.service';
import { StopSimulationPayload } from '../models/stop-simulation-payload.model';
import { SubscribeSimulationPayload } from '../models/subscribe-simulation-payload.model';
import { RestartSimulationPayload } from '../models/restart-simulation-payload.model';
import { RateLimit } from '../interceptors/rate-limit.interceptor';

@WebSocketGateway('football-tournament')
export class FootballTournamentIncomingEventsGateway {
  constructor(private readonly simulationService: SimulationService) {}

  @RateLimit()
  @SubscribeMessage('start')
  handleStart(@ConnectedSocket() socket: Socket, @MessageBody() { name }: StartTournamentPayload) {
    const simulation = this.simulationService.addTournament(name);
    socket.join(simulation.id);

    return { simulation: simulation.info };
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(@ConnectedSocket() socket: Socket, @MessageBody() { id }: SubscribeSimulationPayload) {
    const result = this.simulationService.findSimulationById(id);
    if (result.isErr()) throw new WsException(result.error);

    const simulation = result.value;
    socket.join(simulation.id);

    return { simulation: simulation.info };
  }

  @SubscribeMessage('stop')
  handleStop(@MessageBody() { id }: StopSimulationPayload) {
    const result = this.simulationService.stopSimulation(id);
    if (result.isErr()) throw new WsException(result.error);

    return id;
  }

  @SubscribeMessage('restart')
  handleRestart(@ConnectedSocket() socket: Socket, @MessageBody() { id }: RestartSimulationPayload) {
    const result = this.simulationService.restartSimulation(id);
    if (result.isErr()) throw new WsException(result.error);

    socket.join(id);

    return id;
  }
}
