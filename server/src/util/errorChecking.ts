import { readDotenv } from './helpers';

export class ErrorHandling extends Error {
  statusCode: number;
  status: 'fail' | 'error';
  message: string = '';
  data: { [key: string]: any } | undefined = undefined;

  /**
   * @param statusCode HTTP status code in the format 4xx or 5xx
   * @param data Must be provided if status code is 4xx
   * @param message Must be provided if status code is 5xx
   */
  constructor(
    statusCode: number,
    data?: { [key: string]: any },
    message?: string
  ) {
    super();
    this.statusCode = statusCode;
    this.status = statusCode.toString()[0] === '4' ? 'fail' : 'error';

    if (this.status === 'fail') {
      this.data = data || {};
    } else if (this.status === 'error') {
      this.message = message || '';
    }

    // If in production and server side error occured, don't send error details in the message.
    if (readDotenv('ENVIRONMENT') == 'PRODUCTION' && this.status === 'error') {
      this.message =
        'An unexpected error occured on the server. Try again later.';
    }
  }

  outputMessage() {
    if (this.status === 'fail') {
      return {
        status: this.status,
        statusCode: this.statusCode,
        data: this.data,
      };
    } else if (this.status === 'error')
      return {
        status: this.status,
        statusCode: this.statusCode,
        message: this.message,
      };
  }
}
