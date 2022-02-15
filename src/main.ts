// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['http://127.0.0.1:3000'],
      credentials: true,
    },
  })

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

  await app.listen(process.env.PORT || 8000)
}
bootstrap()
