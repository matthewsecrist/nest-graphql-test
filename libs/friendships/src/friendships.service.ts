import { DB } from '@app/db';
import { Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { InjectKysely } from 'nestjs-kysely';

@Injectable()
export class FriendshipsService {
  constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

  async follow(followerId: string, followeeId: string) {
    return await this.db
      .insertInto('Friendships')
      .values({ followerId, followeeId })
      .returningAll()
      .executeTakeFirst();
  }

  async deleteFollow(followerId: string, followeeId: string) {
    return await this.db
      .deleteFrom('Friendships')
      .where(({ and, eb }) =>
        and([
          eb('Friendships.followerId', '=', followerId),
          eb('Friendships.followeeId', '=', followeeId),
        ]),
      )
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async followers(userId: string) {
    return await this.db
      .selectFrom('User')
      .selectAll()
      .where(({ exists, selectFrom }) =>
        exists(
          selectFrom('Friendships')
            .whereRef('Friendships.followerId', '=', 'User.id')
            .where('Friendships.followeeId', '=', userId),
        ),
      )
      .execute();
  }

  async following(userId: string) {
    return await this.db
      .selectFrom('User')
      .selectAll()
      .where(({ exists, selectFrom }) =>
        exists(
          selectFrom('Friendships')
            .whereRef('Friendships.followeeId', '=', 'User.id')
            .where('Friendships.followerId', '=', userId),
        ),
      )
      .execute();
  }
}
