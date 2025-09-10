import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';


@Controller('auth') // This is crucial - defines the base path
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login') // This creates POST /auth/login
  async login(@Body() loginDto: any) {
    console.log('Login endpoint hit!');
    return this.authService.login(loginDto);
  }

  @Post('register') // This creates POST /auth/register
  async register(@Body() registerDto: any) {
    console.log('Register endpoint hit!');
    return this.authService.register(registerDto);
  }

  // Test endpoint
  @Get('test')
  test() {
    return { message: 'Auth test endpoint works!' };
  }
}
