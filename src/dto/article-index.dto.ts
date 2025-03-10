export class ArticleIndexDto {
  title: string;
  content: string;
  description: string;
  publishedAt: Date;
  imageUrl: string;
  authorName: string;
  tags: string[];
  id: string;
}

export class SearchDto {
  text: string;
  tags: string[];
  category: string;
}
