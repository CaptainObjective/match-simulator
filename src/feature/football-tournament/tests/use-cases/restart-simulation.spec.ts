import { Tournament } from '../../models/tournament.model';
import { advanceTimer, countTotalGoals, waitForEvent } from '../utils';
import { client } from '../setup';

type SuccessResponse = { simulation: Tournament['info'] };

describe('restart simulation event', () => {
  describe('when id of stopped simulation is passed, should mark simulation as running and reset goal count', () => {
    it('should mark simulation as not finished', async () => {
      const {
        simulation: { id },
      }: SuccessResponse = await client.emitWithAck('start', { name: 'Katar 2023' });
      await client.emitWithAck('stop', { id });

      await client.emitWithAck('restart', { id });

      advanceTimer(10);
      const simulation = await waitForEvent<Tournament['info']>('score-update');
      const totalGoals = countTotalGoals(simulation.scores);
      expect(simulation.name).toBe('Katar 2023');
      expect(simulation.isFinished).toBe(false);
      expect(totalGoals).toBe(1);
    });
  });

  describe('when id is invalid', () => {
    it('when id is not valid uuid, should return error', async () => {
      const { message } = await client.emitWithAck('stop', {
        id: 'invalid UUID id',
      });

      expect(message).toBe('id must be a UUID');
    });

    it('when there is no simulation with given id, should return error', async () => {
      const nonexistentUuid = 'b94715e8-bd34-41a1-a8e3-d802e431e973';

      const { message } = await client.emitWithAck('stop', {
        id: nonexistentUuid,
      });

      expect(message).toBe('Simulation with given id does not exist');
    });

    xit('when simulation with given id is already running, should return error', async () => {
      const {
        simulation: { id },
      }: SuccessResponse = await client.emitWithAck('start', { name: 'Katar 2023' });

      const { message } = await client.emitWithAck('restart', { id });

      expect(message).toBe('Simulation with given id does not exist');
    });
  });
});
