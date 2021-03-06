import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll(@Query() query) {
    if (query.type) {
      if (query.important === 'true') {
        if (query.count) {
          return this.postsService.findAllByType(
            query.type,
            query.important,
            query.count,
          );
        } else {
          return "Missing 'count' parameter";
        }
      }
      return this.postsService.findAllByType(query.type);
    }
    return this.postsService.findAll();
  }

  @Get('popular')
  findPopular(@Query() query) {
    if (!query.count) {
      return { error: "'count' parameter is missing" };
    }
    return this.postsService.findPopular(query.count);
  }

  @Get('most-viewed')
  findMostViewed(@Query() query) {
    if (!query.count) {
      return { error: "'count' parameter is missing" };
    }
    return this.postsService.findMostViewed(query.count);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
