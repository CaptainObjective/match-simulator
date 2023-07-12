import { app, client } from './setup';
import { SimulationRunnerService } from '../services/simulation-runner.service';
import { Simulation } from '../domain/simulation';

type Scores = Simulation['info']['scores'];
export const countTotalGoals = (scores: Scores) =>
  scores.reduce((total, match) => match.home.score + match.away.score + total, 0);

export const advanceTimer = (secondsToSkip: number) => {
  const service = app.get(SimulationRunnerService);
  for (let i = 0; i < secondsToSkip; i++) {
    service.updateSimulations();
  }
};

export const waitForEvent = <T = unknown>(event: string) =>
  new Promise<T>((resolve) => {
    client.on(event, resolve);
  });

export const waitForEventMeetingCondition = <T = unknown>(event: string, condition: (payload: T) => boolean) =>
  new Promise<T>((resolve) => {
    client.on(event, (payload) => {
      const isConditionMet = condition(payload);
      if (isConditionMet) resolve(payload);
    });
  });
