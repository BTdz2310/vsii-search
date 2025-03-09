import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SEARCH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'search',
            brokers: [
              `${process.env.NODE_ENV === 'dev' ? 'localhost' : 'kafka'}:9092`,
              // 'localhost:9092',
            ],
            retry: {
              retries: 1,
              multiplier: 1,
            },
          },
          consumer: {
            groupId: 'search-consumer',
          },
          producer: {
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaModule {}
