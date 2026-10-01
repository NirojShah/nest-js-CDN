import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service.js';
import DashboardRepository from './dashboard.repository.js';
import { DashboardService } from './dashboard.service.js';

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DashboardService, DashboardRepository, {
        provide: PrismaService,
        useValue: {
          file: {
            aggregate: async () => ({ _sum: { fileSize: 0 } }),
            count: async () => 0,
            findFirst: async () => null,
          },
        },
      }],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should resolve DashboardRepository dependency injection', async () => {
    const module = await Test.createTestingModule({
      providers: [DashboardRepository, {
        provide: PrismaService,
        useValue: {
          file: {
            aggregate: async () => ({ _sum: { fileSize: 0 } }),
            count: async () => 0,
            findFirst: async () => null,
          },
        },
      }],
    }).compile();

    expect(module.get(DashboardRepository)).toBeDefined();
  });
});
