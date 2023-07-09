import { randomUUID } from 'crypto';
import { Match } from './match';

export class Tournament {
  public readonly id = randomUUID();

  private matches: Match[];
  private minute = 0;
  private _isFinished = false;

  constructor(private readonly name: string) {
    this.createMatches();
  }

  public get isCurrentMinuteDivisibleByTen() {
    return this.minute % 10 === 0;
  }

  public get info() {
    const scores = this.matches.map((match) => match.score);
    return { id: this.id, name: this.name, isFinished: this.isFinished, scores };
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

  restart() {
    this._isFinished = false;
    this.minute = 0;
    this.createMatches();
  }

  private createMatches() {
    this.matches = [new Match('Germany', 'Poland'), new Match('Brazil', 'Mexico'), new Match('Argentina', 'Uruguay')];
  }
}
