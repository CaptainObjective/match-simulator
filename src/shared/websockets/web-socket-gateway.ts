import { applyDecorators, UsePipes } from '@nestjs/common';
import { WebSocketGateway as NestWebSocketGateway } from '@nestjs/websockets';

import { validationPipe } from '../validation';

const webSocketPortNumber = 80;

export const WebSocketGateway = (namespace: string) =>
  applyDecorators(UsePipes(validationPipe), NestWebSocketGateway(webSocketPortNumber, { namespace }));
