import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { KafkaHelper } from 'src/helpers/kafka-helper';
import { WalletBalanceEvent } from '../implementation';

@EventsHandler(WalletBalanceEvent)
export class WalletBalanceEventHandler implements IEventHandler<WalletBalanceEvent> {
  constructor(private readonly kafkaHelper: KafkaHelper) { }

  handle(event: WalletBalanceEvent) {
    const { user } = event;
    return this.kafkaHelper.send(user, process.env.WALLET_BALANCE_REQUEST_TOPIC);
  }
}
