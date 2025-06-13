import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from 'src/common/utils/constants';
import { UserType } from '../enums/user-type.enum';

export const Roles = (...roles: UserType[]) => SetMetadata(ROLES_KEY, roles);
