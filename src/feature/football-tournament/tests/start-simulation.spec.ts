import { INestApplication } from '@nestjs/common';
import { Socket } from 'socket.io-client';
import { Tournament } from '../models/tournament.model';
import { countTotalGoals, createApp, createSocketClient } from './utils';

type SuccessResponse = { simulation: Tournament['info'] };
type ErrorResponse = { message: string };

describe('start simulation event', () => {
  let app: INestApplication;
  let client: Socket;

  beforeAll(async () => {
    app = await createApp();
    client = createSocketClient();
  });

  afterAll(() => {
    client.close();
    app.close();
  });

  describe('when name is valid', () => {
    it('should return simulation', async () => {
      const { simulation }: SuccessResponse = await client.emitWithAck('start', { name: 'Katar 2023' });
      const totalGoals = countTotalGoals(simulation.scores);

      expect(simulation.name).toBe('Katar 2023');
      expect(simulation.isFinished).toBe(false);
      expect(totalGoals).toBe(0);
    });
  });

  describe('when name is invalid', () => {
    const expectedErrorMessage =
      'Invalid tournament name. It should have a minimum of 8 characters, a maximum of 30 characters, and only contain digits, whitespaces, or alphabetic characters.';

    it('when name is too short, should return error', async () => {
      const { message }: ErrorResponse = await client.emitWithAck('start', { name: 'Short' });

      expect(message).toBe(expectedErrorMessage);
    });

    it('when name is too long, should return error', async () => {
      const { message }: ErrorResponse = await client.emitWithAck('start', {
        name: 'Way Too Long Name For A Simulation',
      });

      expect(message).toBe(expectedErrorMessage);
    });

    it('when name has invalid characters, should return error', async () => {
      const { message }: ErrorResponse = await client.emitWithAck('start', {
        name: 'Name with invalid character!',
      });

      expect(message).toBe(expectedErrorMessage);
    });
  });
});
