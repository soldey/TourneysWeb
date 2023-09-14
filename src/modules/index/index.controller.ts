import { Controller, Get, Render, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor } from '../../common/response.interceptor';
import { AuthService } from '../auth';
import { MonitorService } from '../monitor/monitor.service';

@Controller()
export class IndexController {
  constructor(
    private readonly authService: AuthService,
    private readonly monitorService: MonitorService,
  ) {
  }

  @Get()
  @Render('index')
  @UseInterceptors(ResponseInterceptor)
  public async getIndex(@Req() req, @Res({ passthrough: true }) res) {
    await this.monitorService.createOrIncrement({ endpoint: "https://soldey.onrender.com/" })
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
    await this.monitorService.createOrIncrement({ endpoint: "https://soldey.onrender.com/profile" })
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
    await this.monitorService.createOrIncrement({ endpoint: "https://soldey.onrender.com/login" })
    return;
  }

  @Get('tournaments')
  @Render('tournaments')
  @UseInterceptors(ResponseInterceptor)
  public async getTournaments(@Req() req, @Res() res) {
    await this.monitorService.createOrIncrement({ endpoint: "https://soldey.onrender.com/tournaments" })
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
    await this.monitorService.createOrIncrement({ endpoint: "https://soldey.onrender.com/change-password" })
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
    await this.monitorService.createOrIncrement({ endpoint: "https://soldey.onrender.com/apply-to-team" })
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
    await this.monitorService.createOrIncrement({ endpoint: "https://soldey.onrender.com/create-team" })
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
    await this.monitorService.createOrIncrement({ endpoint: "https://soldey.onrender.com/create-tournament" })
    const user = await this.authService.retrieveUser(req.cookies['auth_token']);
    return {
      isUserNull: (user == null),
      user: user
    };
  }

  @Get('statistics')
  @Render('stats')
  @UseInterceptors(ResponseInterceptor)
  public async getStats(@Req() req, @Res({ passthrough: true }) res) {
    await this.monitorService.createOrIncrement({ endpoint: "https://soldey.onrender.com/statistics" })
    const user = await this.authService.retrieveUser(req.cookies['auth_token']);
    return {
      isUserNull: (user == null),
      user: user
    };
  }
}
