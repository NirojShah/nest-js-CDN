import { Module } from '@nestjs/common';

import { UserService } from './user.service.js';
import { UserRepository } from './user.repository.js';
import { UserController } from './user.controller.js';

import { PrismaModule } from '../prisma/prisma.module.js';

import AuthenticateUser from './user-auth/auth.service.js';

@Module({
  imports: [PrismaModule,],
  controllers: [UserController,],
  providers: [UserService, UserRepository, AuthenticateUser,],
  exports: [UserService, AuthenticateUser,],
})
export class UserModule { }
