import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredsDTO } from './dto/auth-creds.dto';

@Controller('auth')
export class AuthController {
  constructor(private authServise: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredsDTO: AuthCredsDTO): Promise<void> {
    return this.authServise.signUp(authCredsDTO);
  }

  @Post('/signin')
  signIn(@Body() authCredsDTO: AuthCredsDTO): Promise<{ accessToken: string }> {
    return this.authServise.signIn(authCredsDTO);
  }
}
