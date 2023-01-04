import { JwtPayload } from './jwt-payload.interface';
import { AuthCredsDTO } from './dto/auth-creds.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredsDTO: AuthCredsDTO): Promise<void> {
    return this.usersRepository.createUser(authCredsDTO);
  }

  async signIn(authCredsDTO: AuthCredsDTO): Promise<{ accessToken: string }> {
    const { username, password } = authCredsDTO;
    const user = await this.usersRepository.findOneBy({ username: username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('please check your login creds');
    }
  }
}
