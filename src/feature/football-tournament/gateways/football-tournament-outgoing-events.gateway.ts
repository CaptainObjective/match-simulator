import { WebSocketGateway, WebSocketServer, Server } from 'src/shared/websockets';
import { Tournament } from '../models/tournament.model';

@WebSocketGateway('football-tournament')
export class FootballTournamentOutgoingEventsGateway {
  @WebSocketServer()
  private server: Server;

  updateScoreForConnectedClients(tournament: Tournament) {
    this.server.to(tournament.id).emit('score-update', tournament);
  }
}
