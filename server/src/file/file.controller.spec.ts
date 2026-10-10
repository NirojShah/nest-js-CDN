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
    updateFilePermission: vi.fn(),
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

  it('generates a public link for a file owned by the authenticated user', async () => {
    const file = { id: 'file-id', uploadedBy: 'user-id' };
    fileService.getFile.mockResolvedValue({ data: file });
    fileService.updateFilePermission.mockResolvedValue({ statusCode: 200 });

    await expect(controller.createPublicLink(
      'file-id',
      { protocol: 'https', get: () => 'cdn.example.com' } as never,
      { id: 'user-id', email: 'user@example.com', name: 'Test User' },
    )).resolves.toEqual({
      statusCode: 200,
      message: 'Public link generated successfully',
      data: { publicUrl: 'https://cdn.example.com/file/public/file-id' },
    });
    expect(fileService.updateFilePermission).toHaveBeenCalledWith('file-id', 'ALL');
  });

  it('does not generate a public link for another user’s file', async () => {
    fileService.getFile.mockResolvedValue({ data: { id: 'file-id', uploadedBy: 'another-user' } });

    await expect(controller.createPublicLink(
      'file-id',
      { protocol: 'https', get: () => 'cdn.example.com' } as never,
      { id: 'user-id', email: 'user@example.com', name: 'Test User' },
    )).rejects.toThrow('You can only create public links for your own files');
    expect(fileService.updateFilePermission).not.toHaveBeenCalled();
  });

  it('serves publicly shared file content', async () => {
    const fileBuffer = Buffer.from('file content');
    fileService.getFile.mockResolvedValue({
      data: {
        buffer: fileBuffer,
        fileName: 'hello.txt',
        fileType: 'text/plain',
        permission: [{ accessedBy: 'ALL' }],
      },
    });
    const response = {
      setHeader: vi.fn(),
      end: vi.fn(),
    };

    await controller.getPublicFile('file-id', response as never);

    expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    expect(response.setHeader).toHaveBeenCalledWith('Content-Length', fileBuffer.length);
    expect(response.end).toHaveBeenCalledWith(fileBuffer);
  });

  it('does not serve files that are not public', async () => {
    fileService.getFile.mockResolvedValue({
      data: { permission: [{ accessedBy: 'UPLOADER' }] },
    });

    await expect(controller.getPublicFile('file-id', {} as never))
      .rejects.toThrow('Public file not found');
  });
});
