import { Controller, Get, Render, UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor } from '../../common/response.interceptor';

@Controller()
export class IndexController {

  @Get()
  @Render('index')
  @UseInterceptors(ResponseInterceptor)
  public getIndex() {
    const user = {
      login: "soldey"
    };
    return {
      isUserNull: (user == null),
      user: user
    };
  }
}
