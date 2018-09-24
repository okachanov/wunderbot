import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { DispatchError } from './errors/errors.dispatcher';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Wunderbot')
    .setDescription('The telegram to wunderlist bot API description')
    .setVersion('1.0')
    .setBasePath('api/v1')
    .addBearerAuth()
    .build();

  app.setGlobalPrefix('api/v1');
  app.enableCors({origin: '*'});
  app.useGlobalFilters(new DispatchError());

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
// noinspection JSIgnoredPromiseFromCall
bootstrap();
