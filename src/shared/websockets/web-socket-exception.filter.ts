import { ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

export class WebSocketExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    super.catch(exception, host);

    const message = this.createMessage(exception);

    const acknowledgement = host.getArgByIndex(2);
    if (acknowledgement && typeof acknowledgement === 'function') {
      acknowledgement({ status: 'Error', message });
    }
  }

  private createMessage(exception: any) {
    const validationErrorMessage = exception?.getResponse()?.message?.[0];
    if (validationErrorMessage) return validationErrorMessage;

    const commonErrorMessage = exception?.getResponse();
    if (commonErrorMessage) return commonErrorMessage;

    return 'Unknown Exception';
  }
}
