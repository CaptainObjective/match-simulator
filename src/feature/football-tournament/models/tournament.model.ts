import { randomUUID } from 'crypto';
import { Match } from './match';

const defaultMatches = [
  new Match('Germany', 'Poland'),
  new Match('Brazil', 'Mexico'),
  new Match('Argentina', 'Uruguay'),
];

export class Tournament {
  public readonly id = randomUUID();
  private isStillInPlay = true;
  private minute = 0;

  constructor(private readonly name: string, private readonly matches = defaultMatches) {}

  public get isFinished() {
    return !this.isStillInPlay;
  }

  public get isCurrentMinuteDivisibleByTen() {
    return this.minute % 10 === 0;
  }

  scoreGoalForRandomTeamInRandomMatch() {
    const randomMatchIndex = Math.floor(Math.random() * this.matches.length);
    const randomMatch = this.matches[randomMatchIndex];

    randomMatch.scoreGoalForRandomTeam();
  }

  update() {
    this.minute++;
    if (this.isCurrentMinuteDivisibleByTen) {
      this.scoreGoalForRandomTeamInRandomMatch();
    }

    if (this.minute >= 90) this.isStillInPlay = false;
  }
}
