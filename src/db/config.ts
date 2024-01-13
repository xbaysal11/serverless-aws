import { Sequelize } from 'sequelize';

const user = process.env.PG_USER;
const host = process.env.PG_HOST;
const database = process.env.PG_DATABASE;
const password = process.env.PG_PASSWORD;
const port = Number(process.env.PG_PORT);

const sequelize = new Sequelize(database, user, password, {
  host,
  port,
  logging: false,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export default sequelize;
