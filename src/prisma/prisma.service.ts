import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString || typeof connectionString !== 'string') {
      throw new Error(
        'DATABASE_URL is missing or invalid. Add it to your .env file before starting the app.',
      );
    }

    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to PostgreSQL!');
    } catch (error) {
      this.logger.error('Database connection failed:', error);
      process.exit(1);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}