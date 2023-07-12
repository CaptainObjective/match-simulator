import { applyDecorators, UsePipes, UseFilters } from '@nestjs/common';
import { WebSocketGateway as NestWebSocketGateway } from '@nestjs/websockets';

import { validationPipe } from '../validation';
import { WebSocketExceptionFilter } from './web-socket-exception.filter';

export const WebSocketGateway = (namespace: string) =>
  applyDecorators(UsePipes(validationPipe), UseFilters(WebSocketExceptionFilter), NestWebSocketGateway({ namespace }));
