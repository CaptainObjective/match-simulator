import { WebSocketGateway, WebSocketServer, Server } from 'src/shared/websockets';
import { Simulation } from '../domain/simulation';

@WebSocketGateway('football-simulation')
export class FootballSimulationOutgoingEventsGateway {
  @WebSocketServer()
  private server: Server;

  updateScoreForConnectedClients(simulation: Simulation) {
    this.server.to(simulation.id).emit('score-update', simulation.info);
  }
}
