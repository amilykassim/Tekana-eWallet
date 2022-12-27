import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { KafkaHelper } from 'src/helpers/kafka-helper';
import { WalletTopUpEvent } from '../implementation';

@EventsHandler(WalletTopUpEvent)
export class WalletTopUpEventHandler implements IEventHandler<WalletTopUpEvent> {
  constructor(private readonly kafkaHelper: KafkaHelper) { }

  handle(event: WalletTopUpEvent) {
    const { payload } = event;
    return this.kafkaHelper.send(payload, process.env.WALLET_TOPUP_REQUEST_TOPIC);
  }
}
