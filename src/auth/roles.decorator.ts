import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../entities/users/user/user.entity';

// This key will be used by the guard to read allowed roles
export const ROLES_KEY = 'roles';

// Decorator to attach allowed roles to route handlers
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
