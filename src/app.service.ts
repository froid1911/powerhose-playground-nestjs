import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getDocument(drive: string, path: string): string {
    return `${drive} ${path}`;
  }

  addDocument(path: string, document: any): boolean {
    console.log(path, document);
    return true;
  }
}
