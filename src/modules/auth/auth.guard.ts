// import {
//   Injectable,
//   ExecutionContext,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {
//   constructor(private readonly jwtService: JwtService) {
//     super();
//   }

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const authHeader = request.headers.authorization;

//     if (!authHeader) {
//       throw new UnauthorizedException('Token missing');
//     }

//     const [type, token] = authHeader.split(' ');
//     if (type !== 'Bearer' || !token) {
//       throw new UnauthorizedException('Invalid token format');
//     }

//     try {
//       const payload = this.jwtService.verify(token);
//       request.user = payload;
//     } catch (err) {
//       throw new UnauthorizedException('Invalid or expired token');
//     }
//   }
// }
