import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { FootballSimulationModule } from 'src/feature/football-simulation';
import { validationPipe } from 'src/shared/validation';

@Module({
  imports: [FootballSimulationModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: validationPipe,
    },
  ],
})
export class AppModule {}
