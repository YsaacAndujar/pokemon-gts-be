import { Body, Controller, Get, Post, Put, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { ChangePasswordByCodeDto, ChangePasswordDto, ForgotPasswordDto, LoginDto, SigninDto, UpdateProfileDto } from './dto';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto)
  }
  
  @Public()
  @Post('signin')
  async signin(@Body() signinDto: SigninDto) {
    return await this.authService.signin(signinDto)
  }
  
  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto)
  }
  
  @Put('password')
  async changePassword(@Req() request, @Body() changePasswordDto: ChangePasswordDto) {
    return await this.authService.changePassword(changePasswordDto, request.user.userId)
  }
  
  @Public()
  @Put('password-by-code')
  async changePasswordByCode(@Body() changePasswordByCodeDto: ChangePasswordByCodeDto) {
    return await this.authService.changePasswordByCode(changePasswordByCodeDto)
  }
  
  @Put('profile')
  async updateProfile(@Req() request, @Body() updateProfileDto: UpdateProfileDto) {
    return await this.authService.updateProfile(updateProfileDto, request.user.userId)
  }
  
  @Get('profile')
  async getProfile(@Req() request) {
    return await this.authService.getProfile(request.user.userId)
  }
}
