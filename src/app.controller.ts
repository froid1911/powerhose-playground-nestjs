import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { AddFileInput } from 'document-model-libs/document-drive';
import { Document } from 'document-model/document';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/document')
  getDocument(@Query('drive') drive, @Query('path') path): Promise<string> {
    Logger.debug(`getDocument: ${drive} ${path}`);
    return this.appService.getDocument(drive, path);
  }

  @Post('/document')
  addDocument(
    @Body('path') path: AddFileInput,
    @Body('document') document: Document,
  ): Promise<boolean> {
    Logger.debug(`addDocument: ${path.path}`);
    return this.appService.addDocument(path, document);
  }
}
