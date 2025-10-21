import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './handlers/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: ['http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  // Manejador global de excepciones
  app.useGlobalFilters(new AllExceptionsFilter());

  // Habilita el ValidationPipe globalmente (dto)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remueve automáticamente propiedades que no estén definidas en el DTO
      forbidNonWhitelisted: true, // Lanza un error si hay propiedades no definidas
      transform: true, // Transforma los tipos de datos de entrada a los tipos definidos en el DTO
    }),
  );

  // Configurar swagger
  const options = new DocumentBuilder()
    .setTitle('Peluditos REST API')
    .setDescription('API REST de Peluditos')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  // La ruta en que se sirve la documentación
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
