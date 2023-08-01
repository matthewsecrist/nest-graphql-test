import { Injectable } from '@nestjs/common';
import { DB } from '@app/db';
import { InsertObject, Kysely, UpdateObject } from 'kysely';
import { InjectKysely } from 'nestjs-kysely';

interface FindOneOptions {
  id?: string;
  email?: string;
  username?: string;
}

@Injectable()
export class UsersService {
  constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

  async findAll() {
    return await this.db.selectFrom('User').selectAll().execute();
  }

  async findOne(opts: FindOneOptions) {
    if (!opts.id && !opts.email && !opts.username) {
      throw new Error('Requires at least one parameter');
    }

    return await this.db
      .selectFrom('User')
      .selectAll()
      .$if(!!opts.id, (qb) => qb.where('id', '=', opts.id))
      .$if(!!opts.email, (qb) => qb.where('email', '=', opts.email))
      .$if(!!opts.username, (qb) => qb.where('username', '=', opts.username))
      .executeTakeFirst();
  }

  async getById(id: string) {
    return await this.findOne({ id });
  }

  async getByUsername(username: string) {
    return await this.findOne({ username });
  }

  async getByEmail(email: string) {
    return await this.findOne({ email });
  }

  async create(params: InsertObject<DB, 'User'>) {
    return await this.db
      .insertInto('User')
      .values(params)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async update(id: string, params: UpdateObject<DB, 'User'>) {
    return await this.db
      .updateTable('User')
      .set(params)
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }

  async delete(id: string) {
    return await this.db.deleteFrom('User').where('id', '=', id).execute();
  }
}
