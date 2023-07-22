import { Injectable } from '@nestjs/common';
import { DB } from '@app/db';
import { Inject } from '@nestjs/common';
import { InsertObject, Kysely, UpdateObject } from 'kysely';
import { KYSELY_MODULE_CONNECTION_TOKEN } from 'nestjs-kysely';

@Injectable()
export class UsersService {
  constructor(
    @Inject(KYSELY_MODULE_CONNECTION_TOKEN) private readonly db: Kysely<DB>,
  ) {}

  async findAll() {
    return await this.db.selectFrom('User').selectAll().execute();
  }

  async getById(id: string) {
    return await this.db
      .selectFrom('User')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async create(params: InsertObject<DB, 'User'>) {
    return await this.db
      .insertInto('User')
      .values(params)
      .returningAll()
      .execute();
  }

  async update(id: string, params: UpdateObject<DB, 'User'>) {
    return await this.db
      .updateTable('User')
      .set(params)
      .where('id', '=', id)
      .execute();
  }

  async delete(id: string) {
    return await this.db.deleteFrom('User').where('id', '=', id).execute();
  }
}
