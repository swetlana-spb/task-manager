import { AuthService } from './auth.service';
import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthCredsDTO } from './dto/auth-creds.dto';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(private authServise: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredsDTO: AuthCredsDTO): Promise<void> {
    this.logger.log(`A new sign up with a username: ${authCredsDTO.username}`);
    return this.authServise.signUp(authCredsDTO);
  }

  @Post('/signin')
  signIn(@Body() authCredsDTO: AuthCredsDTO): Promise<{ accessToken: string }> {
    this.logger.log(`A new sign in with a username: ${authCredsDTO.username}`);
    return this.authServise.signIn(authCredsDTO);
  }
}
