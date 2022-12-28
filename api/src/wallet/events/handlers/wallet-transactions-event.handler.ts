import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { KafkaHelper } from 'src/helpers/kafka-helper';
import { WalletTransactionsEvent } from '../implementation';

@EventsHandler(WalletTransactionsEvent)
export class WalletTransactionsEventHandler implements IEventHandler<WalletTransactionsEvent> {
  constructor(private readonly kafkaHelper: KafkaHelper) { }

  handle(event: WalletTransactionsEvent) {
    const { payload } = event;

    return this.kafkaHelper.send(payload, process.env.WALLET_TRANSACTIONS_REQUEST_TOPIC);
  }
}
