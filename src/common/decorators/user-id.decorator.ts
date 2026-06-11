import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const CurrentUserId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const token = request.headers.authorization?.split(' ')[1];
  
  if (!token) throw new UnauthorizedException('Token missing');

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload.sub || payload.id;
  } catch (error) {
    throw new UnauthorizedException('Invalid token');
  }
});