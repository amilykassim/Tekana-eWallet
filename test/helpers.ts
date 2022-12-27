import { Connection, getConnection } from 'typeorm';

export const reinitialize = async (): Promise<void> => {
  const connection = await getConnection();
  return connection.synchronize(true);
};

export const clearAll = async (): Promise<void> => {
  const entities = getConnection().entityMetadatas;
  for (const entity of entities) {
    const repository = await getConnection().getRepository(entity.name);
    await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
  }
};