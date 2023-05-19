import { Controller, Get, Render, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor } from '../../common/response.interceptor';
import { AuthService } from '../auth';

@Controller()
export class IndexController {
  constructor(
    private readonly authService: AuthService,
  ) {
  }

  @Get()
  @Render('index')
  @UseInterceptors(ResponseInterceptor)
  public async getIndex(@Req() req, @Res({ passthrough: true }) res) {
    const user = await this.authService.retrieveUser(req.cookies['auth_token']);
    return {
      isUserNull: (user == null),
      user: user
    };
  }

  @Get('profile')
  @Render('profile')
  @UseInterceptors(ResponseInterceptor)
  public async getProfile(@Req() req, @Res({ passthrough: true }) res) {
    const user = await this.authService.retrieveUser(req.cookies['auth_token']);
    return {
      isUserNull: (user == null),
      user: user
    };
  }

  @Get('login')
  @Render('login')
  @UseInterceptors(ResponseInterceptor)
  public async getLogin() {
    return;
  }

  @Get('tournaments')
  @Render('tournaments')
  @UseInterceptors(ResponseInterceptor)
  public async getTournaments(@Req() req, @Res() res) {
    const user = await this.authService.retrieveUser(req.cookies['auth_token']);
    return {
      isUserNull: (user == null),
      user: user
    };
  }

  @Get('change-password')
  @Render('change-password')
  @UseInterceptors(ResponseInterceptor)
  public async changePassword(@Req() req, @Res() res) {
    const user = await this.authService.retrieveUser(req.cookies['auth_token']);
    return {
      isUserNull: (user == null),
      user: user
    };
  }

  @Get('apply-to-team')
  @Render('apply-to-team')
  @UseInterceptors(ResponseInterceptor)
  public async applyToTeam(@Req() req, @Res() res) {
    const user = await this.authService.retrieveUser(req.cookies['auth_token']);
    return {
      isUserNull: (user == null),
      user: user
    };
  }

  @Get('create-team')
  @Render('create-team')
  @UseInterceptors(ResponseInterceptor)
  public async createTeam(@Req() req, @Res() res) {
    const user = await this.authService.retrieveUser(req.cookies['auth_token']);
    return {
      isUserNull: (user == null),
      user: user
    };
  }

  @Get('create-tournament')
  @Render('create-tournament')
  @UseInterceptors(ResponseInterceptor)
  public async createTournament(@Req() req, @Res() res) {
    const user = await this.authService.retrieveUser(req.cookies['auth_token']);
    return {
      isUserNull: (user == null),
      user: user
    };
  }
}
