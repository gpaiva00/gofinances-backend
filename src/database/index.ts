import { createConnection, getConnectionOptions, Connection } from 'typeorm';

export default async (name = 'default'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  const connectionOptions =
    process.env.NODE_ENV === 'production'
      ? { url: process.env.DATABASE_URL }
      : {
          name,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          host: process.env.DB_HOST,
          database: process.env.DB_DATABASE,
        };

  return createConnection(Object.assign(defaultOptions, connectionOptions));
};
