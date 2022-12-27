import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { GetWalletsEvent } from '../../events/implementation';
import { GetWalletsCommand } from '../implementation';

@CommandHandler(GetWalletsCommand)
export class GetWalletsCommandHandler implements ICommandHandler<GetWalletsCommand> {
  constructor(
    private readonly eventBus: EventBus,
  ) { }

  async execute(command: GetWalletsCommand) {
    const { payload } = command;

    this.eventBus.publish(new GetWalletsEvent(payload));
  }
}
