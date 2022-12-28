import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { WalletBalanceEvent } from '../../events/implementation';
import { WalletBalanceCommand } from '../implementation';

@CommandHandler(WalletBalanceCommand)
export class WalletBalanceCommandHandler implements ICommandHandler<WalletBalanceCommand> {
  constructor(
    private readonly eventBus: EventBus,
  ) { }

  async execute(command: WalletBalanceCommand) {
    const { user } = command;
    this.eventBus.publish(new WalletBalanceEvent(user));
  }
}
