import { NotificationInterface } from '@/util/definitions';

type NotificationOptions = Omit<NotificationInterface, 'id'>;

export class Notifier {
  private options: NotificationOptions;
  private show: (opts: NotificationOptions) => void;

  constructor(
    options: NotificationOptions,
    showFn: (opts: NotificationOptions) => void
  ) {
    this.options = options;
    this.show = showFn;
  }

  fire() {
    this.show(this.options);
  }
}
