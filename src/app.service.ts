/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ArticleIndexDto, SearchDto } from './dto/article-index.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly esService: ElasticsearchService,
    private readonly configService: ConfigService,
  ) {}

  // private readonly esService: ElasticsearchService;

  public async checkExistIndex() {
    const index = this.configService.get('ES_INDEX') as string;
    const isExisted = (await this.esService.indices.exists({ index })).body;
    // return;
    if (!isExisted) {
      try {
        await this.esService.indices.create({
          index,
          body: {
            settings: {
              analysis: {
                analyzer: {
                  word_delimiter: {
                    tokenizer: 'keyword',
                    filter: ['word_delimiter'],
                  },
                },
              },
            },
            mappings: {
              properties: {
                id: { type: 'keyword' },
                title: { type: 'text', analyzer: 'word_delimiter' },
                content: { type: 'text', analyzer: 'word_delimiter' },
                description: { type: 'text', analyzer: 'word_delimiter' },
                tags: { type: 'keyword' },
                category: { type: 'text' },
                publishedAt: { type: 'date', index: false },
                imageUrl: { type: 'keyword', index: false },
                authorName: { type: 'keyword', index: false },
              },
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  public async indexArticle(data: ArticleIndexDto) {
    const index = this.configService.get('ES_INDEX') as string;
    console.log(data);
    return await this.esService.index({
      index,
      id: data.id,
      body: data,
    });
  }
  public async search(searchDto: SearchDto) {
    console.log(searchDto)
    const index = this.configService.get('ES_INDEX') as string;
    // const pagination: any = {
    //   page: 1,
    //   limit: 10,
    // };
    // const skippedItems = (pagination.page - 1) * pagination.limit;
    const { body } = await this.esService.search<any>({
      index,
      body: this.buildSearchQuery(searchDto),
      // from: skippedItems,
      // size: pagination.limit,
    });
    const totalCount = body.hits.total.value;
    const hits = body.hits.hits;
    const data = hits.map((item: any) => item._source);
    return {
      totalCount,
      data,
    };
  }

  public async home() {
    const index = this.configService.get('ES_INDEX') as string;
    const pagination: any = {
      limit: 10,
    };
    const { body } = await this.esService.search<any>({
      index,
      size: pagination.limit,
    });
    const totalCount = body.hits.total.value;
    const hits = body.hits.hits;
    const data = hits.map((item: any) => item._source);
    return {
      totalCount,
      data,
    };
  }

  public buildSearchQuery(searchDto: SearchDto) {
    const { text, category, tags } = searchDto;
    const mustQuery: any[] = [];
    mustQuery.push({
      multi_match: {
        query: `${text}`,
        type: 'cross_fields',
        fields: ['title', 'content', 'description'],
        operator: 'or',
      },
    });

    const filterQuery: any[] = [];
    if (category && category !== '') {
      filterQuery.push({
        term: {
          category: category,
        },
      });
    }
    if (tags && tags.length > 0) {
      filterQuery.push({
        terms: {
          tags: tags,
        },
      });
    }

    return {
      query: {
        bool: {
          must: mustQuery,
          filter: filterQuery,
        },
      },
    };
  }

  getHello(): string {
    return 'Hello World!';
  }
}
