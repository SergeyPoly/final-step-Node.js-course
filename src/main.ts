// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import {
  rabbitmqHost,
  rabbitmqPassword,
  rabbitmqQueueBillingIn,
  rabbitmqUser,
} from './configs/rabbitmq.config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['http://127.0.0.1:3000'],
      credentials: true,
    },
  })

  if (
    rabbitmqUser &&
    rabbitmqPassword &&
    rabbitmqHost &&
    rabbitmqQueueBillingIn
  ) {
    app.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${rabbitmqUser}:${rabbitmqPassword}@${rabbitmqHost}`],
        queue: rabbitmqQueueBillingIn,
        queueOptions: {
          durable: true,
        },
      },
    })
  }

  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  const config = new DocumentBuilder()
    .setTitle('Step project service')
    .setDescription('Step project service')
    .setVersion('1.0')
    .build()
  const options: SwaggerDocumentOptions = {
    deepScanRoutes: true,
  }
  const document = SwaggerModule.createDocument(app, config, options)
  SwaggerModule.setup('api', app, document)

  if (
    rabbitmqUser &&
    rabbitmqPassword &&
    rabbitmqHost &&
    rabbitmqQueueBillingIn
  ) {
    await app.startAllMicroservices()
  }
  await app.listen(process.env.PORT || 8000)
}
bootstrap()
