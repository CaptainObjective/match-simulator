import { Test } from '@nestjs/testing';
import { Tournament } from '../models/tournament.model';
import { AppModule } from 'src/app';
import { io } from 'socket.io-client';

type Scores = Tournament['info']['scores'];

export const countTotalGoals = (scores: Scores) =>
  scores.reduce((total, match) => match.home.score + match.away.score + total, 0);

export const createApp = async () => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleFixture.createNestApplication({ logger: false });
  await app.init();
  return app;
};

export const createSocketClient = () => {
  return io('ws://localhost/football-tournament');
};
