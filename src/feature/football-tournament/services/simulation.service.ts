import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Tournament } from '../models/tournament.model';
import { FootballTournamentOutgoingEventsGateway } from '../gateways/football-tournament-outgoing-events.gateway';

const oneSecond = 1000;
const tournamentIsFinished = (tournament: Tournament) => tournament.isFinished;
const tournamentIsNotFinished = (tournament: Tournament) => !tournament.isFinished;

@Injectable()
export class SimulationService {
  private tournamentsInPlay: Tournament[] = [];
  private finishedTournaments: Tournament[] = [];

  constructor(private readonly outgoingEventsGateway: FootballTournamentOutgoingEventsGateway) {}

  @Interval(oneSecond)
  updateTournaments() {
    this.tournamentsInPlay.forEach((tournament) => {
      tournament.update();
      if (tournament.isCurrentMinuteDivisibleByTen) {
        this.outgoingEventsGateway.updateScoreForConnectedClients(tournament);
      }
    });

    const justEndedTournaments = this.tournamentsInPlay.filter(tournamentIsFinished);
    this.finishedTournaments.push(...justEndedTournaments);

    const tournamentsStillInPlay = this.tournamentsInPlay.filter(tournamentIsNotFinished);
    this.tournamentsInPlay = tournamentsStillInPlay;
  }

  addTournament(tournament: Tournament) {
    this.tournamentsInPlay.push(tournament);
  }
}
