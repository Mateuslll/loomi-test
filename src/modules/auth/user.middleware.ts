// import {
//   Injectable,
//   NestMiddleware,
//   NotAcceptableException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { NextFunction, Request, Response } from 'express';

// @Injectable()
// export class  UserAccessLevelMiddleware implements NestMiddleware {
//   constructor(private jwtService: JwtService) {}

//   async use(req: Request, res: Response, next: NextFunction) {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       return next(new UnauthorizedException('Authorization header missing.'));
//     }

//     const [type, token] = authHeader.split(' ');

//     if (type !== 'Bearer' || !token) {
//       return next(new UnauthorizedException('Invalid token format.'));
//     }

//     try {
//       const payload = this.jwtService.verify(token) as { type: string };
//       if (payload.type !== 'Administrador') {
//         throw new NotAcceptableException('User is not an administrator.');
//       }
//       next();
//     } catch (error) {
//       return next(new UnauthorizedException(error.message));
//     }
//   }
// }
