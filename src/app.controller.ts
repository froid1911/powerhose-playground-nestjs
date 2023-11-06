import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Request,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/document')
  getDocument(@Query('drive') drive, @Query('path') path): string {
    return this.appService.getDocument(drive, path);
  }

  @Post('/document')
  addDocument(@Body('path') path, @Body('document') document): boolean {
    return this.appService.addDocument(path, document);
  }
}
