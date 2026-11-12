import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateThreadDto } from './dto/create-thread.dto.js';
import { UpdateThreadDto } from './dto/update-thread.dto.js';
import { ThreadsService } from './threads.service.js';

@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @Get() // GET /threads (med deltagere)
  findAll() {
    return this.threadsService.findAll();
  }

  @Get(':id') // GET /threads/:id (med deltagere og beskeder)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.threadsService.findOne(id);
  }

  @Post() // POST /threads
  create(@Body() createThreadDto: CreateThreadDto) {
    return this.threadsService.create(createThreadDto);
  }

  @Patch(':id') // PATCH /threads/:id
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateThreadDto: UpdateThreadDto,
  ) {
    return this.threadsService.update(id, updateThreadDto);
  }

  @Delete(':id') // DELETE /threads/:id
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.threadsService.remove(id);
  }

  @Post(':id/participants/:userId') // POST /threads/1/participants/2
  addParticipant(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.threadsService.addParticipant(id, userId);
  }

  @Delete(':id/participants/:userId') // DELETE /threads/1/participants/2
  removeParticipant(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.threadsService.removeParticipant(id, userId);
  }
}
