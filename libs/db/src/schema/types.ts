import type { ColumnType, GeneratedAlways } from 'kysely';
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Post = {
  id: GeneratedAlways<string>;
  body: string;
  published: boolean;
  votes: Generated<number>;
  authorId: string;
};
export type User = {
  id: GeneratedAlways<string>;
  email: string;
  username: string;
};
export type DB = {
  Post: Post;
  User: User;
};
