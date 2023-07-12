import { client } from '../setup';
import {
  ErrorResponse,
  SimulationInfo,
  advanceTimer,
  countTotalGoals,
  waitForEvent,
  waitForEventMeetingCondition,
} from '../utils';

describe('start simulation event', () => {
  describe('when name is valid', () => {
    it('should return simulation', async () => {
      const simulation: SimulationInfo = await client.emitWithAck('start', { name: 'Katar 2023' });

      const totalGoals = countTotalGoals(simulation.scores);
      expect(simulation.name).toBe('Katar 2023');
      expect(simulation.isFinished).toBe(false);
      expect(totalGoals).toBe(0);
    });

    it('should score exactly 1 goal after 10 seconds', async () => {
      await client.emitWithAck('start', { name: 'Katar 2023' });
      advanceTimer(10);

      const simulation = await waitForEvent<SimulationInfo>('score-update');

      const totalGoals = countTotalGoals(simulation.scores);
      expect(simulation.name).toBe('Katar 2023');
      expect(simulation.isFinished).toBe(false);
      expect(totalGoals).toBe(1);
    });

    it('should score 9 goals and end after 90 seconds', async () => {
      await client.emitWithAck('start', { name: 'Katar 2023' });
      advanceTimer(90);
      const isEventFinished = (simulation: SimulationInfo) => simulation.isFinished;

      const simulation = await waitForEventMeetingCondition<SimulationInfo>('score-update', isEventFinished);

      const totalGoals = countTotalGoals(simulation.scores);
      expect(simulation.name).toBe('Katar 2023');
      expect(totalGoals).toBe(9);
    });

    it('when trying to start simulation within 5 five minutes of starting another, should return error', async () => {
      await client.emitWithAck('start', { name: 'Katar 2023' });

      const { message }: ErrorResponse = await client.emitWithAck('start', { name: 'Katar 2024' });

      expect(message).toBe('Rate limit reached. Please try again later');
    });
  });

  describe('when name is invalid', () => {
    const validationErrorMessage =
      'Invalid simulation name. It should have a minimum of 8 characters, a maximum of 30 characters, and only contain digits, whitespaces, or alphabetic characters.';

    it('when name is too short, should return error', async () => {
      const { message }: ErrorResponse = await client.emitWithAck('start', { name: 'Short' });

      expect(message).toBe(validationErrorMessage);
    });

    it('when name is too long, should return error', async () => {
      const { message }: ErrorResponse = await client.emitWithAck('start', {
        name: 'Way Too Long Name For A Simulation',
      });

      expect(message).toBe(validationErrorMessage);
    });

    it('when name has invalid characters, should return error', async () => {
      const { message }: ErrorResponse = await client.emitWithAck('start', {
        name: 'Name with invalid character!',
      });

      expect(message).toBe(validationErrorMessage);
    });
  });
});
