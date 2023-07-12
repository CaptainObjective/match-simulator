import {
  ConnectedSocket,
  MessageBody,
  Socket,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from 'src/shared/websockets';
import { StartSimulationPayload } from '../models/start-simulation-payload.model';
import { SimulationRunnerService } from '../services/simulation-runner.service';
import { StopSimulationPayload } from '../models/stop-simulation-payload.model';
import { SubscribeSimulationPayload } from '../models/subscribe-simulation-payload.model';
import { RestartSimulationPayload } from '../models/restart-simulation-payload.model';
import { RateLimit } from '../interceptors/rate-limit.interceptor';

@WebSocketGateway('football-simulation')
export class FootballSimulationIncomingEventsGateway {
  constructor(private readonly simulationService: SimulationRunnerService) {}

  @RateLimit()
  @SubscribeMessage('start')
  handleStart(@ConnectedSocket() socket: Socket, @MessageBody() { name }: StartSimulationPayload) {
    const simulation = this.simulationService.addSimulation(name);
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
