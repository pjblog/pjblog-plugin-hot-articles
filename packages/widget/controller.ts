import { Controller } from './utils';
import { Component, Water } from '@pjblog/http';
import { ArticleDBO } from '@pjblog/core';
import type HotArticle from '.';

interface IArticle {
  title: string,
  id: number,
  code: string,
  ctime: string | Date,
  reads: number,
}

type IResponse = IArticle[];

@Controller('GET')
export class HotArticlesController extends Component<HotArticle, IResponse> {
  get manager() {
    return this.container.connection.manager;
  }
  
  public response(): IResponse {
    return [];
  }

  @Water()
  public getArticles() {
    const service = new ArticleDBO(this.manager);
    return async (context: IResponse) => {
      const res = await service.hotArticles(this.container.storage.get('articles'));
      context.push(...res.map(r => {
        return {
          id: r.id,
          title: r.article_title,
          code: r.article_code,
          ctime: r.gmt_create,
          reads: r.article_read_count,
        }
      }))
    }
  }
}