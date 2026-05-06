import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const defaultOrigins = [
    'https://social-devs-3eunzoqdb-olegpoloviys-projects.vercel.app',
  ];
  const explicitOrigins = (process.env.FRONTEND_URL ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const allowedOrigins = new Set([...defaultOrigins, ...explicitOrigins]);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const isAllowedDevOrigin =
        /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3})(:\d+)?$/.test(
          origin,
        );
      const isAllowedVercelPreview =
        /^https:\/\/social-devs-[a-z0-9-]+-olegpoloviys-projects\.vercel\.app$/.test(
          origin,
        );

      callback(
        null,
        allowedOrigins.has(origin) ||
          isAllowedDevOrigin ||
          isAllowedVercelPreview,
      );
    },
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
