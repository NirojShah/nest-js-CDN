import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from './file.controller.js';
import { FilePermissionService } from './file-permission.service.js';
import FileServiceImpl from './file.service.js';

describe('FileController', () => {
  let controller: FileController;
  const permissionService = {
    create: vi.fn(),
  };
  const fileService = {
    getFile: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [
        {
          provide: FileServiceImpl,
          useValue: fileService,
        },
        {
          provide: FilePermissionService,
          useValue: permissionService,
        },
      ],
    }).compile();

    controller = module.get<FileController>(FileController);
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('creates a permission for a file owned by the authenticated user', async () => {
    const response = {
      message: 'File permission created successfully',
      statusCode: 201,
      data: { id: 'permission-id', fileId: 'file-id', accessedBy: 'UPLOADER' },
    };
    const userData = { id: 'user-id', email: 'user@example.com', name: 'Test User' };
    fileService.getFile.mockResolvedValue({ data: { uploadedBy: 'user-id' } });
    permissionService.create.mockResolvedValue(response);

    await expect(controller.createFilePermission(
      'file-id',
      { accessedBy: 'UPLOADER' },
      userData,
    ))
      .resolves.toEqual(response);
    expect(permissionService.create).toHaveBeenCalledWith('file-id', 'UPLOADER');
  });

  it('rejects permission creation for a file owned by another user', async () => {
    const userData = { id: 'user-id', email: 'user@example.com', name: 'Test User' };
    fileService.getFile.mockResolvedValue({ data: { uploadedBy: 'another-user' } });

    await expect(controller.createFilePermission(
      'file-id',
      { accessedBy: 'UPLOADER' },
      userData,
    )).rejects.toThrow('You can only create permissions for your own files');
    expect(permissionService.create).not.toHaveBeenCalled();
  });
});
