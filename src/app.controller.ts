/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
  search(@Query() query: any) {
    console.log(query);
    return this.appService.search({
      text: query.text ?? '',
      tags:
        Array.isArray(query) && query.length > 0
          ? query
          : query && typeof query === 'object' && 'tags' in query
            ? Array.isArray(query.tags)
              ? query.tags
              : [query.tags]
            : [],
      category: query.category ?? '',
    });
  }

  @Get('home')
  home() {
    return this.appService.home();
  }
}
