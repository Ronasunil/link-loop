import { BaseQueue } from './baseQueue';

export class PasswordChanged extends BaseQueue {
  constructor(queueName: string) {
    super(queueName);
  }
}
