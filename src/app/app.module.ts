import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { FootballTournamentModule } from 'src/feature/football-tournament';
import { validationPipe } from 'src/shared/validation';

@Module({
  imports: [FootballTournamentModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: validationPipe,
    },
  ],
})
export class AppModule {}
