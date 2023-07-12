import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Socket, io } from 'socket.io-client';

import { AppModule } from 'src/app';

beforeEach(async () => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  app = moduleFixture.createNestApplication({ logger: false });
  await app.init();

  const { port } = app.getHttpServer().listen().address();
  client = io(`ws://localhost:${port}/football-simulation`);
});

afterEach(() => {
  client.close();
  app.close();
});

export let app: INestApplication;
export let client: Socket;
