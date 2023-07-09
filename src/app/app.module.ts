import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { FootballTournamentModule } from 'src/feature/football-tournament';
import { validationPipe } from 'src/shared/validation';

@Module({
  imports: [FootballTournamentModule],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: validationPipe,
    },
  ],
})
export class AppModule {}
