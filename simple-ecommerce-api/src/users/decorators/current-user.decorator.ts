import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CURRENT_USER_KEY } from 'src/common/utils/constants';
import { JwtPayload } from 'src/common/utils/types';

export const CurrentUser = createParamDecorator(
  (_data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const payload: JwtPayload = request[CURRENT_USER_KEY];
    return payload;
  },
);
