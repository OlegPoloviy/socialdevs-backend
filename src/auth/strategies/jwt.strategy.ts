import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { AuthJwtPayload } from '../auth.jwt';

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService, authService: AuthService) {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: configService.get<string>("JWT_SECRET"),
        ignoreExpiration: false,
      });
    }

    validate(payload: AuthJwtPayload ){
      const {userId} = payload.sub;

      const user = this.authService.validateUserJwt(userId);
    }
}