import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { WalletTransactionsEvent } from '../../events/implementation';
import { WalletTransactionsCommand } from '../implementation';

@CommandHandler(WalletTransactionsCommand)
export class WalletTransactionsCommandHandler implements ICommandHandler<WalletTransactionsCommand> {
  constructor(
    private readonly eventBus: EventBus,
  ) { }

  async execute(command: WalletTransactionsCommand) {
    const { payload } = command;

    this.eventBus.publish(new WalletTransactionsEvent(payload));
  }
}
