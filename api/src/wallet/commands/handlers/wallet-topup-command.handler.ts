import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { WalletTopUpEvent } from '../../events/implementation';
import { WalletTopUpCommand } from '../implementation';

@CommandHandler(WalletTopUpCommand)
export class WalletTopUpCommandHandler implements ICommandHandler<WalletTopUpCommand> {
  constructor(
    private readonly eventBus: EventBus,
  ) { }

  async execute(command: WalletTopUpCommand) {
    const { payload } = command;
    this.eventBus.publish(new WalletTopUpEvent(payload));
  }
}
