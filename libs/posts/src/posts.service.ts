import { Injectable } from '@nestjs/common';
import { DB } from '@app/db';
import { Inject } from '@nestjs/common';
import { InsertObject, Kysely, UpdateObject } from 'kysely';
import { KYSELY_MODULE_CONNECTION_TOKEN } from 'nestjs-kysely';

@Injectable()
export class PostsService {
  constructor(
    @Inject(KYSELY_MODULE_CONNECTION_TOKEN) private readonly db: Kysely<DB>,
  ) {}

  async findAll() {
    return await this.db.selectFrom('Post').selectAll().execute();
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
