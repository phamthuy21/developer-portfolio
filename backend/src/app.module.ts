import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { pinoLoggerConfig } from './common/logger/pino-logger.config';
import { validate } from './config/env.validation';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import { PrismaModule } from './prisma/prisma.module';
import { SharedModule } from './shared/shared.module';

// Feature Modules
import { ProjectsModule } from './modules/projects/projects.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { UsersModule } from './modules/users/users.module';
import { SkillsModule } from './modules/skills/skills.module';
import { ExperiencesModule } from './modules/experiences/experiences.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { MessagesModule } from './modules/messages/messages.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      load: [appConfig, databaseConfig, authConfig],
      validate,
    }),
    LoggerModule.forRoot(pinoLoggerConfig),
    PrismaModule,
    SharedModule,
    ProjectsModule,
    BlogsModule,
    UsersModule,
    SkillsModule,
    ExperiencesModule,
    CertificatesModule,
    MessagesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
