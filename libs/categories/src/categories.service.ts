import { DB } from '@app/db';
import { Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { InjectKysely } from 'nestjs-kysely';

@Injectable()
export class CategoriesService {
  constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

  async list() {
    return await this.db.selectFrom('Category').selectAll().execute();
  }

  async create(name: string) {
    return await this.db
      .insertInto('Category')
      .values({ name })
      .returningAll()
      .executeTakeFirst();
  }

  async fetchById(categoryId: string) {
    return await this.db
      .selectFrom('Category')
      .selectAll()
      .where('Category.id', '=', categoryId)
      .executeTakeFirst();
  }

  async removePostFromCategory(categoryId: string, postId: string) {
    return await this.db
      .deleteFrom('PostCategories')
      .where(({ eb, and }) =>
        and([
          eb('PostCategories.categoryId', '=', categoryId),
          eb('PostCategories.postId', '=', postId),
        ]),
      )
      .executeTakeFirst();
  }

  async associatePost(categoryId: string, postId: string) {
    return await this.db
      .insertInto('PostCategories')
      .values({ postId, categoryId })
      .returningAll()
      .executeTakeFirst();
  }

  async fetchCategoriesByPostId(postId: string) {
    return await this.db
      .selectFrom('Category')
      .selectAll()
      .where(({ exists, selectFrom }) =>
        exists(
          selectFrom('PostCategories')
            .whereRef('Category.id', '=', 'PostCategories.categoryId')
            .where('PostCategories.postId', '=', postId),
        ),
      )
      .execute();
  }

  async fetchPostsByCategoryId(categoryId: string) {
    return await this.db
      .selectFrom('Post')
      .selectAll()
      .where(({ exists, selectFrom }) =>
        exists(
          selectFrom('PostCategories')
            .whereRef('Post.id', '=', 'PostCategories.postId')
            .where('PostCategories.categoryId', '=', categoryId),
        ),
      )
      .execute();
  }
}
