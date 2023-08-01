import { Injectable } from '@nestjs/common';
import { DB } from '@app/db';
import { InsertObject, Kysely, UpdateObject } from 'kysely';
import { InjectKysely } from 'nestjs-kysely';

@Injectable()
export class PostsService {
  constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

  async findAll(authorId?: string) {
    return await this.db
      .selectFrom('Post')
      .selectAll()
      .$if(!!authorId, (qb) => qb.where('Post.authorId', '=', authorId))
      .execute();
  }

  async getById(id: string) {
    return await this.db
      .selectFrom('Post')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async getByAuthorId(authorId: string) {
    return await this.db
      .selectFrom('Post')
      .selectAll()
      .where('authorId', '=', authorId)
      .execute();
  }

  async create(params: InsertObject<DB, 'Post'>) {
    return await this.db
      .insertInto('Post')
      .values(params)
      .returningAll()
      .executeTakeFirst();
  }

  async update(id: string, params: UpdateObject<DB, 'Post'>) {
    return await this.db
      .updateTable('Post')
      .set(params)
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async delete(id: string) {
    return await this.db.deleteFrom('Post').where('id', '=', id).execute();
  }
}
