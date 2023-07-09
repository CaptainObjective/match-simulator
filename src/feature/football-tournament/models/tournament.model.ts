import { randomUUID } from 'crypto';
import { Match } from './match';

const defaultMatches = [
  new Match('Germany', 'Poland'),
  new Match('Brazil', 'Mexico'),
  new Match('Argentina', 'Uruguay'),
];

export class Tournament {
  public readonly id = randomUUID();
  private _isFinished = false;
  private minute = 0;

  constructor(private readonly name: string, private readonly matches = defaultMatches) {}

  public get isCurrentMinuteDivisibleByTen() {
    return this.minute % 10 === 0;
  }

  public get info() {
    const scores = this.matches.map((match) => match.score);
    return { id: this.id, name: this.name, scores };
  }

  public get isFinished() {
    return this._isFinished;
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

    if (this.minute >= 90) this._isFinished = true;
  }

  finish() {
    this._isFinished = true;
  }
}
