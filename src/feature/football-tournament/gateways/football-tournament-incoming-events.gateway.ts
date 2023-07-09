import { ConnectedSocket, MessageBody, Socket, SubscribeMessage, WebSocketGateway } from 'src/shared/websockets';
import { StartTournamentPayload } from '../models/start-tournament-payload.model';
import { Tournament } from '../models/tournament.model';
import { SimulationService } from '../services/simulation.service';
import { StopSimulationPayload } from '../models/stop-simulation-payload.model';

@WebSocketGateway('football-tournament')
export class FootballTournamentIncomingEventsGateway {
  constructor(private readonly simulationService: SimulationService) {}

  @SubscribeMessage('start')
  handleStart(@ConnectedSocket() socket: Socket, @MessageBody() { name }: StartTournamentPayload) {
    const tournament = new Tournament(name);
    this.simulationService.addTournament(tournament);
    socket.join(tournament.id);

    return { tournamentId: tournament.id };
  }

  @SubscribeMessage('stop')
  handleStop(@MessageBody() { id }: StopSimulationPayload) {
    this.simulationService.stopSimulation(id);
  }
}
