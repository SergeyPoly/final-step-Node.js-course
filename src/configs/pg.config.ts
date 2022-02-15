import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export const pgConnectionConfig: TypeOrmModuleOptions = {
  name: 'default',
  type: 'postgres',
  host: process.env.PG_HOST,
  port: Number.parseInt(process.env.PG_PORT, 10),
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  migrationsRun: false,
  autoLoadEntities: true,
  synchronize: false,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/**/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
}

export default pgConnectionConfig
