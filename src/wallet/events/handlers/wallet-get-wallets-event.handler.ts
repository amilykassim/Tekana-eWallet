import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { KafkaHelper } from 'src/helpers/kafka-helper';
import { GetWalletsEvent } from '../implementation';

@EventsHandler(GetWalletsEvent)
export class GetWalletsEventHandler implements IEventHandler<GetWalletsEvent> {
  constructor(private readonly kafkaHelper: KafkaHelper) { }

  handle(event: GetWalletsEvent) {
    const { payload } = event;

    return this.kafkaHelper.send(payload, process.env.WALLET_GET_WALLETS_REQUEST_TOPIC);
  }
}
