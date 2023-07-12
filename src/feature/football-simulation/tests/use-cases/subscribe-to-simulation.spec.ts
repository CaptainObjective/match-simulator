import { advanceTimer, countTotalGoals, waitForEvent } from '../utils';
import { appPort, client } from '../setup';
import { Simulation } from '../../domain/simulation';
import { io } from 'socket.io-client';

describe('subscribe simulation event', () => {
  describe('when id is valid', () => {
    it('should inform subscribed client about score updates', async () => {
      const {
        simulation: { id },
      }: { simulation: Simulation['info'] } = await client.emitWithAck('start', { name: 'Katar 2023' });
      const differentSocketClient = io(`ws://localhost:${appPort}/football-simulation`);
      await differentSocketClient.emitWithAck('subscribe', { id });
      advanceTimer(10);

      const simulation = await waitForEvent<Simulation['info']>('score-update', differentSocketClient);

      const totalGoals = countTotalGoals(simulation.scores);
      expect(simulation.name).toBe('Katar 2023');
      expect(simulation.isFinished).toBe(false);
      expect(totalGoals).toBe(1);

      differentSocketClient.close();
    });
  });

  describe('when id is invalid', () => {
    it('when id is not valid uuid, should return error', async () => {
      const { message } = await client.emitWithAck('subscribe', {
        id: 'invalid UUID id',
      });

      expect(message).toBe('id must be a UUID');
    });

    it('when there is no simulation with given id, should return error', async () => {
      const nonexistentUuid = 'b94715e8-bd34-41a1-a8e3-d802e431e973';
      const { message } = await client.emitWithAck('subscribe', {
        id: nonexistentUuid,
      });

      expect(message).toBe('Simulation with given id does not exist');
    });
  });
});
