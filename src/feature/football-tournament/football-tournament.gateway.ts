import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from 'src/shared/websockets';
import { StartTournamentPayload } from './models/start-tournament-payload.model';

@WebSocketGateway('football-tournament')
export class FootballTournamentGateway {
  @SubscribeMessage('start')
  handleStart(@MessageBody() payload: StartTournamentPayload) {
    return 'Hello world!';
  }
}
