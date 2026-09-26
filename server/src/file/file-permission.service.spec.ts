import { Test, TestingModule } from '@nestjs/testing';
import { FilePermissionService } from './file-permission.service.js';
import { FilePermissionRepository } from './file-permission.repository.js';

describe('FilePermissionService', () => {
  let service: FilePermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilePermissionService,
        {
          provide: FilePermissionRepository,
          useValue: {
            getByFileId: vi.fn(),
            create: vi.fn(),
            updateByFileId: vi.fn(),
            deleteByFileId: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FilePermissionService>(FilePermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
