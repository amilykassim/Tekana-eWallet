import * as dotenv from 'dotenv';
import { createConnection } from 'typeorm';

void (async () => {
  dotenv.config({ path: `${__dirname}/../.env.test` });
  const connection = await createConnection({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'amilykadyl',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'RSSB',
    entities: ['src/**/entities/*.entity{.ts,.js}'],
  });

  await connection.synchronize(true);
  console.info('Schema re-created');
})();
