import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  userId: number;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // tell passport to look for Bearer Token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // secret key to verify the signature
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }
  async validate(payload: JwtPayload) {
    if (!payload) {
      throw new UnauthorizedException();
    }
    // will be attached to req.user
    return { userId: payload.userId, email: payload.email };
  }
}
