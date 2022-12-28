import { Injectable } from '@nestjs/common';
const { Kafka } = require('kafkajs');
require('dotenv').config();

@Injectable()
export class KafkaHelper {
  private producer;

  constructor() {
    const kafka = new Kafka({
      brokers: [process.env.KAFKA_BROKER_URL],
      retry: { retries: 50 }
    });

    // assign the configs to the producer
    this.producer = kafka.producer();
    this.producer.connect().then(() => {
      console.log('connected to kafka successfully');
    });
  }
  async send(data: any, topic: string) {
    const messageToBeSent = JSON.stringify(data);

    try {
      // Send the event data to kafka
      await this.producer.send({
        topic: topic,
        messages: [{ value: messageToBeSent, headers: { appName: 'API' } }],
      });

      return { isMessageSent: true };
    } catch (error) {
      console.log('failed to send message');
    }
  }
}
