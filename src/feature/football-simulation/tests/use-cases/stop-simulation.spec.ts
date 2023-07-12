import { ErrorResponse, SimulationInfo, advanceTimer, countTotalGoals, waitForEvent } from '../utils';
import { client } from '../setup';

describe('stop simulation event', () => {
  describe('when id is valid', () => {
    it('should mark simulation as finished and stop scoring goals', async () => {
      await client.emitWithAck('start', { name: 'Katar 2023' });
      advanceTimer(10);
      const simulationBeforeStop = await waitForEvent<SimulationInfo>('score-update');
      await client.emitWithAck('stop', { id: simulationBeforeStop.id });
      advanceTimer(20);

      // Have to try resubscribe because score update event is not emitted for simulations that are stopped
      const simulationAfterStop: SimulationInfo = await client.emitWithAck('subscribe', {
        id: simulationBeforeStop.id,
      });

      const totalGoals = countTotalGoals(simulationAfterStop.scores);
      expect(simulationAfterStop.name).toBe('Katar 2023');
      expect(simulationAfterStop.isFinished).toBe(true);
      expect(totalGoals).toBe(1);
    });
  });

  describe('when id is invalid', () => {
    it('when id is not valid uuid, should return error', async () => {
      const { message }: ErrorResponse = await client.emitWithAck('stop', {
        id: 'invalid UUID id',
      });

      expect(message).toBe('id must be a UUID');
    });

    it('when there is no simulation with given id, should return error', async () => {
      const nonexistentUuid = 'b94715e8-bd34-41a1-a8e3-d802e431e973';

      const { message }: ErrorResponse = await client.emitWithAck('stop', {
        id: nonexistentUuid,
      });

      expect(message).toBe('Simulation with given id does not exist');
    });
  });
});
