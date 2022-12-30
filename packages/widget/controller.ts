import HotArticle from '.';
import { Controller } from './utils';
import { Component, Water, Request } from '@pjblog/http';
import { ArticleDBO } from '@pjblog/core';
import { getNode } from '@pjblog/manager';
import { TypeORM } from '@pjblog/typeorm';
import type { EntityManager } from 'typeorm';

interface IArticle {
  title: string,
  id: number,
  code: string,
  ctime: string | Date,
  reads: number,
}

export type IResponse = IArticle[];

@Controller('GET')
export class HotArticlesController extends Component<IResponse> {
  public readonly manager: EntityManager;
  public readonly service: ArticleDBO;
  public readonly container: HotArticle;
  constructor(req: Request) {
    super(req, []);
    this.manager = getNode(TypeORM).value.manager;
    this.container = getNode(HotArticle);
    this.service = new ArticleDBO(this.manager);
  }

  @Water(1)
  public async getArticles() {
    const size = this.container.storage.get('articles');
    const res = await this.service.hotArticles(size);
    this.res = res.map(r => {
      return {
        id: r.id,
        title: r.article_title,
        code: r.article_code,
        ctime: r.gmt_create,
        reads: r.article_read_count,
      }
    })
  }
}