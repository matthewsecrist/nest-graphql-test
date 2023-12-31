import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Post } from './post.model';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field(() => [Post])
  posts: Post[];

  @Field(() => [User])
  following: User[];

  @Field(() => [User])
  followers: User[];
}
