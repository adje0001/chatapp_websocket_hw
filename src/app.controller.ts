import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Controller, Get, Header } from '@nestjs/common';

@Controller()
export class AppController {
  // GET / viser testsiden til chatten (public/index.html)
  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  getTestPage(): string {
    return readFileSync(join(process.cwd(), 'public', 'index.html'), 'utf8');
  }
}
