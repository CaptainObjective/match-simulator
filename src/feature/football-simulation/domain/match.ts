export class Match {
  private homeTeamScore = 0;
  private awayTeamScore = 0;

  constructor(private readonly homeTeamName: string, private readonly awayTeamName: string) {}

  get score() {
    return {
      home: {
        name: this.homeTeamName,
        score: this.homeTeamScore,
      },
      away: {
        name: this.awayTeamName,
        score: this.awayTeamScore,
      },
    };
  }

  scoreGoalForRandomTeam() {
    const chanceToScoreByHomeTeam = 0.5;

    Math.random() < chanceToScoreByHomeTeam ? this.homeTeamScore++ : this.awayTeamScore++;
  }
}
