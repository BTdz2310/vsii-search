import { Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';
import { ArticleIndexDto } from './dto/article-index.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string | undefined {
    return process.env.ES_INDEX;
  }

  @EventPattern('article.index')
  indexArticle(data: ArticleIndexDto) {
    return this.appService.indexArticle(data);
  }

  @EventPattern('article.index')
  index(data: ArticleIndexDto) {
    return this.appService.indexArticle(data);
  }

  @Get('search')
  search(@Query('text') text: string) {
    return this.appService.search(text);
  }

  @Get('home')
  home() {
    return this.appService.home();
  }
}
